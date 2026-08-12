import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const STORE_PATH = path.join(__dirname, '..', 'uploads', 'local-auth-store.json');

const ensureStore = async () => {
  await fs.mkdir(path.dirname(STORE_PATH), { recursive: true });
  try {
    await fs.access(STORE_PATH);
  } catch {
    await fs.writeFile(STORE_PATH, JSON.stringify({ users: [] }, null, 2), 'utf8');
  }
};

export const readLocalUsers = async () => {
  await ensureStore();
  const raw = await fs.readFile(STORE_PATH, 'utf8');
  const parsed = JSON.parse(raw || '{"users":[]}');
  return Array.isArray(parsed.users) ? parsed.users : [];
};

export const writeLocalUsers = async (users) => {
  await ensureStore();
  await fs.writeFile(STORE_PATH, JSON.stringify({ users }, null, 2), 'utf8');
};
