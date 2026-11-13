'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getStaff, supabaseServer } from '@/lib/supabase/server';

export async function signIn(_: { error?: string } | undefined, form: FormData) {
  const sb = await supabaseServer();
  if (!sb) return { error: 'Supabase is not configured.' };
  const { error } = await sb.auth.signInWithPassword({
    email: String(form.get('email') ?? '').trim(),
    password: String(form.get('password') ?? ''),
  });
  if (error) return { error: 'Email or password is incorrect.' };
  redirect('/owner');
}

export async function signOut() {
  const sb = await supabaseServer();
  await sb?.auth.signOut();
  redirect('/owner/login');
}

export async function setPrayed(id: number, prayed: boolean) {
  const staff = await getStaff();
  if (staff?.role !== 'owner') return;
  await staff.sb.from('prayer_requests').update({ prayed_for: prayed, prayed_at: prayed ? new Date().toISOString() : null }).eq('id', id);
  revalidatePath('/owner/prayer');
}

export async function setHandled(id: number, handled: boolean) {
  const staff = await getStaff();
  if (staff?.role !== 'owner' && staff?.role !== 'admin') return;
  await staff.sb.from('contact_messages').update({ handled }).eq('id', id);
  revalidatePath('/owner/messages');
}
