const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugApplications() {
  try {
    // Get the specific request
    const requestId = 'cmf8nsxrx0001nq2v0fnar97e';
    
    console.log('=== REQUEST INFO ===');
    const request = await prisma.request.findUnique({
      where: { id: requestId },
      select: {
        id: true,
        title: true,
        status: true,
        requesterId: true
      }
    });
    console.log('Request:', request);
    
    console.log('\n=== APPLICATIONS FOR THIS REQUEST ===');
    const applications = await prisma.application.findMany({
      where: { requestId },
      include: {
        helper: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${applications.length} applications:`);
    applications.forEach((app, index) => {
      console.log(`${index + 1}. Application ID: ${app.id}`);
      console.log(`   Helper: ${app.helper.name} (${app.helper.id})`);
      console.log(`   Status: ${app.status}`);
      console.log(`   Created: ${app.createdAt}`);
      console.log(`   Message: ${app.message || 'No message'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugApplications();