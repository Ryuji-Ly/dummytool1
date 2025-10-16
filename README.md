# Dummy Tool 1 - Keycloak Authentication

A Next.js application with Keycloak authentication integration that displays user information (name and email) after login.

## Features

✅ Login/Logout with Keycloak  
✅ Display logged-in user's name and email  
✅ Welcome message with user's name  
✅ Secure authentication using NextAuth.js v5  
✅ Modern UI with Tailwind CSS

---

## Complete Setup Guide

Follow these steps to set up the project on your machine.

### Prerequisites

- Node.js (v18 or higher)
- Docker Desktop installed and running
- A code editor (VS Code recommended)

---

### Step 1: Install Dependencies

```bash
npm install
```

---

### Step 2: Start Keycloak Server

1. **Make sure Docker Desktop is running**

2. **Navigate to the keycloak-server directory:**
   ```bash
   cd keycloak-server
   ```

3. **Start Keycloak and PostgreSQL:**
   ```bash
   docker compose up -d
   ```

4. **Wait ~30 seconds** for Keycloak to fully start

5. **Verify it's running:**
   ```bash
   docker ps
   ```
   You should see two containers: `keycloak` and `postgres`

6. **Access Keycloak Admin Console:**
   - Open browser: http://localhost:8080
   - Click **"Administration Console"**
   - Login with:
     - Username: `admin`
     - Password: `admin`

---

### Step 3: Create a Realm

1. In the top-left corner, click the dropdown (shows "master")
2. Click **"Create Realm"**
3. Fill in:
   - **Realm name**: `dummytool1`
4. Click **"Create"**
5. Verify "dummytool1" is now shown in the top-left dropdown

---

### Step 4: Create a Client

1. In the left sidebar, click **"Clients"**
2. Click **"Create client"** button

#### Page 1 - General Settings:
- **Client type**: `OpenID Connect`
- **Client ID**: `dummytool1`
- Click **"Next"**

#### Page 2 - Capability config:
- **Client authentication**: Toggle to **ON** ✅
- **Authorization**: Leave OFF
- **Authentication flow**: Keep all checkboxes checked
- Click **"Next"**

#### Page 3 - Login settings:
- **Root URL**: `http://localhost:3000`
- **Home URL**: `http://localhost:3000`
- **Valid redirect URIs**: `http://localhost:3000/api/auth/callback/keycloak`
- **Valid post logout redirect URIs**: `http://localhost:3000`
- **Web origins**: `http://localhost:3000`
- Click **"Save"**

#### Get Client Secret:
1. After saving, click the **"Credentials"** tab
2. Copy the **Client Secret** value (you'll need this for `.env.local`)

---

### Step 5: Create Test Users

1. In the left sidebar, click **"Users"**
2. Click **"Create new user"** button

#### Create First User:
3. Fill in user details:
   - **Username**: `john.doe` ✅ (required)
   - **Email**: `john.doe@example.com`
   - **First name**: `John`
   - **Last name**: `Doe`
   - **Email verified**: Toggle to **ON** ✅
   - **Enabled**: Should be ON by default ✅
4. Click **"Create"**

#### Set Password:
5. Click the **"Credentials"** tab
6. Click **"Set password"**
7. Fill in:
   - **Password**: `Test123!`
   - **Password confirmation**: `Test123!`
   - **Temporary**: Toggle to **OFF** ⬜
8. Click **"Save"**
9. Confirm by clicking **"Save password"**

#### Create More Users (Optional):
Repeat the above process to create additional test users:
- Username: `jane.smith`, Email: `jane.smith@example.com`, Name: `Jane Smith`, Password: `Test123!`
- Username: `bob.johnson`, Email: `bob.johnson@example.com`, Name: `Bob Johnson`, Password: `Test123!`

---

### Step 6: Configure Environment Variables

1. **Navigate back to the project root:**
   ```bash
   cd ..
   ```

2. **Copy the environment template:**
   ```bash
   copy .env.example .env.local
   ```

3. **Generate a secret for NextAuth:**
   
   **Option A - PowerShell:**
   ```powershell
   $bytes = New-Object byte[] 32
   $rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
   $rng.GetBytes($bytes)
   [Convert]::ToBase64String($bytes)
   ```
   
   **Option B - Online Generator:**
   Visit: https://generate-secret.vercel.app/32

4. **Edit `.env.local`** with your values:
   ```env
   # Keycloak Configuration
   KEYCLOAK_CLIENT_ID=dummytool1
   KEYCLOAK_CLIENT_SECRET=<paste-client-secret-from-step-4>
   KEYCLOAK_ISSUER=http://localhost:8080/realms/dummytool1
   
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<paste-generated-secret-from-above>
   ```

---

### Step 7: Run the Application

1. **Start the development server:**
   ```bash
   npm run dev
   ```

2. **Open your browser:**
   Navigate to http://localhost:3000

3. **Test authentication:**
   - Click **"Sign In with Keycloak"**
   - Login with:
     - Username: `john.doe`
     - Password: `Test123!`
   - You should see: "Welcome, John Doe!" with your email displayed! 🎉

---

## Quick Reference

| Service | URL | Credentials |
|---------|-----|-------------|
| **Application** | http://localhost:3000 | - |
| **Keycloak Admin** | http://localhost:8080 | admin / admin |
| **Realm Name** | - | dummytool1 |
| **Client ID** | - | dummytool1 |
| **Test User** | - | john.doe / Test123! |

---

## Managing Keycloak

### Stop Keycloak:
```bash
cd keycloak-server
docker compose down
```

### Start Keycloak (after stopping):
```bash
cd keycloak-server
docker compose up -d
```

### View Keycloak logs:
```bash
cd keycloak-server
docker compose logs -f keycloak
```

### Remove Keycloak completely (including data):
```bash
cd keycloak-server
docker compose down -v
```
⚠️ **Warning:** This deletes all realms, clients, and users!

---

## Troubleshooting

### "Connection refused" when signing in
- Make sure Keycloak is running: `docker ps`
- Access http://localhost:8080 to verify Keycloak is up
- Wait 30 seconds after `docker compose up -d`

### "Invalid redirect URI"
- Check that redirect URI in Keycloak exactly matches: `http://localhost:3000/api/auth/callback/keycloak`
- No trailing slashes!

### "Client authentication failed"
- Verify `KEYCLOAK_CLIENT_SECRET` in `.env.local` matches the secret from Keycloak Credentials tab
- Ensure "Client authentication" is ON in Keycloak client settings

### User name shows as "N/A"
- Make sure user has First name and Last name filled in Keycloak
- Ensure "Email verified" is ON for the user

### Docker port conflicts
- If port 8080 is in use, stop other services or change the port in `docker-compose.yml`:
  ```yaml
  ports:
    - "8081:8080"  # Change to 8081
  ```
  Then update `KEYCLOAK_ISSUER` in `.env.local` to use port 8081

### App won't start after changing .env.local
- Restart the development server (Ctrl+C, then `npm run dev`)
- Verify all environment variables are set correctly

---

---

## Project Structure

```
src/
├── auth.ts                      # NextAuth.js configuration with Keycloak
├── app/
│   ├── page.tsx                # Home page - shows welcome & user info
│   ├── layout.tsx              # Root layout with SessionProvider
│   ├── globals.css             # Global styles
│   └── api/
│       └── auth/
│           └── [...nextauth]/
│               └── route.ts    # NextAuth.js API routes
└── components/
    ├── AuthButton.tsx          # Login/Logout button component
    └── SessionProvider.tsx     # Client-side session provider wrapper
```

---

## Technologies Used

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[NextAuth.js v5](https://next-auth.js.org/)** - Authentication library
- **[Keycloak](https://www.keycloak.org/)** - Identity and access management
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS](https://tailwindcss.com/)** - Styling

---

## Documentation

- **[QUICK_START.md](./QUICK_START.md)** - Complete setup guide for Keycloak
- **[.env.example](./.env.example)** - Environment variables template

---

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
