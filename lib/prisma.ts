import { PrismaClient } from '@prisma/client'

const prismaClientSingleton = () => {
  return new PrismaClient()
}

declare global {
  var prismaGlobal: undefined | ReturnType<typeof prismaClientSingleton> | null
}

let prismaInstance;

try {
  prismaInstance = globalThis.prismaGlobal ?? prismaClientSingleton();
  if (process.env.NODE_ENV !== 'production') {
    globalThis.prismaGlobal = prismaInstance;
  }
} catch (error) {
  console.error("PrismaClient Initialization Failed locally. Proceeding with null to allow mock fallbacks.", error);
  prismaInstance = null;
}

export const prisma = prismaInstance as ReturnType<typeof prismaClientSingleton>;
