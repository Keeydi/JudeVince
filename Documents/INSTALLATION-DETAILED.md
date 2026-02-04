# BantayPlaka – Detailed Installation Guide

This guide walks you through installing BantayPlaka **step by step** on a Windows PC. Follow each section in order.

---

## Table of Contents

1. [Prerequisites](#1-prerequisites)
2. [Get the Project Files](#2-get-the-project-files)
3. [Install Node.js](#3-install-nodejs)
4. [Install Frontend Dependencies](#4-install-frontend-dependencies)
5. [Install Server Dependencies](#5-install-server-dependencies)
6. [Configure Environment Variables](#6-configure-environment-variables)
7. [Install Python (for AI Plate Detection)](#7-install-python-for-ai-plate-detection)
8. [Create Admin and Guard Accounts](#8-create-admin-and-guard-accounts)
9. [Run the Application](#9-run-the-application)
10. [Verify Installation](#10-verify-installation)
11. [Production Build (Optional)](#11-production-build-optional)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Prerequisites

Before you start, make sure you have:

| Requirement | Details |
|-------------|---------|
| **Operating system** | Windows 10 or 11 (or Windows Server). The same steps apply on macOS/Linux with small command differences. |
| **Disk space** | At least 500 MB free (for Node, dependencies, and database). |
| **Internet** | Required for downloading Node.js, npm packages, and Python packages. |
| **User account** | You must be able to install software (e.g. Administrator or equivalent). |

You do **not** need to install anything else before Step 3 (Node.js comes with npm).

---

## 2. Get the Project Files

You need the BantayPlaka project folder on your PC.

### Option A: Clone from Git

1. Install **Git for Windows** from https://git-scm.com/download/win if you do not have it.
2. Open **Command Prompt** or **PowerShell**.
3. Go to the folder where you want the project (e.g. `C:\Projects`):
   ```cmd
   cd C:\Projects
   ```
4. Clone the repository (replace the URL with your actual BantayPlaka repo URL):
   ```cmd
   git clone https://github.com/YOUR_USERNAME/BantayPlaka.git
   cd BantayPlaka
   ```

### Option B: Copy from USB or Network

1. Copy the entire **BantayPlaka** folder (e.g. from a USB drive or shared folder) to your PC.
2. Open **Command Prompt** or **PowerShell**.
3. Go into the project folder, for example:
   ```cmd
   cd D:\BantayPlaka
   ```
   (Use the real path where you pasted the folder.)

After this step, your current directory should be the project root (where you see `package.json`, `server` folder, and `src` folder).

---

## 3. Install Node.js

Node.js is required to run both the frontend and the backend server.

### Step 3.1: Download Node.js

1. Open a browser and go to: **https://nodejs.org/**
2. Download the **LTS** version (recommended).
3. Run the downloaded installer (e.g. `node-v20.x.x-x64.msi`).

### Step 3.2: Run the Installer

1. Click **Next** through the wizard.
2. Accept the license agreement.
3. Keep the default installation path (e.g. `C:\Program Files\nodejs\`) unless you have a reason to change it.
4. On “Custom Setup”, ensure **Node.js runtime**, **npm package manager**, and **Add to PATH** are selected. Click **Next**.
5. If you see “Tools for Native Modules”, you can leave it unchecked. Click **Next**.
6. Click **Install**. If Windows asks for administrator permission, allow it.
7. When finished, click **Finish**.

### Step 3.3: Verify Node.js and npm

1. Close any open Command Prompt or PowerShell windows, then open a **new** one.
2. Run:
   ```cmd
   node -v
   ```
   You should see a version number (e.g. `v20.10.0`).
3. Run:
   ```cmd
   npm -v
   ```
   You should see a version number (e.g. `10.2.0`).

If both commands show versions, Node.js and npm are installed correctly.

---

## 4. Install Frontend Dependencies

The web interface (React app) needs its dependencies installed once per machine.

### Step 4.1: Go to Project Root

In Command Prompt or PowerShell:

```cmd
cd path\to\BantayPlaka
```

Use the real path to your BantayPlaka folder (e.g. `C:\Projects\BantayPlaka`).

### Step 4.2: Install Packages

Run:

```cmd
npm install
```

- This may take 1–3 minutes.
- You may see warnings (e.g. optional dependencies); you can ignore them unless the command fails.
- When it finishes, you should see a `node_modules` folder in the project root.

### Step 4.3: No Errors

If the last line does not show `ERR!` or `failed`, the frontend dependencies are installed.

---

## 5. Install Server Dependencies

The backend (API and database) runs from the `server` folder and has its own dependencies.

### Step 5.1: Install Server Packages

From the **project root** (same folder as in Step 4), run:

```cmd
npm run server:install
```

This runs `npm install` inside the `server` folder.

- Wait until it completes (usually under a minute).
- When done, there will be a `server\node_modules` folder.

### Step 5.2: Confirm

If the command exits without an error, server dependencies are ready.

---

## 6. Configure Environment Variables

The server needs a few settings (API URL, optional API keys) in a `.env` file.

### Step 6.1: Create the `.env` File

1. Open the **server** folder in File Explorer (e.g. `C:\Projects\BantayPlaka\server`).
2. Find the file **`.env.example`**.
3. Copy it and paste it in the **same** folder.
4. Rename the copy to **`.env`** (no `.example`).

So you have: `server\.env.example` (original) and `server\.env` (your copy to edit).

### Step 6.2: Edit `.env`

1. Open **`.env`** with Notepad or any text editor (right‑click → Open with → Notepad).
2. Set at least these:

```env
# Frontend will call the API at this URL. Use your PC's IP if others will access the app.
VITE_API_URL=http://localhost:3001/api

# Required for AI plate detection (get key: https://aistudio.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Server port (default 3001)
PORT=3001
```

3. Replace `your_gemini_api_key_here` with your real **Google AI Studio (Gemini) API key**:
   - Go to https://aistudio.google.com/app/apikey
   - Sign in with a Google account.
   - Create an API key and copy it into `GEMINI_API_KEY=` in `.env`.

4. Save and close the file.

### Step 6.3: Optional – Viber / Notifications

If you will use Viber for notifications:

- Get an Infobip account and API key from https://www.infobip.com/signup
- In `.env` add or edit (using the values from `.env.example` as a template):

```env
INFOBIP_API_KEY=your_infobip_key
INFOBIP_BASE_URL=api.infobip.com
VIBER_SENDER=YourViberSenderName
```

You can leave these blank or commented out if you are not using Viber yet.

---

## 7. Install Python (for AI Plate Detection)

The AI that detects plates and vehicles uses a small Python script. You need Python 3.9 or newer.

### Step 7.1: Download Python

1. Go to **https://www.python.org/downloads/**
2. Download the latest **Python 3.12** (or 3.11) Windows installer.

### Step 7.2: Run the Installer

1. Run the downloaded file (e.g. `python-3.12.x-amd64.exe`).
2. **Important:** At the first screen, check **“Add python.exe to PATH”**.
3. Click **“Install Now”** (or “Customize” if you want to choose the folder).
4. Wait for the installation to finish, then click **Close**.

### Step 7.3: Verify Python

1. Open a **new** Command Prompt or PowerShell.
2. Run:
   ```cmd
   python --version
   ```
   You should see something like `Python 3.12.x`.

If you see `'python' is not recognized`, try:

```cmd
py --version
```

If that works, use `py` instead of `python` in the next step.

### Step 7.4: Install Python Packages for BantayPlaka

1. Go to the **server** folder in the terminal:
   ```cmd
   cd path\to\BantayPlaka\server
   ```
2. Install the required packages:
   ```cmd
   pip install -r requirements.txt
   ```
   (If you use `py`, run: `py -m pip install -r requirements.txt`.)
3. Wait until it finishes. You should see “Successfully installed …” for `google-generativeai` and `Pillow`.

After this, the server can call the Python AI script for plate detection.

---

## 8. Create Admin and Guard Accounts

Before you can log in, you must create at least one **Admin** account (and optionally **Guard** accounts) on this PC.

### Step 8.1: Ensure Database Exists

The database is created automatically the first time the server runs. You can either:

- Run the server once (Step 9), then stop it and run the account setup, **or**
- Run the account setup now; the script will create the database if needed when it runs (it uses the same database module as the server).

So you can do Step 8 before or after Step 9; both work.

### Step 8.2: Run the Account Setup

**Option A – Using the batch file (easiest on Windows)**

1. In File Explorer, go to the **server** folder: `BantayPlaka\server`.
2. Double‑click **`CREATE-ACCOUNTS.bat`**.
3. A black window will open. Follow the prompts:
   - **Admin email:** e.g. `admin@bantayplaka.local` (or press Enter for default).
   - **Admin password:** e.g. `BantayPlaka123!` (or press Enter for default).
   - **Admin display name:** e.g. `Admin`.
   - **Add a Guard account?** Type `y` if you want to add a guard, then enter Guard email, password, and name.
4. When it says “Done”, you can close the window.

**Option B – Using the command line**

1. Open Command Prompt or PowerShell.
2. Go to the server folder:
   ```cmd
   cd path\to\BantayPlaka\server
   ```
3. Run:
   ```cmd
   node setup-accounts.js
   ```
4. Answer the same prompts as in Option A.

**Option C – Using a config file (no typing each time)**

1. In the **server** folder, copy **`setup-accounts.config.example.json`** and rename the copy to **`setup-accounts.config.json`**.
2. Open **`setup-accounts.config.json`** in a text editor and set your admin and guard emails, passwords, and names.
3. From the **server** folder run:
   ```cmd
   node setup-accounts.js
   ```
   Accounts will be created from the file; no prompts.

### Step 8.3: Remember Your Login

- **Admin:** Can access all pages (including User Management and Audit Logs).
- **Guard:** Can use Dashboard, Vehicles, Hosts, Cameras, Upload, Warnings, Capture Results, Violations, Analytics, Settings (no User Management or Audit Logs).

Use the Admin email and password you set when you log in to the app in Step 10.

---

## 9. Run the Application

You need to run both the **backend server** and the **frontend** (web app).

### Step 9.1: Start Both (One Command)

From the **project root** (the folder that contains `package.json` and `server`):

```cmd
npm run dev:all
```

- This starts the server and the frontend together.
- Leave this window open while you use the app.
- You should see messages indicating the server is running and the frontend is available (e.g. port 8080).

### Step 9.2: Or Start Them in Two Windows

**Window 1 – Backend**

```cmd
cd path\to\BantayPlaka
npm run dev:server
```

Leave it open.

**Window 2 – Frontend**

```cmd
cd path\to\BantayPlaka
npm run dev
```

Leave it open.

When both are running, you can open the app in the browser (Step 10).

---

## 10. Verify Installation

### Step 10.1: Open the Web App

1. Open a web browser (Chrome, Edge, or Firefox).
2. Go to: **http://localhost:8080**
3. You should see the BantayPlaka **login** page.

### Step 10.2: Log In

1. Enter the **Admin email** and **password** you set in Step 8.
2. Click **Log in** (or Sign in).
3. You should see the **Dashboard** (with menu on the side).

### Step 10.3: Quick Checks

- Click **Settings** and confirm the page loads (and health/status if shown).
- Click **Vehicles** and confirm the list (may be empty).
- Click **User Management** (Admin only) and confirm you see your user.

If all of this works, installation is complete.

### Step 10.4: Access from Another PC (Same Network)

If you want to open BantayPlaka from another computer on the same network:

1. Find this PC’s IP address (e.g. run `ipconfig` and note the IPv4 address, e.g. `192.168.1.100`).
2. On the other PC, in the browser go to: `http://192.168.1.100:8080`.
3. Ensure Windows Firewall allows inbound connections on ports **3001** (API) and **8080** (frontend), or temporarily allow the Node/app through the firewall.

---

## 11. Production Build (Optional)

For a more stable setup (e.g. always-on PC), you can build the frontend once and run only the server.

### Step 11.1: Build the Frontend

From the **project root**:

```cmd
npm run build
```

This creates a `dist` folder with static files.

### Step 11.2: Serve the Frontend and API

- Either configure your server to serve the `dist` folder at the same origin as the API, **or**
- Run the backend and use a separate web server (e.g. IIS, nginx) to serve the contents of `dist` and proxy `/api` to the Node server.

Typical flow: run the server with:

```cmd
cd path\to\BantayPlaka
npm run server:start
```

Then point your web server to `dist` and set **VITE_API_URL** (or your production API URL) so the frontend calls the correct backend.

---

## 12. Troubleshooting

### “node is not recognized”

- Node.js is not installed or not on the PATH.
- Reinstall Node.js and ensure “Add to PATH” is checked. Then close and reopen Command Prompt/PowerShell.

### “npm is not recognized”

- Same as above; npm is installed with Node.js. Reinstall Node.js and restart the terminal.

### “Cannot find module …” when running the server or frontend

- Dependencies are missing. From project root run:
  ```cmd
  npm install
  npm run server:install
  ```

### “Database not ready” or “Error loading database”

- Ensure the **server** folder is writable (so it can create `parking.db`).
- Do not delete `server\parking.db` unless you want to reset all data (including users). If you delete it, run `node setup-accounts.js` again to create accounts.

### Login page loads but “Network Error” or “Failed to fetch”

- The **backend** is not running or the frontend is pointing to the wrong URL.
- Start the server (`npm run dev:server` or `npm run dev:all`).
- In `server\.env`, ensure **VITE_API_URL** is `http://localhost:3001/api` when using the app on the same PC. If the app runs on another PC, use this PC’s IP, e.g. `http://192.168.1.100:3001/api`, and rebuild the frontend if needed.

### “GEMINI_API_KEY is not set” or AI detection fails

- Edit **server\.env** and set **GEMINI_API_KEY** to a valid key from https://aistudio.google.com/app/apikey.
- Restart the server after changing `.env`.

### Python “not recognized” or “pip install” fails

- Install Python from python.org and check **“Add python.exe to PATH”**.
- Use **“Open as administrator”** for Command Prompt if needed when installing packages.
- Try: `py -m pip install -r server\requirements.txt` from the project root.

### Port 8080 or 3001 already in use

- Another program is using that port. Either close that program or change the port:
  - Frontend: in **vite.config.ts**, change `port: 8080` to another port (e.g. `8081`).
  - Backend: in **server\.env**, set `PORT=3002` (or another free port). Then set **VITE_API_URL** to match (e.g. `http://localhost:3002/api`).

---

## Summary Checklist

- [ ] Node.js and npm installed and working (`node -v`, `npm -v`)
- [ ] Project files on PC (clone or copy)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Server dependencies installed (`npm run server:install`)
- [ ] **server\.env** created from `.env.example` and **GEMINI_API_KEY** set
- [ ] Python 3.9+ installed and **requirements.txt** installed (`pip install -r server\requirements.txt`)
- [ ] At least one Admin account created (`CREATE-ACCOUNTS.bat` or `node setup-accounts.js`)
- [ ] App runs with `npm run dev:all` and login works at http://localhost:8080

For creating accounts on each client PC, see **[Client-Setup-Accounts.md](Client-Setup-Accounts.md)**.
