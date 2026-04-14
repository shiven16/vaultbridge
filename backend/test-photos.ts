import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.findUnique({
    where: { id: "2e101652-1263-4ae7-9e59-7fb4ae806502" }
  });
  
  if (!user || !user.sourceAccessToken) {
    return;
  }
  
  console.log("Fetching photos...");
  const response = await fetch(`https://photoslibrary.googleapis.com/v1/mediaItems`, {
    headers: {
      Authorization: `Bearer ${user.sourceAccessToken}`
    }
  });
  const data = await response.json();
  console.log("Photos:", JSON.stringify(data, null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
