-- CreateTable
CREATE TABLE "_RecipeTorecipeAttachements" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_RecipeTorecipeAttachements_AB_unique" ON "_RecipeTorecipeAttachements"("A", "B");

-- CreateIndex
CREATE INDEX "_RecipeTorecipeAttachements_B_index" ON "_RecipeTorecipeAttachements"("B");

-- AddForeignKey
ALTER TABLE "_RecipeTorecipeAttachements" ADD CONSTRAINT "_RecipeTorecipeAttachements_A_fkey" FOREIGN KEY ("A") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_RecipeTorecipeAttachements" ADD CONSTRAINT "_RecipeTorecipeAttachements_B_fkey" FOREIGN KEY ("B") REFERENCES "recipeAttachements"("id") ON DELETE CASCADE ON UPDATE CASCADE;
