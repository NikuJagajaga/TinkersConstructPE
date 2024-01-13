ModAPI.addAPICallback("ICore", (api: any) => {


    CastingRecipe.addMakeCastRecipes(ItemID.ingotCopper, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotTin, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotBronze, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotSteel, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotLead, "ingot");
    CastingRecipe.addMakeCastRecipes(ItemID.ingotSilver, "ingot");

    CastingRecipe.addMakeCastRecipes(ItemID.plateCopper, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateTin, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateBronze, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateIron, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateSteel, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateGold, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateLead, "plate");
    CastingRecipe.addMakeCastRecipes(ItemID.plateLapis, "plate");


    MeltingRecipe.addRecipe(BlockID.machineBlockBasic, "molten_iron", MatValue.INGOT * 8);
    MeltingRecipe.addRecipe(ItemID.cutter, "molten_iron", MatValue.INGOT * 5);
    MeltingRecipe.addRecipe(ItemID.craftingHammer, "molten_iron", MatValue.INGOT * 5);

    MeltingRecipe.addRecipe(ItemID.dustIron, "molten_iron", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateIron, "molten_iron", MatValue.INGOT);

    MeltingRecipe.addRecipe(ItemID.dustGold, "molten_gold", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateGold, "molten_gold", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.oreCopper, "molten_copper", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockCopper, "molten_copper", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotCopper, "molten_copper", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustCopper, "molten_copper", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateCopper, "molten_copper", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.oreTin, "molten_tin", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockTin, "molten_tin", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotTin, "molten_tin", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustTin, "molten_tin", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateTin, "molten_tin", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.blockBronze, "molten_bronze", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotBronze, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustBronze, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateBronze, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.wrenchBronze, "molten_bronze", MatValue.INGOT * 6);
    MeltingRecipe.addRecipe(ItemID.bronzeHelmet, "molten_bronze", MatValue.INGOT * 5);
    MeltingRecipe.addRecipe(ItemID.bronzeChestplate, "molten_bronze", MatValue.INGOT * 8);
    MeltingRecipe.addRecipe(ItemID.bronzeLeggings, "molten_bronze", MatValue.INGOT * 7);
    MeltingRecipe.addRecipe(ItemID.bronzeBoots, "molten_bronze", MatValue.INGOT * 4);
    MeltingRecipe.addRecipe(ItemID.bronzeSword, "molten_bronze", MatValue.INGOT * 2);
    MeltingRecipe.addRecipe(ItemID.bronzeShovel, "molten_bronze", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.bronzePickaxe, "molten_bronze", MatValue.INGOT * 3);
    MeltingRecipe.addRecipe(ItemID.bronzeAxe, "molten_bronze", MatValue.INGOT * 3);
    MeltingRecipe.addRecipe(ItemID.bronzeHoe, "molten_bronze", MatValue.INGOT * 2);

    MeltingRecipe.addRecipe(BlockID.oreLead, "molten_lead", MatValue.ORE);
    MeltingRecipe.addRecipe(BlockID.blockLead, "molten_lead", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotLead, "molten_lead", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustLead, "molten_lead", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateLead, "molten_lead", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.blockSilver, "molten_silver", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotSilver, "molten_silver", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.dustSilver, "molten_silver", MatValue.INGOT);

    MeltingRecipe.addRecipe(BlockID.blockSteel, "molten_steel", MatValue.BLOCK);
    MeltingRecipe.addRecipe(ItemID.ingotSteel, "molten_steel", MatValue.INGOT);
    MeltingRecipe.addRecipe(ItemID.plateSteel, "molten_steel", MatValue.INGOT);


    CastingRecipe.addBasinRecipe(0, "molten_copper", BlockID.blockCopper);
    CastingRecipe.addBasinRecipe(0, "molten_tin", BlockID.blockTin);
    CastingRecipe.addBasinRecipe(0, "molten_bronze", BlockID.blockBronze);
    CastingRecipe.addBasinRecipe(0, "molten_lead", BlockID.blockLead);
    CastingRecipe.addBasinRecipe(0, "molten_silver", BlockID.blockSilver);
    CastingRecipe.addBasinRecipe(0, "molten_steel", BlockID.blockSteel);

    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_copper", ItemID.ingotCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_tin", ItemID.ingotTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_bronze", ItemID.ingotBronze, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_lead", ItemID.ingotLead, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_silver", ItemID.ingotSilver, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_ingot, "molten_steel", ItemID.ingotSteel, false);

    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_iron", ItemID.plateIron, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_gold", ItemID.plateGold, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_copper", ItemID.plateCopper, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_tin", ItemID.plateTin, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_bronze", ItemID.plateBronze, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_lead", ItemID.plateLead, false);
    CastingRecipe.addTableRecipe(ItemID.tcon_cast_plate, "molten_steel", ItemID.plateSteel, false);


    //ToolForgeHandler.addVariation("block_copper", BlockID.blockCopper);
    //ToolForgeHandler.addVariation("block_tin", BlockID.blockTin);
    //ToolForgeHandler.addVariation("block_bronze", BlockID.blockBronze);
    //ToolForgeHandler.addVariation("block_lead", BlockID.blockLead);
    //ToolForgeHandler.addVariation("block_silver", BlockID.blockSilver);
    //ToolForgeHandler.addVariation("block_steel", BlockID.blockSteel);


    TconLumberaxe.LOGS.push(BlockID.rubberTreeLog);
    TconLumberaxe.LOGS.push(BlockID.rubberTreeLogLatex);


});