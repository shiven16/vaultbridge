import { PrismaClient } from '@prisma/client';
import fetch from 'node-fetch';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findFirst({
    orderBy: { createdAt: 'desc' }
  });
  if (!user) {
    console.log("No users found");
    return;
  }
  
  if (!user.sourceAccessToken) {
    console.log("User has no sourceAccessToken");
    return;
  }
  
  console.log("Checking token scopes for user:", user.email);
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${user.sourceAccessToken}`);
  const data = await response.json();
  console.log("Token info:", data);
}

main().catch(console.error).finally(() => prisma.$disconnect());
