createBlock("blockKnightslime", [{name: "Block of Knightslime", texture: "tcon_block_knightslime"}]);
createBlock("blockCobalt", [{name: "Block of Cobalt", texture: "tcon_block_cobalt"}]);
createBlock("blockArdite", [{name: "Block of Ardite", texture: "tcon_block_ardite"}]);
createBlock("blockManyullyn", [{name: "Block of Manyullyn", texture: "tcon_block_manyullyn"}]);
createBlock("blockPigiron", [{name: "Block of Pigiron", texture: "tcon_block_pigiron"}]);
createBlock("blockAlubrass", [{name: "Block of Aluminum Brass", texture: "tcon_block_alubrass"}]);

createItem("ingotKnightslime", "Knightslime Ingot", {name: "tcon_ingot_knightslime"});
createItem("ingotCobalt", "Cobalt Ingot", {name: "tcon_ingot_cobalt"});
createItem("ingotArdite", "Ardite Ingot", {name: "tcon_ingot_ardite"});
createItem("ingotManyullyn", "Manyullyn Ingot", {name: "tcon_ingot_manyullyn"});
createItem("ingotPigiron", "Pigiron Ingot", {name: "tcon_ingot_pigiron"});
createItem("ingotAlubrass", "Aluminum Brass Ingot", {name: "tcon_ingot_alubrass"});
/*
createItem("nuggetKnightslime", "Knightslime Nugget", {name: "tcon_nugget_knightslime"});
createItem("nuggetCobalt", "Cobalt Nugget", {name: "tcon_nugget_cobalt"});
createItem("nuggetArdite", "Ardite Nugget", {name: "tcon_nugget_ardite"});
createItem("nuggetManyullyn", "Manyullyn Nugget", {name: "tcon_nugget_manyullyn"});
createItem("nuggetPigiron", "Pigiron Nugget", {name: "tcon_nugget_pigiron"});
createItem("nuggetAlubrass", "Aluminum Brass Nugget", {name: "tcon_nugget_alubrass"});
*/
Recipes.addFurnace(BlockID.oreCobalt, ItemID.ingotCobalt);
Recipes.addFurnace(BlockID.oreArdite, ItemID.ingotArdite);

Callback.addCallback("PreLoaded", () => {

    const addRecipes = (liquid: string, block: number, ingot: number/*, nugget: number*/): void => {
        MeltingRecipe.addRecipe(block, liquid, MatValue.BLOCK);
        MeltingRecipe.addRecipe(ingot, liquid, MatValue.INGOT);
        //MeltingRecipe.addRecipe(nugget, liquid, MatValue.NUGGET);
        CastingRecipe.addBasinRecipe(0, liquid, block, MatValue.BLOCK);
        CastingRecipe.addTableRecipeForAll("ingot", liquid, ingot);
        //CastingRecipe.addTableRecipeForAll("nugget", liquid, nugget);
        CastingRecipe.addMakeCastRecipes(ingot, "ingot");
        Recipes2.addShapeless(block, [{id: ingot, count: 9}]);
        Recipes2.addShapeless({id: ingot, count: 9}, [block]);
        //Recipes2.addShapeless(ingot, [{id: nugget, count: 9}]);
        //Recipes2.addShapeless({id: nugget, count: 9}, [ingot]);
    };

    addRecipes("molten_knightslime", BlockID.blockKnightslime, ItemID.ingotKnightslime/*, ItemID.nuggetKnightslime*/);
    addRecipes("molten_cobalt", BlockID.blockCobalt, ItemID.ingotCobalt/*, ItemID.nuggetCobalt*/);
    addRecipes("molten_ardite", BlockID.blockArdite, ItemID.ingotArdite/*, ItemID.nuggetArdite*/);
    addRecipes("molten_manyullyn", BlockID.blockManyullyn, ItemID.ingotManyullyn/*, ItemID.nuggetManyullyn*/);
    addRecipes("molten_pigiron", BlockID.blockPigiron, ItemID.ingotPigiron/*, ItemID.nuggetPigiron*/);
    addRecipes("molten_alubrass", BlockID.blockAlubrass, ItemID.ingotAlubrass/*, ItemID.nuggetAlubrass*/);

});


createItem("tcon_paperstack", "Paper Stack");
Recipes2.addShapeless(ItemID.tcon_paperstack, [{id: "paper", count: 4}]);


createBlock("tcon_lavawood", [{name: "Lavawood"}]);
createBlock("tcon_firewood", [{name: "Firewood"}]);
CastingRecipe.addBasinRecipe(VanillaBlockID.planks, "lava", BlockID.tcon_lavawood, 250);
Recipes2.addShapeless(BlockID.tcon_firewood, [BlockID.tcon_lavawood, {id: "blaze_powder", count: 2}]);


createItem("tcon_slimeball_blue", "Blue Slime");
createItem("tcon_slimeball_purple", "Purple Slime");
Recipes2.addShapeless(ItemID.tcon_slimeball_blue, ["slime_ball", {id: "blue_dye", count: 2}]);
Recipes2.addShapeless(ItemID.tcon_slimeball_purple, [ItemID.tcon_slimeball_blue, {id: "redstone", count: 2}]);
MeltingRecipe.addRecipe(ItemID.tcon_slimeball_purple, "purpleslime", MatValue.SLIME_BALL);


Item.addCreativeGroup("tcon_slimymud", translate("Slimy Mud"), [
    createBlock("tcon_slimymud_green", [{name: "Slimy Mud"}]),
    createBlock("tcon_slimymud_blue", [{name: "Blue Slimy Mud"}]),
    createBlock("tcon_slimymud_magma", [{name: "Magma Slimy Mud"}])
]);
Recipes2.addShapeless(BlockID.tcon_slimymud_green, [{id: "slime_ball", count: 4}, "sand", "dirt"]);
Recipes2.addShapeless(BlockID.tcon_slimymud_blue, [{id: ItemID.tcon_slimeball_blue, count: 4}, "sand", "dirt"]);
Recipes2.addShapeless(BlockID.tcon_slimymud_magma, [{id: "magma_cream", count: 4}, "soul_sand", "netherrack"]);


Item.addCreativeGroup("tcon_slimycrystal", translate("Slime Crystal"), [
    createItem("tcon_slimecrystal_green", "Slime Crystal"),
    createItem("tcon_slimecrystal_blue", "Blue Slime Crystal"),
    createItem("tcon_slimecrystal_magma", "Magma Slime Crystal")
]);
Recipes.addFurnace(BlockID.tcon_slimymud_green, ItemID.tcon_slimecrystal_green);
Recipes.addFurnace(BlockID.tcon_slimymud_blue, ItemID.tcon_slimecrystal_blue);
Recipes.addFurnace(BlockID.tcon_slimymud_magma, ItemID.tcon_slimecrystal_magma);


createBlock("tcon_clear_glass", [{name: "Clear Glass"}]);
CastingRecipe.addBasinRecipe(0, "molten_glass", BlockID.tcon_clear_glass, 1000);
ConnectedTexture.setModelForGlass(BlockID.tcon_clear_glass, -1, "tcon_clear_glass");

createBlock("tcon_seared_glass", [{name: "Seared Glass"}]);
Recipes2.addShaped(BlockID.tcon_seared_glass, "_a_:aba:_a_", {a: ItemID.tcon_brick, b: "glass"});
CastingRecipe.addBasinRecipe(VanillaBlockID.glass, "molten_stone", BlockID.tcon_seared_glass, MatValue.SEARED_BLOCK);
ConnectedTexture.setModelForGlass(BlockID.tcon_seared_glass, -1, "tcon_seared_glass");
