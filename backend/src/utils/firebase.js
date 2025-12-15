// src/utils/firebase.js
import 'dotenv/config';
import admin from 'firebase-admin';

/**
 * BACKEND: usa il Service Account (sa.json) tramite GOOGLE_APPLICATION_CREDENTIALS.
 * Assicurati che nel file .env del backend ci sia:
 *   GOOGLE_APPLICATION_CREDENTIALS=/workspaces/dev/backend/sa.json
 * e che quel file esista con la chiave scaricata da Firebase.
 */
const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS;
if (!gac) {
  console.warn('[firebase-admin] GOOGLE_APPLICATION_CREDENTIALS non impostata: le API admin richiederanno una key valida.');
}

if (gac && !admin.apps.length) {
  console.log('[firebase-admin] Using applicationDefault:', gac);
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

export const firestore = admin.apps.length ? admin.firestore() : null;
export const authAdmin  = admin.apps.length ? admin.auth() : null;
