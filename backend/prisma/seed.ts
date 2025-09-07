import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Create skills
  const skills = await Promise.all([
    prisma.skill.upsert({
      where: { name: 'Compras' },
      update: {},
      create: { name: 'Compras' },
    }),
    prisma.skill.upsert({
      where: { name: 'Reparações' },
      update: {},
      create: { name: 'Reparações' },
    }),
    prisma.skill.upsert({
      where: { name: 'Companhia a idosos' },
      update: {},
      create: { name: 'Companhia a idosos' },
    }),
    prisma.skill.upsert({
      where: { name: 'Limpezas' },
      update: {},
      create: { name: 'Limpezas' },
    }),
    prisma.skill.upsert({
      where: { name: 'Jardinagem' },
      update: {},
      create: { name: 'Jardinagem' },
    }),
  ]);

  console.log('✅ Skills created:', skills.length);

  // Create admin user - Mario Amorim
  const adminUser = await prisma.user.upsert({
    where: { email: 'mario.f.amorim@gmail.com' },
    update: { role: 'ADMIN' },
    create: {
      name: 'Mário Amorim',
      email: 'mario.f.amorim@gmail.com',
      googleId: 'mario_admin_google_id',
      city: 'Fiães',
      lat: 40.9735,
      lng: -8.5480,
      role: 'ADMIN',
      bio: 'Administrador da plataforma LigaBairro.',
    },
  });

  console.log('✅ Admin user created:', adminUser.email);

  // Create a sample helper user
  const helperUser = await prisma.user.upsert({
    where: { email: 'helper@example.com' },
    update: {},
    create: {
      name: 'João Silva',
      email: 'helper@example.com',
      googleId: 'fake_helper_google_id',
      city: 'Fiães',
      lat: 40.9735,
      lng: -8.5480,
      bio: 'Gosto de ajudar os vizinhos com tarefas do dia a dia.',
    },
  });

  // Assign skills to helper
  await prisma.userSkill.createMany({
    data: [
      { userId: helperUser.id, skillId: skills[0].id }, // Compras
      { userId: helperUser.id, skillId: skills[1].id }, // Reparações
    ],
    skipDuplicates: true,
  });

  console.log('✅ Helper user created:', helperUser.email);

  // Create a sample requester user
  const requesterUser = await prisma.user.upsert({
    where: { email: 'requester@example.com' },
    update: {},
    create: {
      name: 'Maria Santos',
      email: 'requester@example.com',
      googleId: 'fake_requester_google_id',
      city: 'Fiães',
      lat: 40.9740,
      lng: -8.5475,
      bio: 'Preciso de ajuda ocasional com tarefas domésticas.',
    },
  });

  console.log('✅ Requester user created:', requesterUser.email);

  // Create a sample request
  const sampleRequest = await prisma.request.create({
    data: {
      title: 'Ajuda com compras no supermercado',
      description: 'Preciso que alguém me ajude a fazer compras no Continente. Tenho dificuldades em carregar as compras.',
      category: 'Compras',
      city: 'Fiães',
      lat: 40.9740,
      lng: -8.5475,
      requesterId: requesterUser.id,
      isPaid: false,
      status: 'OPEN',
    },
  });

  console.log('✅ Sample request created:', sampleRequest.title);

  console.log('🎉 Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });