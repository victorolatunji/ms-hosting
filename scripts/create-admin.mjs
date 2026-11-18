// Prints the SQL to add (or reset) an admin login for /admin.
// The password is hashed here and never stored in plain text.
// Run from the project root:  node scripts/create-admin.mjs
// Then paste the printed SQL into Supabase > SQL Editor > Run.
import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import bcrypt from "bcryptjs";

const rl = createInterface({ input: stdin, output: stdout });
const email = (await rl.question("Admin email: ")).trim().toLowerCase();
const name = (await rl.question("First name (shown on the dashboard): ")).trim();
const password = await rl.question("Password (12+ characters): ");
rl.close();

if (!email.includes("@") || password.length < 12) {
  console.error("\nNeed a valid email and a password of at least 12 characters.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);
const q = (s) => `'${s.replace(/'/g, "''")}'`;
console.log(`\n-- Paste into Supabase SQL Editor:\ninsert into public.admin_users (email, name, password_hash)\nvalues (${q(email)}, ${q(name)}, ${q(hash)})\non conflict (email) do update set name = excluded.name, password_hash = excluded.password_hash;\n`);
