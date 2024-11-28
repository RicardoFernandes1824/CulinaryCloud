/*
  Warnings:

  - You are about to drop the `_RecipeTorecipeAttachements` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `recipeId` to the `recipeAttachements` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_RecipeTorecipeAttachements" DROP CONSTRAINT "_RecipeTorecipeAttachements_A_fkey";

-- DropForeignKey
ALTER TABLE "_RecipeTorecipeAttachements" DROP CONSTRAINT "_RecipeTorecipeAttachements_B_fkey";

-- AlterTable
ALTER TABLE "recipeAttachements" ADD COLUMN     "recipeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_RecipeTorecipeAttachements";

-- AddForeignKey
ALTER TABLE "recipeAttachements" ADD CONSTRAINT "recipeAttachements_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
