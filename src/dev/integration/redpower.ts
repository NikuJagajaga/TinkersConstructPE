ModAPI.addAPICallback("RedCore", (api: any) => {

    CastingRecipe.addMakeCastRecipes(ItemID.ingotCopper, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotTin, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotBronze, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotSilver, "ingot");


    MeltingRecipe.addRecipe(BlockID.oreCopper, "molten_copper", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockCopper, "molten_copper", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotCopper, "molten_copper", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.oreTin, "molten_tin", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockTin, "molten_tin", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotTin, "molten_tin", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.blockBronze, "molten_bronze", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotBronze, "molten_bronze", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.oreSilver, "molten_silver", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockSilver, "molten_silver", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotSilver, "molten_silver", MatValue.INGOT);


    CastingRecipe.addBasinRecipe(0, "molten_copper", BlockID.blockCopper);
    CastingRecipe.addBasinRecipe(0, "molten_tin", BlockID.blockTin);
    CastingRecipe.addBasinRecipe(0, "molten_bronze", BlockID.blockBronze);
    CastingRecipe.addBasinRecipe(0, "molten_silver", BlockID.blockSilver);

    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_copper", ItemID.ingotCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_tin", ItemID.ingotTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_bronze", ItemID.ingotBronze, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_silver", ItemID.ingotSilver, false);


    //ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    //ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    //ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
    //ToolForgeHandler.addVariation("block_silver", BlockID.blockSilver);

});