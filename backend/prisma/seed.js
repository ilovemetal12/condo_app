const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('admin123', 12);

  // 1. Super Admin (no tenant)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@condosaas.com' },
    update: {},
    create: {
      email: 'superadmin@condosaas.com',
      password,
      firstName: 'Carlos',
      lastName: 'Martinez',
      role: 'super_admin',
      isActive: true,
    },
  });
  console.log('Super Admin:', superAdmin.email);

  // 2. Demo tenant with subscription
  const tenant = await prisma.tenant.upsert({
    where: { slug: 'residencial-los-pinos' },
    update: {},
    create: {
      name: 'Residencial Los Pinos',
      slug: 'residencial-los-pinos',
      status: 'active',
      subscription: {
        create: {
          plan: 'standard',
          maxCommunities: 5,
          maxUnitsPerCommunity: 200,
        },
      },
    },
  });
  console.log('Tenant:', tenant.name);

  // 3. Community
  const community = await prisma.community.upsert({
    where: { id: tenant.id },
    update: {},
    create: {
      tenantId: tenant.id,
      name: 'Torres del Parque',
      address: 'Calle 45 #12-30',
      city: 'Bogota',
      state: 'Cundinamarca',
      country: 'CO',
    },
  });
  console.log('Community:', community.name);

  // 4. Community Admin
  const communityAdmin = await prisma.user.upsert({
    where: { email: 'admin@lospinos.com' },
    update: {},
    create: {
      email: 'admin@lospinos.com',
      password,
      firstName: 'Laura',
      lastName: 'Rodriguez',
      role: 'community_admin',
      tenantId: tenant.id,
      communityId: community.id,
      isActive: true,
    },
  });
  console.log('Community Admin:', communityAdmin.email);

  // 5. Reception user
  const reception = await prisma.user.upsert({
    where: { email: 'recepcion@lospinos.com' },
    update: {},
    create: {
      email: 'recepcion@lospinos.com',
      password,
      firstName: 'Miguel',
      lastName: 'Torres',
      role: 'reception',
      tenantId: tenant.id,
      communityId: community.id,
      isActive: true,
    },
  });
  console.log('Reception:', reception.email);

  // 6. Create a unit
  const unit = await prisma.unit.upsert({
    where: { communityId_identifier: { communityId: community.id, identifier: 'Apt 301' } },
    update: {},
    create: {
      communityId: community.id,
      identifier: 'Apt 301',
      block: 'Torre A',
      floor: '3',
      type: 'apartment',
    },
  });

  // 7. Create a resident
  await prisma.resident.upsert({
    where: { id: unit.id },
    update: {},
    create: {
      unitId: unit.id,
      firstName: 'Ana',
      lastName: 'Gomez',
      email: 'ana.gomez@email.com',
      phone: '3001234567',
      isOwner: true,
      moveInDate: new Date('2024-01-15'),
    },
  });

  // 8. Resident user (linked to tenant/community)
  const resident = await prisma.user.upsert({
    where: { email: 'residente@lospinos.com' },
    update: {},
    create: {
      email: 'residente@lospinos.com',
      password,
      firstName: 'Ana',
      lastName: 'Gomez',
      role: 'resident',
      tenantId: tenant.id,
      communityId: community.id,
      isActive: true,
    },
  });
  console.log('Resident:', resident.email);

  console.log('\n--- All credentials use password: admin123 ---');
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
