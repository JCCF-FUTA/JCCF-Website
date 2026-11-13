'use client';

import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { DocumentsIcon } from '@sanity/icons/Documents';
import { apiVersion, dataset, projectId } from './lib/sanity/env';
import { schemaTypes, SINGLETONS } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import { FellowshipImport } from './sanity/tools/FellowshipImport';

/**
 * Sanity Studio at /studio (PRD F1).
 * Roles: site owners (PRO, General Secretary) are Sanity "Administrator"; Publicity Unit admins are "Editor".
 * Only Administrators can publish Give settings (bank details and give categories).
 */
export default defineConfig({
  name: 'jccf-futa',
  title: 'JCCF FUTA Studio',
  basePath: '/studio',
  projectId: projectId || 'missing-project-id',
  dataset,
  schema: {
    types: schemaTypes,
    // Singletons can't be created from "New document"
    templates: (templates) => templates.filter(({ schemaType }) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (prev, ctx) => {
      if (SINGLETONS.includes(ctx.schemaType)) {
        prev = prev.filter(({ action }) => action && ['publish', 'discardChanges', 'restore'].includes(action));
      }
      if (ctx.schemaType === 'giveSettings') {
        const isOwner = ctx.currentUser?.roles?.some((r) => r.name === 'administrator');
        if (!isOwner) prev = prev.filter(({ action }) => action !== 'publish');
      }
      return prev;
    },
  },
  plugins: [
    structureTool({ structure }),
    visionTool({ defaultApiVersion: apiVersion }),
  ],
  tools: (prev) => [
    ...prev,
    { name: 'import', title: 'Import fellowships', icon: DocumentsIcon, component: FellowshipImport },
  ],
});
