const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create super admin user (no tenant)
  const hashedPassword = await bcrypt.hash('admin123', 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: 'admin@condosaas.com' },
    update: {},
    create: {
      email: 'admin@condosaas.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'super_admin',
      isActive: true,
    },
  });

  console.log('Super admin created:', superAdmin.email);

  // Create a demo tenant
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-residencial' },
    update: {},
    create: {
      name: 'Residencial Demo',
      slug: 'demo-residencial',
      status: 'active',
      subscription: {
        create: {
          plan: 'standard',
          maxCommunities: 3,
          maxUnitsPerCommunity: 100,
        },
      },
    },
  });

  console.log('Demo tenant created:', tenant.name);

  // Create a community admin for the demo tenant
  const adminPassword = await bcrypt.hash('community123', 12);

  const communityAdmin = await prisma.user.upsert({
    where: { email: 'admin@demo-residencial.com' },
    update: {},
    create: {
      email: 'admin@demo-residencial.com',
      password: adminPassword,
      firstName: 'Carlos',
      lastName: 'Garcia',
      role: 'community_admin',
      tenantId: tenant.id,
      isActive: true,
    },
  });

  console.log('Community admin created:', communityAdmin.email);

  console.log('Seeding complete.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
