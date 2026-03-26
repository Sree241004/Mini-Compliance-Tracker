import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding the database with Prisma...')

  // Insert Clients
  const acmeCorp = await prisma.client.create({
    data: {
      company_name: 'Acme Corp',
      country: 'USA',
      entity_type: 'C-Corp',
    },
  })

  const globex = await prisma.client.create({
    data: {
      company_name: 'Globex Inc',
      country: 'UK',
      entity_type: 'LTD',
    },
  })

  // Insert Tasks
  await prisma.task.createMany({
    data: [
      {
        title: 'Quarterly Tax Filing',
        description: 'File Q1 2026 tax returns accurately.',
        category: 'Tax',
        due_date: new Date('2026-04-15'),
        priority: 'High',
        status: 'Pending',
        client_id: acmeCorp.id,
      },
      {
        title: 'Annual Audit Report',
        description: 'Complete the end-of-year compliance audit.',
        category: 'Audit',
        due_date: new Date('2025-12-31'), // Deliberately past due to demonstrate overdue testing
        priority: 'High',
        status: 'Pending',
        client_id: acmeCorp.id,
      },
      {
        title: 'Health & Safety Update',
        description: 'Routine compliance check. Update manual.',
        category: 'HR',
        due_date: new Date('2026-06-01'),
        priority: 'Medium',
        status: 'Completed',
        client_id: globex.id,
      },
      {
        title: 'Data Privacy Review',
        description: 'Review GDPR and CCPA updates.',
        category: 'Legal',
        due_date: new Date('2026-05-20'),
        priority: 'Low',
        status: 'Pending',
        client_id: globex.id,
      },
    ],
  })

  console.log('Database beautifully seeded!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
