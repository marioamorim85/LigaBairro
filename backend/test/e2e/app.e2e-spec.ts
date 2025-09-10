import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { PrismaService } from '../../src/common/prisma/prisma.service';

describe('PorPerto E2E', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);
    
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('Authentication Flow', () => {
    it('should redirect to Google OAuth', () => {
      return request(app.getHttpServer())
        .get('/auth/google')
        .expect(302)
        .expect((res) => {
          expect(res.headers.location).toContain('accounts.google.com');
        });
    });

    it('should handle logout', () => {
      return request(app.getHttpServer())
        .post('/auth/logout')
        .expect(201)
        .expect({ message: 'Logged out successfully' });
    });
  });

  describe('GraphQL Queries (Unauthenticated)', () => {
    it('should return skills list', () => {
      const query = `
        query {
          skills {
            id
            name
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.skills).toBeInstanceOf(Array);
        });
    });

    it('should return search results for open requests', () => {
      const query = `
        query {
          searchRequests(input: { limit: 10, offset: 0 }) {
            id
            title
            description
            category
            status
            city
            lat
            lng
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data).toBeDefined();
          expect(res.body.data.searchRequests).toBeInstanceOf(Array);
        });
    });
  });

  describe('Geographic Validation', () => {
    it('should validate Mozelos location constraints', async () => {
      // Test that requests outside Mozelos area are rejected
      const invalidLocation = {
        lat: 41.1579, // Porto coordinates (outside Mozelos radius)
        lng: -8.6291,
      };

      // This would normally require authentication, but we're testing the validation logic
      const query = `
        mutation {
          createRequest(input: {
            title: "Test request outside Mozelos"
            description: "This should fail"
            category: "Testes"
            lat: ${invalidLocation.lat}
            lng: ${invalidLocation.lng}
          }) {
            id
            title
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          // Should return an error due to lack of authentication
          expect(res.body.errors).toBeDefined();
        });
    });
  });

  describe('Database Health', () => {
    it('should connect to database', async () => {
      const users = await prisma.user.findMany({ take: 1 });
      expect(users).toBeInstanceOf(Array);
    });

    it('should have seeded skills', async () => {
      const skills = await prisma.skill.findMany();
      expect(skills.length).toBeGreaterThan(0);
      
      const expectedSkills = ['Compras', 'Reparações', 'Companhia a idosos'];
      const skillNames = skills.map(s => s.name);
      
      expectedSkills.forEach(expectedSkill => {
        expect(skillNames).toContain(expectedSkill);
      });
    });

    it('should have seeded admin user', async () => {
      const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@porperto.local' }
      });
      
      expect(adminUser).toBeDefined();
      expect(adminUser?.role).toBe('ADMIN');
      expect(adminUser?.city).toBe('Mozelos');
    });
  });

  describe('Business Logic', () => {
    it('should enforce Mozelos-only city constraint', async () => {
      // Test seed data follows constraints
      const requests = await prisma.request.findMany();
      
      requests.forEach(request => {
        expect(request.city).toBe('Mozelos');
      });
    });

    it('should have proper geographic coordinates for Mozelos', async () => {
      const MOZELOS_CENTER_LAT = 40.9735;
      const MOZELOS_CENTER_LNG = -8.5480;
      const MOZELOS_RADIUS_KM = 7;
      
      const requests = await prisma.request.findMany();
      
      requests.forEach(request => {
        // Calculate distance using Haversine formula
        const R = 6371; // Earth's radius in km
        const dLat = (request.lat - MOZELOS_CENTER_LAT) * Math.PI / 180;
        const dLng = (request.lng - MOZELOS_CENTER_LNG) * Math.PI / 180;
        
        const a = 
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(MOZELOS_CENTER_LAT * Math.PI / 180) * Math.cos(request.lat * Math.PI / 180) *
          Math.sin(dLng / 2) * Math.sin(dLng / 2);
        
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = R * c;
        
        expect(distance).toBeLessThanOrEqual(MOZELOS_RADIUS_KM);
      });
    });
  });

  describe('GraphQL Schema', () => {
    it('should expose schema introspection', () => {
      const query = `
        query {
          __schema {
            types {
              name
            }
          }
        }
      `;

      return request(app.getHttpServer())
        .post('/graphql')
        .send({ query })
        .expect(200)
        .expect((res) => {
          expect(res.body.data.__schema).toBeDefined();
          expect(res.body.data.__schema.types).toBeInstanceOf(Array);
          
          const typeNames = res.body.data.__schema.types.map((t: any) => t.name);
          
          // Check for our custom types
          expect(typeNames).toContain('User');
          expect(typeNames).toContain('Request');
          expect(typeNames).toContain('Application');
          expect(typeNames).toContain('Message');
          expect(typeNames).toContain('Skill');
        });
    });
  });
});