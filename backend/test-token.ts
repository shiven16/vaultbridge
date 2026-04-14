import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: "2e101652-1263-4ae7-9e59-7fb4ae806502" }
  });
  
  if (!user) {
    console.log("No user found with that ID");
    return;
  }
  
  if (!user.sourceAccessToken) {
    console.log("User has no sourceAccessToken");
    return;
  }
  
  console.log("Checking token scopes for user:", user.email);
  const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${user.sourceAccessToken}`);
  const data = await response.json();
  console.log("Token info:", JSON.stringify(data, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
