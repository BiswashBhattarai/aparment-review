-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "password_hash" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "verification_token" TEXT,
    "is_student" BOOLEAN NOT NULL DEFAULT false,
    "last_review_at" TIMESTAMP(3),
    "review_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Apartment" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "rent_min" DOUBLE PRECISION,
    "rent_max" DOUBLE PRECISION,
    "bedrooms" INTEGER,
    "bathrooms" DOUBLE PRECISION,
    "distance_to_campus" DOUBLE PRECISION,
    "utilities_included" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "pet_policy" TEXT NOT NULL,
    "parking_available" BOOLEAN NOT NULL DEFAULT false,
    "parking_type" TEXT NOT NULL,
    "furnished" BOOLEAN NOT NULL DEFAULT false,
    "lease_length_options" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Apartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "apartmentId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "overall_rating" INTEGER NOT NULL,
    "noise_rating" INTEGER NOT NULL,
    "maintenance_rating" INTEGER NOT NULL,
    "management_rating" INTEGER NOT NULL,
    "value_rating" INTEGER NOT NULL,
    "written_review" TEXT NOT NULL,
    "display_as_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "is_verified_student" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moderation_flag" TEXT NOT NULL DEFAULT 'none',

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "Review_created_at_idx" ON "Review"("created_at");

-- CreateIndex
CREATE INDEX "Review_apartmentId_idx" ON "Review"("apartmentId");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_apartmentId_fkey" FOREIGN KEY ("apartmentId") REFERENCES "Apartment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
