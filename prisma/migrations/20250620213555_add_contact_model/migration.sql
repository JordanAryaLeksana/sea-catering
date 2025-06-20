-- CreateEnum
CREATE TYPE "ContactType" AS ENUM ('GENERAL', 'FEEDBACK', 'SUPPORT');

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "type" "ContactType" NOT NULL DEFAULT 'GENERAL',
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);
