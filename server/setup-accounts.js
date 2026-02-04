#!/usr/bin/env node
/**
 * BantayPlaka – Create Admin and Guard login accounts on this PC.
 * Run once per client installation to set up their own accounts.
 *
 * Usage:
 *   1. With config file: Copy setup-accounts.config.example.json to setup-accounts.config.json,
 *      edit it with your admin and guard credentials, then run: node setup-accounts.js
 *   2. Interactive: Run node setup-accounts.js and follow the prompts.
 *
 * Run from the server folder:  node setup-accounts.js
 */

import db from './database.js';
import crypto from 'crypto';
import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONFIG_PATH = path.join(__dirname, 'setup-accounts.config.json');
const EXAMPLE_PATH = path.join(__dirname, 'setup-accounts.config.example.json');

function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

function ensureNotificationPreferences(userId) {
  const now = new Date().toISOString();
  try {
    db.prepare(`
      INSERT OR IGNORE INTO notification_preferences (userId, plate_not_visible, warning_expired, vehicle_detected, incident_created, updatedAt)
      VALUES (?, 1, 1, 1, 1, ?)
    `).run(userId, now);
  } catch (e) {
    // already exists
  }
}

function createOrUpdateAdmin(email, password, name = 'Admin') {
  const emailNorm = email.toLowerCase().trim();
  const passwordHash = hashPassword(password);
  const adminId = 'USER-ADMIN-001';
  const existingByEmail = db.prepare('SELECT * FROM users WHERE email = ?').get(emailNorm);
  const existingById = db.prepare('SELECT * FROM users WHERE id = ?').get(adminId);

  if (existingByEmail) {
    db.prepare(`UPDATE users SET password = ?, name = ?, role = ? WHERE email = ?`).run(passwordHash, name || 'Admin', 'admin', emailNorm);
    console.log('  Admin updated:', emailNorm);
  } else if (existingById) {
    db.prepare(`UPDATE users SET email = ?, password = ?, name = ?, role = ? WHERE id = ?`).run(emailNorm, passwordHash, name || 'Admin', 'admin', adminId);
    console.log('  Admin updated:', emailNorm);
  } else {
    const now = new Date().toISOString();
    db.prepare(`
      INSERT INTO users (id, email, password, name, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)
    `).run(adminId, emailNorm, passwordHash, name || 'Admin', 'admin', now);
    ensureNotificationPreferences(adminId);
    console.log('  Admin created:', emailNorm);
  }
}

function createGuard(email, password, name) {
  const emailNorm = email.toLowerCase().trim();
  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(emailNorm);
  if (existing) {
    db.prepare(`UPDATE users SET password = ?, name = ?, role = ? WHERE id = ?`).run(hashPassword(password), name || emailNorm.split('@')[0], 'guard', existing.id);
    console.log('  Guard updated:', emailNorm);
    return;
  }
  const userId = `USER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const now = new Date().toISOString();
  db.prepare(`
    INSERT INTO users (id, email, password, name, role, createdAt) VALUES (?, ?, ?, ?, ?, ?)
  `).run(userId, emailNorm, hashPassword(password), name || emailNorm.split('@')[0], 'guard', now);
  ensureNotificationPreferences(userId);
  console.log('  Guard created:', emailNorm);
}

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_PATH)) {
      const raw = fs.readFileSync(CONFIG_PATH, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Could not read config:', e.message);
  }
  return null;
}

function runFromConfig(config) {
  if (!config.admin || !config.admin.email || !config.admin.password) {
    console.error('Config must have admin.email and admin.password');
    process.exit(1);
  }
  console.log('Creating accounts from setup-accounts.config.json...');
  createOrUpdateAdmin(config.admin.email, config.admin.password, config.admin.name);
  const guards = config.guards || [];
  for (const g of guards) {
    if (g.email && g.password) createGuard(g.email, g.password, g.name);
  }
  console.log('\nDone. You can log in with the admin and guard accounts you defined.');
}

function ask(rl, question, defaultValue = '') {
  const prompt = defaultValue ? `${question} [${defaultValue}]: ` : `${question}: `;
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => resolve(answer.trim() || defaultValue));
  });
}

async function runInteractive() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log('\n--- BantayPlaka: Create Admin and Guard accounts ---\n');
  const adminEmail = await ask(rl, 'Admin email', 'admin@bantayplaka.local');
  const adminPassword = await ask(rl, 'Admin password', 'BantayPlaka123!');
  const adminName = await ask(rl, 'Admin display name', 'Admin');
  createOrUpdateAdmin(adminEmail, adminPassword, adminName);
  console.log('');
  let addGuard = (await ask(rl, 'Add a Guard account? (y/n)', 'y')).toLowerCase();
  while (addGuard === 'y' || addGuard === 'yes') {
    const guardEmail = await ask(rl, 'Guard email');
    if (!guardEmail) break;
    const guardPassword = await ask(rl, 'Guard password');
    if (!guardPassword) break;
    const guardName = await ask(rl, 'Guard display name', guardEmail.split('@')[0]);
    createGuard(guardEmail, guardPassword, guardName);
    addGuard = (await ask(rl, 'Add another Guard? (y/n)', 'n')).toLowerCase();
  }
  rl.close();
  console.log('\nDone. You can now log in with the Admin and Guard accounts.');
}

async function main() {
  try {
    db.prepare('SELECT 1').get();
  } catch (e) {
    console.error('Database not ready:', e?.message || e);
    process.exit(1);
  }
  if (!fs.existsSync(EXAMPLE_PATH)) writeExampleConfig();
  const config = loadConfig();
  if (config) {
    runFromConfig(config);
  } else {
    await runInteractive();
  }
  if (typeof db.saveImmediate === 'function') db.saveImmediate();
  if (typeof db.close === 'function') db.close();
  setImmediate(() => process.exit(0));
}

function writeExampleConfig() {
  const example = {
    admin: {
      email: 'admin@bantayplaka.local',
      password: 'BantayPlaka123!',
      name: 'Admin'
    },
    guards: [
      { email: 'guard1@bantayplaka.local', password: 'Guard123!', name: 'Guard One' },
      { email: 'guard2@bantayplaka.local', password: 'Guard123!', name: 'Guard Two' }
    ]
  };
  fs.writeFileSync(EXAMPLE_PATH, JSON.stringify(example, null, 2), 'utf8');
}

main().catch((err) => {
  console.error('Error:', err?.message || err);
  process.exit(1);
});
