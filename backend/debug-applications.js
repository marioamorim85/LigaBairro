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
    
    console.log('\n=== CHECKING SPECIFIC APPLICATION IDS FROM FRONTEND ===');
    const specificIds = ['cmf8taudm0001grhemijefoz8', 'cmf8thnb40005grhex9na8p7n'];
    
    for (const id of specificIds) {
      const app = await prisma.application.findUnique({
        where: { id },
        include: {
          helper: {
            select: {
              id: true,
              name: true
            }
          },
          request: {
            select: {
              id: true,
              title: true
            }
          }
        }
      });
      
      if (app) {
        console.log(`✅ Application ${id} EXISTS:`);
        console.log(`   Request: ${app.request.title} (${app.request.id})`);
        console.log(`   Helper: ${app.helper.name} (${app.helper.id})`);
        console.log(`   Status: ${app.status}`);
        console.log(`   Created: ${app.createdAt}`);
      } else {
        console.log(`❌ Application ${id} NOT FOUND`);
      }
      console.log('');
    }
    
    console.log('\n=== ALL APPLICATIONS IN DATABASE ===');
    const allApps = await prisma.application.findMany({
      include: {
        helper: {
          select: {
            id: true,
            name: true
          }
        },
        request: {
          select: {
            id: true,
            title: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log(`Total applications in DB: ${allApps.length}`);
    allApps.forEach((app, index) => {
      console.log(`${index + 1}. ${app.id} - ${app.request.title} - ${app.helper.name} (${app.status})`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugApplications();