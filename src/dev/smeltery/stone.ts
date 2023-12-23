createBlock("tcon_grout", [{name: "Grout"}]);
Recipes2.addShapeless({id: BlockID.tcon_grout, count: 2}, ["sand", "gravel", "clay_ball"]);
Recipes2.addShapeless({id: BlockID.tcon_grout, count: 8}, [{id: "sand", count: 4}, {id: "gravel", count: 4}, "clay"]);

createItem("tcon_brick", "Seared Brick");
Recipes.addFurnace(BlockID.tcon_grout, ItemID.tcon_brick);


createBlock("tcon_stone", [
    {name: "Seared Stone", texture: [0]},
    {name: "Seared Cobblestone", texture: [1]},
    {name: "Seared Paver", texture: [2]},
    {name: "Seared Bricks", texture: [3]},
    {name: "Cracked Seared Bricks", texture: [4]},
    {name: "Fancy Seared Bricks", texture: [5]},
    {name: "Square Seared Bricks", texture: [6]},
    {name: "Seared Road", texture: [7]},
    {name: "Seared Creeperface", texture: [2, 2, 8]},
    {name: "Triangle Seared Bricks", texture: [9]},
    {name: "Small Seared Bricks", texture: [10]},
    {name: "Seared Tiles", texture: [11]}
]);


MeltingRecipe.addRecipe(BlockID.tcon_stone, "molten_stone", MatValue.SEARED_BLOCK);
MeltingRecipe.addRecipe(ItemID.tcon_brick, "molten_stone", MatValue.SEARED_MATERIAL);
MeltingRecipe.addRecipeForAmount(BlockID.tcon_grout, "molten_stone", MatValue.SEARED_MATERIAL, MatValue.SEARED_MATERIAL / 3);

CastingRecipe.addTableRecipeForAll("ingot", "molten_stone", ItemID.tcon_brick, MatValue.SEARED_MATERIAL);
CastingRecipe.addBasinRecipe(0, "molten_stone", {id: BlockID.tcon_stone, data: 0}, MatValue.SEARED_BLOCK);
CastingRecipe.addBasinRecipe(VanillaBlockID.cobblestone, "molten_stone", {id: BlockID.tcon_stone, data: 1}, MatValue.SEARED_MATERIAL * 3);

Recipes2.addShaped({id: BlockID.tcon_stone, data: 3}, "aa:aa", {a: ItemID.tcon_brick});
Recipes.addFurnace(BlockID.tcon_stone, 3, BlockID.tcon_stone, 4);


(() => {

    const addRecipe = (input: number, output: number): void => {
        Recipes2.addShapeless({id: BlockID.tcon_stone, data: output}, [{id: BlockID.tcon_stone, data: input}]);
    };

    addRecipe(0, 2);
    addRecipe(7, 2);
    addRecipe(2, 3);
    addRecipe(3, 5);
    addRecipe(5, 6);
    addRecipe(11, 7);
    addRecipe(9, 8);
    addRecipe(6, 9);
    addRecipe(8, 10);
    addRecipe(10, 11);

})();