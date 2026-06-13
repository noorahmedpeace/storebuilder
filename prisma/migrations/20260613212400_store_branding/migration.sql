-- AlterTable
ALTER TABLE "Store" ADD COLUMN     "accentColor" TEXT NOT NULL DEFAULT '#f3b74f',
ADD COLUMN     "announcement" TEXT,
ADD COLUMN     "brandColor" TEXT NOT NULL DEFAULT '#143c3a',
ADD COLUMN     "businessType" TEXT,
ADD COLUMN     "heroHeading" TEXT,
ADD COLUMN     "heroSubheading" TEXT,
ADD COLUMN     "logoText" TEXT,
ADD COLUMN     "tagline" TEXT,
ADD COLUMN     "themeKey" TEXT NOT NULL DEFAULT 'modern-retail',
ADD COLUMN     "whatsapp" TEXT;
