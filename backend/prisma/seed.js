const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const password = await bcrypt.hash('admin123', 12);

  // 1. Super Admin (no tenant)
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@condosaas.com' },
    update: { password },
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

  // 3. Community - find or create
  let community = await prisma.community.findFirst({
    where: { tenantId: tenant.id, name: 'Torres del Parque' },
  });
  if (!community) {
    community = await prisma.community.create({
      data: {
        tenantId: tenant.id,
        name: 'Torres del Parque',
        address: 'Calle 45 #12-30',
        city: 'Bogota',
        state: 'Cundinamarca',
        country: 'CO',
      },
    });
  }
  console.log('Community:', community.name);

  // 4. Community Admin
  const communityAdmin = await prisma.user.upsert({
    where: { email: 'admin@lospinos.com' },
    update: { password, tenantId: tenant.id, communityId: community.id },
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
    update: { password, tenantId: tenant.id, communityId: community.id },
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

  // 6. Unit - find or create
  let unit = await prisma.unit.findFirst({
    where: { communityId: community.id, identifier: 'Apt 301' },
  });
  if (!unit) {
    unit = await prisma.unit.create({
      data: {
        communityId: community.id,
        identifier: 'Apt 301',
        block: 'Torre A',
        floor: '3',
        type: 'apartment',
      },
    });
  }

  // 7. Resident record - find or create
  const existingResident = await prisma.resident.findFirst({
    where: { unitId: unit.id, email: 'ana.gomez@email.com' },
  });
  if (!existingResident) {
    await prisma.resident.create({
      data: {
        unitId: unit.id,
        firstName: 'Ana',
        lastName: 'Gomez',
        email: 'ana.gomez@email.com',
        phone: '3001234567',
        isOwner: true,
        moveInDate: new Date('2024-01-15'),
      },
    });
  }

  // 8. Resident user
  const resident = await prisma.user.upsert({
    where: { email: 'residente@lospinos.com' },
    update: { password, tenantId: tenant.id, communityId: community.id },
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

  console.log('\n--- Credentials (all use password: admin123) ---');
  console.log('superadmin@condosaas.com  - Super Admin');
  console.log('admin@lospinos.com       - Community Admin');
  console.log('recepcion@lospinos.com   - Reception');
  console.log('residente@lospinos.com   - Resident');
  console.log('\nSeeding complete.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
