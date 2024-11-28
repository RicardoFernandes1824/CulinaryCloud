-- CreateTable
CREATE TABLE "recipeAttachements" (
    "id" SERIAL NOT NULL,
    "path" TEXT,
    "tips" TEXT,

    CONSTRAINT "recipeAttachements_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "recipeAttachements_path_key" ON "recipeAttachements"("path");
