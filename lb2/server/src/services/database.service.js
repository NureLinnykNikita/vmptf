import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.resolve(__dirname, '../data/db.json');

export async function readDatabase() {
  const rawData = await fs.readFile(DB_PATH, 'utf-8');
  return JSON.parse(rawData);
}

export async function writeDatabase(data) {
  await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

export function getNextId(collection) {
  if (!collection.length) {
    return 1;
  }

  return Math.max(...collection.map(item => item.id)) + 1;
}
