# Mini Compliance Tracker

A simple web application to track compliance tasks for multiple clients. Built to be basic, robust, and easy to deploy.

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
- **Database:** Raw SQLite via `@libsql/client` (Zero complex ORM or generation steps)
- **Deployment Ready:** Because it uses `libsql`, you can easily swap the local `.db` file for a cloud Turso database URL for scalable serverless deployments.

---

## Setup Instructions

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Initialize Database and Seed Data:**
   Run the setup script which creates the tables and populates seed data into a local `dev.db` file.
   \`\`\`bash
   npx tsx db/setup.ts
   \`\`\`

3. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in Browser:**
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## Tradeoffs & Assumptions

### Assumptions
- **Client Creation:** For simplicity, the assignment did not request a flow for creating *new* clients, so we assume clients are created via the database seed script or another admin panel. 
- **Authentication:** There is no authentication or authorization. We assume this is an internal admin tool accessed securely.
- **Persistent Storage:** A local SQLite file (`dev.db`) is used to fulfill the "persistent storage" requirement without relying on third-party cloud services during development.

### Tradeoffs
- **Raw SQL over ORM:** Originally, Prisma was used but it encountered deeply-rooted versioning issues inside the local environment. We pivoted to raw SQLite (`@libsql/client`) to drastically reduce complexity and ensure a robust, "basic and easy-to-understand" codebase as per requirements.
- **Serverless Deployments:** If deploying to Vercel, any new data written to the local SQLite database will NOT persist because Vercel file systems are ephemeral. *Solution:* To perfectly deploy this, you would create a free Turso cloud database, copy the URL, and paste it into the `.env` file as \`DATABASE_URL\`. The app will instantly use the cloud database with zero code changes.
- **Local State Validation:** We validate the form on the frontend and on the backend, but rely heavily on standard HTML5 form validation to keep client-side JS lean.
