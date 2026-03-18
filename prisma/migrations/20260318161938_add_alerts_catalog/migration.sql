-- CreateTable
CREATE TABLE "WishAlert" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "brand" TEXT,
    "model" TEXT,
    "minPrice" INTEGER,
    "maxPrice" INTEGER,
    "minYear" INTEGER,
    "maxYear" INTEGER,
    "fuel" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WishAlert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CatalogReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "carModel" TEXT NOT NULL,
    "wrongInfo" TEXT NOT NULL,
    "correctInfo" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CatalogReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WishAlert" ADD CONSTRAINT "WishAlert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CatalogReport" ADD CONSTRAINT "CatalogReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
