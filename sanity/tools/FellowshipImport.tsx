'use client';

/**
 * Fellowship bulk import (PRD F2) — a Studio tool at /studio/import.
 * 1. Download the template (CSV, opens in Excel/Sheets).
 * 2. Upload .xlsx or .csv → preview: rows to add, rows to update (matched by name), rows with errors.
 * 3. Nothing is written until "Import" is pressed. Error rows are skipped. Fellowships missing
 *    from the sheet are never deleted (mark them inactive instead).
 */
import { Badge, Box, Button, Card, Flex, Heading, Stack, Text } from '@sanity/ui';
import { useMemo, useState } from 'react';
import { useClient } from 'sanity';

const COLUMNS = [
  'name', 'short_name', 'description', 'meeting_days', 'meeting_time', 'venue', 'president_name',
  'contact_phone', 'whatsapp_link', 'instagram', 'facebook', 'logo_url', 'status',
] as const;
type Col = (typeof COLUMNS)[number];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type Existing = { _id: string; name: string };
type Parsed = {
  row: number;
  values: Partial<Record<Col, string>>;
  errors: string[];
  action: 'add' | 'update' | 'error';
  existingId?: string;
  doc?: Record<string, unknown>;
};

const slugify = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
const isUrl = (s: string) => /^https?:\/\/\S+$/i.test(s);

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(cell); rows.push(row); row = []; cell = '';
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((x) => x.trim()));
}

function normaliseDays(raw: string): { days: string[]; bad: string[] } {
  const parts = raw.split(/[,;/&]|\band\b/i).map((p) => p.trim()).filter(Boolean);
  const days: string[] = [];
  const bad: string[] = [];
  for (const p of parts) {
    const d = DAYS.find((x) => x.toLowerCase().startsWith(p.toLowerCase().replace(/s$/, '').slice(0, 3)));
    if (d && p.length >= 3) { if (!days.includes(d)) days.push(d); } else bad.push(p);
  }
  return { days, bad };
}

function templateCsv() {
  const example = ['Scripture Union Campus Fellowship', 'SUCF', 'A short description of the fellowship.', 'Sunday, Wednesday', '8:00 AM', 'Lecture Theatre A', 'Full Name', '08012345678', 'https://chat.whatsapp.com/…', 'https://instagram.com/…', 'https://facebook.com/…', '', 'active'];
  const esc = (s: string) => (/[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s);
  return `${COLUMNS.join(',')}\n${example.map(esc).join(',')}\n`;
}

export function FellowshipImport() {
  const client = useClient({ apiVersion: '2025-10-01' });
  const [rows, setRows] = useState<Parsed[] | null>(null);
  const [fileName, setFileName] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ tone: 'positive' | 'critical' | 'caution'; text: string } | null>(null);

  const summary = useMemo(() => ({
    add: rows?.filter((r) => r.action === 'add').length ?? 0,
    update: rows?.filter((r) => r.action === 'update').length ?? 0,
    error: rows?.filter((r) => r.action === 'error').length ?? 0,
  }), [rows]);

  async function onFile(file: File) {
    setMessage(null);
    setRows(null);
    setFileName(file.name);
    try {
      let table: string[][];
      if (/\.csv$/i.test(file.name)) {
        table = parseCsv(await file.text());
      } else if (/\.xlsx$/i.test(file.name)) {
        const { readSheet } = await import('read-excel-file/browser');
        const data = await readSheet(file);
        table = data.map((r) => r.map((c) => (c == null ? '' : c instanceof Date ? c.toISOString() : String(c))));
      } else {
        setMessage({ tone: 'critical', text: 'Please upload an .xlsx or .csv file.' });
        return;
      }
      if (table.length < 2) { setMessage({ tone: 'critical', text: 'The sheet has no data rows.' }); return; }

      const header = table[0].map((h) => h.trim().toLowerCase().replace(/\s+/g, '_'));
      const missing = ['name'].filter((c) => !header.includes(c));
      if (missing.length) { setMessage({ tone: 'critical', text: `Missing column: ${missing.join(', ')}. Use the template.` }); return; }

      const existing = await client.fetch<Existing[]>(`*[_type == "fellowship" && !(_id in path("drafts.**"))]{ _id, name }`);
      const byName = new Map(existing.map((e) => [e.name.trim().toLowerCase(), e._id]));
      const seen = new Set<string>();

      const parsed: Parsed[] = table.slice(1).map((cells, i) => {
        const values: Partial<Record<Col, string>> = {};
        header.forEach((h, j) => { if ((COLUMNS as readonly string[]).includes(h)) values[h as Col] = (cells[j] ?? '').trim(); });
        const errors: string[] = [];
        const name = values.name ?? '';
        if (!name) errors.push('Name is empty.');
        if (name && seen.has(name.toLowerCase())) errors.push('Duplicate name in this sheet.');
        seen.add(name.toLowerCase());
        const { days, bad } = normaliseDays(values.meeting_days ?? '');
        if (bad.length) errors.push(`Unknown meeting day: ${bad.join(', ')}.`);
        for (const k of ['whatsapp_link', 'instagram', 'facebook', 'logo_url'] as const) {
          if (values[k] && !isUrl(values[k]!)) errors.push(`${k} must be a full link starting with https://`);
        }
        const status = (values.status || 'active').toLowerCase();
        if (!['active', 'inactive'].includes(status)) errors.push('status must be active or inactive.');
        if (values.contact_phone && !/^\+?[\d\s()-]{7,20}$/.test(values.contact_phone)) errors.push('contact_phone looks wrong.');

        const doc: Record<string, unknown> = {
          name,
          shortName: values.short_name || undefined,
          description: values.description || undefined,
          meetingDays: days,
          meetingTime: values.meeting_time || undefined,
          venue: values.venue || undefined,
          presidentName: values.president_name || undefined,
          phone: values.contact_phone || undefined,
          whatsapp: values.whatsapp_link || undefined,
          instagram: values.instagram || undefined,
          facebook: values.facebook || undefined,
          status,
        };
        Object.keys(doc).forEach((k) => doc[k] === undefined && delete doc[k]);
        const existingId = byName.get(name.toLowerCase());
        return { row: i + 2, values, errors, action: errors.length ? 'error' : existingId ? 'update' : 'add', existingId, doc };
      });
      setRows(parsed);
    } catch (err) {
      console.error(err);
      setMessage({ tone: 'critical', text: 'We couldn’t read that file. Save it as .xlsx or .csv using the template and try again.' });
    }
  }

  async function uploadLogo(url: string) {
    try {
      const res = await fetch(url);
      if (!res.ok) return null;
      const asset = await client.assets.upload('image', await res.blob(), { filename: url.split('/').pop() || 'logo' });
      return { _type: 'image', asset: { _type: 'reference', _ref: asset._id }, alt: 'Fellowship logo' };
    } catch {
      return null; // CORS or a dead link — skip the logo, keep the row
    }
  }

  async function runImport() {
    if (!rows) return;
    setBusy(true);
    setMessage(null);
    const logoFailures: number[] = [];
    try {
      const tx = client.transaction();
      for (const r of rows) {
        if (r.action === 'error' || !r.doc) continue;
        const fields: Record<string, unknown> = { ...r.doc };
        if (r.values.logo_url) {
          const logo = await uploadLogo(r.values.logo_url);
          if (logo) fields.logo = logo; else logoFailures.push(r.row);
        }
        if (r.action === 'update' && r.existingId) {
          tx.patch(r.existingId, (p) => p.set(fields));
        } else {
          const slug = slugify(String(fields.shortName || fields.name));
          tx.createIfNotExists({ _id: `fellowship-${slug}`, _type: 'fellowship', slug: { _type: 'slug', current: slug }, type: 'fellowship', ...fields });
        }
      }
      await tx.commit({ autoGenerateArrayKeys: true });
      setMessage({
        tone: logoFailures.length ? 'caution' : 'positive',
        text: `Imported: ${summary.add} added, ${summary.update} updated, ${summary.error} skipped.` +
          (logoFailures.length ? ` Logos could not be fetched for rows ${logoFailures.join(', ')} — upload them by hand.` : '') +
          ' The website updates within a minute.',
      });
      setRows(null);
    } catch (err) {
      console.error(err);
      setMessage({ tone: 'critical', text: 'The import failed and nothing was changed. Check your connection and permissions, then try again.' });
    } finally {
      setBusy(false);
    }
  }

  const download = () => {
    const blob = new Blob([templateCsv()], { type: 'text/csv;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'jccf-fellowships-template.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <Box padding={[3, 4, 5]} style={{ maxWidth: 1100, margin: '0 auto' }}>
      <Stack gap={5}>
        <Stack gap={3}>
          <Heading as="h1" size={3}>Import fellowships</Heading>
          <Text muted size={2}>
            Update every fellowship at once from a spreadsheet. Rows are matched by <strong>name</strong>: existing fellowships are updated, new ones are added.
            Fellowships missing from the sheet are left alone — mark them inactive instead.
          </Text>
        </Stack>

        <Card padding={4} radius={3} tone="primary" border>
          <Flex gap={3} wrap="wrap" align="center">
            <Box flex={1}>
              <Text size={2} weight="semibold">1. Get the template</Text>
              <Box marginTop={2}><Text size={1} muted>Columns: {COLUMNS.join(', ')}. Meeting days: comma separated, e.g. “Sunday, Wednesday”.</Text></Box>
            </Box>
            <Button text="Download template (.csv)" mode="ghost" onClick={download} />
          </Flex>
        </Card>

        <Card padding={4} radius={3} border>
          <Stack gap={3}>
            <Text size={2} weight="semibold">2. Upload your sheet (.xlsx or .csv)</Text>
            <input type="file" accept=".xlsx,.csv" onChange={(e) => e.target.files?.[0] && onFile(e.target.files[0])} />
            {fileName && <Text size={1} muted>{fileName}</Text>}
          </Stack>
        </Card>

        {message && <Card padding={4} radius={3} tone={message.tone} border><Text size={2}>{message.text}</Text></Card>}

        {rows && (
          <Stack gap={4}>
            <Flex gap={2} wrap="wrap" align="center">
              <Text size={2} weight="semibold">3. Check the preview</Text>
              <Badge tone="positive">{summary.add} to add</Badge>
              <Badge tone="primary">{summary.update} to update</Badge>
              <Badge tone="critical">{summary.error} with errors (skipped)</Badge>
            </Flex>
            <Card radius={3} border style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr style={{ textAlign: 'left' }}>
                    {['Row', 'Action', 'Name', 'Days', 'Time', 'Venue', 'Problems'].map((h) => <th key={h} style={{ padding: '8px 12px', borderBottom: '1px solid var(--card-border-color)' }}>{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.row} style={{ background: r.action === 'error' ? 'var(--card-badge-critical-bg-color, #fde8e8)' : undefined }}>
                      <td style={{ padding: '8px 12px' }}>{r.row}</td>
                      <td style={{ padding: '8px 12px' }}><Badge tone={r.action === 'add' ? 'positive' : r.action === 'update' ? 'primary' : 'critical'}>{r.action}</Badge></td>
                      <td style={{ padding: '8px 12px' }}>{r.values.name}</td>
                      <td style={{ padding: '8px 12px' }}>{(r.doc?.meetingDays as string[] | undefined)?.join(', ')}</td>
                      <td style={{ padding: '8px 12px' }}>{r.values.meeting_time}</td>
                      <td style={{ padding: '8px 12px' }}>{r.values.venue}</td>
                      <td style={{ padding: '8px 12px', color: 'var(--card-badge-critical-fg-color, #b00)' }}>{r.errors.join(' ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Card>
            <Flex gap={3}>
              <Button text={busy ? 'Importing…' : `Import ${summary.add + summary.update} rows`} tone="primary" disabled={busy || summary.add + summary.update === 0} onClick={runImport} loading={busy} />
              <Button text="Cancel" mode="ghost" disabled={busy} onClick={() => { setRows(null); setFileName(''); }} />
            </Flex>
          </Stack>
        )}
      </Stack>
    </Box>
  );
}
