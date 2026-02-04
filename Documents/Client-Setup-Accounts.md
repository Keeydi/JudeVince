# Create Admin and Guard Accounts on Each Client PC

Run this **on each client’s PC** (or once per installation) so they have their **own** Admin and Guard login accounts stored in that PC’s database.

---

## Option 1: Double‑click (Windows)

1. Copy the whole **BantayPlaka** project (or at least the `server` folder with Node.js installed) to the client PC.
2. Open the **server** folder.
3. Double‑click **`CREATE-ACCOUNTS.bat`**.
4. Follow the prompts to enter Admin email/password and add Guard account(s).

---

## Option 2: Config file (no typing each time)

1. In the **server** folder, copy **`setup-accounts.config.example.json`** and rename the copy to **`setup-accounts.config.json`**.
2. Edit **`setup-accounts.config.json`** with the client’s chosen credentials, for example:

```json
{
  "admin": {
    "email": "admin@client-site.local",
    "password": "TheirSecurePassword123!",
    "name": "Admin"
  },
  "guards": [
    {
      "email": "guard@client-site.local",
      "password": "GuardPass123!",
      "name": "Guard One"
    }
  ]
}
```

3. Run from the **server** folder:

```bash
node setup-accounts.js
```

Accounts are created/updated in the local database; no prompts.

---

## Option 3: Command line (any OS)

From the **server** folder:

```bash
node setup-accounts.js
```

Then answer the prompts for Admin and Guard(s).

---

## What gets stored

- **Database:** `server/parking.db` (SQLite).
- **Tables used:** `users`, `notification_preferences`.
- **Roles:** `admin` (one per install, id `USER-ADMIN-001`) and `guard` (as many as you add).
- Passwords are stored as SHA‑256 hashes (same as app login).

Each client PC has its **own** `parking.db`, so each client gets their **own** Admin and Guard accounts.
