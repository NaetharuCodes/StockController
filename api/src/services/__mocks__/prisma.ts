import { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

const prisma = mockDeep<PrismaClient>();

// 3 - Then use it in beforeEach
beforeEach(() => {
  mockReset(prisma);
});

export default prisma;
