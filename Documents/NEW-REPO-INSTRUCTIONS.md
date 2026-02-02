# BantayPlaka – New Repo Instructions

This project has been reworked as **BantayPlaka** (new project, not ViolationLedger/Ledgemonitor). Git history was reset so you can push to a **new repository** with a clean first commit.

## Users: Admin and Guard only

- **Admin**: Full access (User Management, Audit Logs, Cameras CRUD, all pages).
- **Guard**: Dashboard, Vehicles, Hosts, Cameras (view), Upload, Warnings, Capture Results, Violations History, Analytics, Settings. No User Management or Audit Logs.

## After cloning / on your machine

1. **Create first admin** (from `server/`):
   ```bash
   cd server
   node create-admin-user.js
   ```
   Default login: `admin@bantayplaka.local` / `BantayPlaka123!`

2. **Push to your new remote** (from project root):
   ```bash
   git remote add origin <your-new-repo-url>
   git add .
   git commit -m "Initial commit: BantayPlaka - Admin and Guard users only"
   git branch -M main
   git push -u origin main
   ```

3. **Fresh database**: Delete `server/parking.db` (if present) before first run so the server creates a new DB with the BantayPlaka schema (admin/guard roles only).
