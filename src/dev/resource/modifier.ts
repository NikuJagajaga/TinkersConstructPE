createItem("tcon_silky_cloth", "Silky Cloth");
createItem("tcon_silky_jewel", "Silky Jewel");
Recipes2.addShaped(ItemID.tcon_silky_cloth, "aaa:aba:aaa", {a:"string", b: "gold_ingot"});
Recipes2.addShaped(ItemID.tcon_silky_jewel, "_a_:aba:_a_", {a: ItemID.tcon_silky_cloth, b: "emerald"});
MeltingRecipe.addRecipe(ItemID.tcon_silky_cloth, "molten_gold", MatValue.INGOT);


createItem("tcon_reinforcement", "Reinforcement");
Recipes2.addShaped(ItemID.tcon_reinforcement, "aaa:aba:aaa", {a: "obsidian", b: ItemID.tcon_cast_largeplate});


createBlock("tcon_graveyard_soil", [{name: "Graveyard Soil"}], "dirt");
createBlock("tcon_consecrated_soil", [{name: "Consecrated Soil"}], "dirt");
Recipes2.addShapeless(BlockID.tcon_graveyard_soil, ["dirt", "rotten_flesh", "bone_meal"]);
Recipes.addFurnace(BlockID.tcon_graveyard_soil, BlockID.tcon_consecrated_soil);


createItem("tcon_necrotic_bone", "Necrotic Bone");

Callback.addCallback("EntityDeath", (entity, attacker, damageType) => {
    if(KEX){
        return;
    }
    if(Entity.getType(entity) === EEntityType.WHITHER_SKELETON){
        if(Math.random() < (EntityHelper.isPlayer(Entity.getType(attacker)) ? 0.1 : 0.05)){
            const region = WorldRegion.getForDimension(Entity.getDimension(entity));
            region.dropItem(Entity.getPosition(entity), ItemID.tcon_necrotic_bone, 1, 0);
        }
    }
});

// KEX.LootModule.createLootTableModifier("entities/wither_skeleton")
//     .createNewPool()
//         .addEntry()
//             .describeItem(ItemID.tcon_necrotic_bone)
//             .describeItem("minecraft", "tcon_necrotic_bone")
//             .setWeight(1)
//             .setCount(1)
//         .endEntry()
//         .beginConditions()
//             .addKilledByPlayerCondition()
//             .addRandomChanceWithLootingCondition(0.8, 0.1)
//         .endConditions()
//     .endPool();


createItem("tcon_moss", "Ball of Moss");
createItem("tcon_mending_moss", "Mending Moss");
Recipes2.addShapeless(ItemID.tcon_moss, [{id: "mossy_cobblestone", count: 9}]);
Item.registerUseFunction(ItemID.tcon_moss, (coords, item, block, playerUid) => {
    if(block.id === VanillaBlockID.bookshelf){
        const player = new PlayerEntity(playerUid);
        const region = WorldRegion.getForActor(playerUid);
        const level = player.getLevel();
        if(level < 10){
            BlockEngine.sendMessage(Network.getClientForPlayer(playerUid), "Mending Moss requires at least 10 levels");
            return;
        }
        player.setLevel(level - 10);
        player.decreaseCarriedItem();
        player.addItemToInventory(ItemID.tcon_mending_moss, 1, 0);
        region.playSound(coords, "random.orb", 0.5);
    }
});


createItem("tcon_creative_modifier", "Creative Modifier");
