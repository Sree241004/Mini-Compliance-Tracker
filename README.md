# Mini Compliance Tracker (Supabase + Prisma Edition)

A robust web application to track compliance tasks for multiple clients. Migrated to robust **Supabase PostgreSQL** and **Prisma ORM** for standard serverless deployments.

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
- **ORM:** Prisma v6/v7 compatible configurations
- **Database:** PostgreSQL (Supabase) fully compatible with Serverless Edge environments using connection pooling

---

## 🚀 Setting Up Supabase & Prisma

You must connect the application to a PostgreSQL database such as Supabase before developing. 

1. Create a [Supabase Project](https://supabase.com).
2. Go to your Project -> **Project Settings** -> **Database**.
3. Scroll down to **Connection string** and select **URI**. Check the "Use connection pooling" box.
4. Open the `.env` file in the root of this project and paste your actual Database URL strings replacing the placeholders. 

In your `.env` file, you need TWO environment variables for Prisma:
\`\`\`env
# The Transaction pooler URL (Ends in port 6543)
DATABASE_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?pgbouncer=true"

# The Direct Session URL (Ends in port 5432)
DIRECT_URL="postgresql://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres"
\`\`\`

---

## Local Development Instructions

1. **Install Dependencies:**
   \`\`\`bash
   npm install
   \`\`\`

2. **Initialize Database and Seed Data:**
   Now that your `.env` is setup, push the schema to Supabase and seed the test clients.
   \`\`\`bash
   npx prisma db push
   npm run prisma db seed
   \`\`\`

3. **Start the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## ⚡ Vercel Deployment Instructions

Deploying this application to Vercel is seamless if you configure the environment correctly.

1. Connect your GitHub repository inside the Vercel Dashboard.
2. Before clicking Deploy, expand the **Environment Variables** section.
3. Add the exact same **`DATABASE_URL`** and **`DIRECT_URL`** strings you used locally into Vercel.
4. Click **Deploy**.

*Vercel has been configured securely (via `package.json`) to automatically run `prisma generate`, `prisma db push`, and the `next build` processes directly inside its CD pipeline.* Your deployment will effortlessly connect to your cloud database!
