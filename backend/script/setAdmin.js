// backend/scripts/setAdmin.js
import 'dotenv/config';
import admin from 'firebase-admin';

if (!process.env.GOOGLE_APPLICATION_CREDENTIALS) {
  console.error('Set GOOGLE_APPLICATION_CREDENTIALS al tuo service account JSON');
  process.exit(1);
}

if (!admin.apps.length) {
  admin.initializeApp({ credential: admin.credential.applicationDefault() });
}

const email = (process.argv[2] || '').trim();
if (!email) {
  console.error('Uso: node scripts/setAdmin.js email@dominio');
  process.exit(1);
}

try {
  const user = await admin.auth().getUserByEmail(email);
  await admin.auth().setCustomUserClaims(user.uid, { admin: true });
  console.log(`OK: ${email} ora ha claim admin=true`);
  process.exit(0);
} catch (e) {
  console.error('Errore:', e.message);
  process.exit(1);
}
