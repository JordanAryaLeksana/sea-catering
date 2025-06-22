-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "pausedFrom" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "pausedUntil" TIMESTAMP(3);
