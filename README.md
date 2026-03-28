# Mini Compliance Tracker (LibSQL / Turso Edition)

A robust web application to track compliance tasks for multiple clients. Migrated to robust **SQLite** functionality using **@libsql/client** for standard serverless deployments and edge compatibility.

## Core Features
1. **Client Management:** View a list of clients (seeded data).
2. **Task Management:** View tasks specifically belonging to a selected client.
3. **Add Tasks:** Create new tasks specifying due dates, category, and priority.
4. **Status Updates:** Mark tasks as pending or completed with a single click.
5. **Overdue Highlighting:** Any pending task past its deadline is visibly marked in red as "OVERDUE".
6. **Filtering:** Filter tasks by completion status and category interactively.

---

## Tech Stack
- **Framework:** Next.js 16.2.1 (App Router)
- **Styling:** Tailwind CSS v4
- **Database:** Serverless SQLite natively using `@libsql/client` (Turso / local SQLite compatible)

---

## 🚀 Setting Up the Database

This application uses a local SQLite database for development, which can be easily swapped to a remote Turso database for production.

To deploy to production, create a [Turso Project](https://turso.tech) and add the following to your `.env` file:
```env
# Production Turso Connection String
TURSO_DATABASE_URL="..."
TURSO_AUTH_TOKEN="..."
```
*(If left blank, the app will gracefully default to using a local `file:local.db` inside your project directory.)*

---

## Local Development Instructions

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Initialize Database and Seed Data:**
   Run the setup script which will create the required tables and seed the application with test clients and tasks:
   ```bash
   node scripts/init-db.mjs
   ```

3. **Start the Development Server:**
   ```bash
   npm run dev
   ```
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## ⚡ Vercel Deployment Instructions

Deploying this application to Vercel is seamless:

1. Connect your GitHub repository inside the Vercel Dashboard.
2. Before clicking Deploy, expand the **Environment Variables** section.
3. Add the **`TURSO_DATABASE_URL`** and **`TURSO_AUTH_TOKEN`** keys from your Turso dashboard.
4. Click **Deploy**.

*Vercel has been configured securely (via `package.json`) to automatically run the UI build processes.* Your deployment will effortlessly connect to your remote SQLite database!
