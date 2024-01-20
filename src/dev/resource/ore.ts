IDRegistry.genBlockID("oreCobalt");
Block.createBlock("oreCobalt", [{name: "Cobalt Ore", texture: [["tcon_ore_cobalt", 0]], inCreative: true}]);
ToolAPI.registerBlockMaterial(BlockID.oreCobalt, "stone", MiningLv.COBALT, true);
Block.setDestroyLevel(BlockID.oreCobalt, MiningLv.COBALT);

IDRegistry.genBlockID("oreArdite");
Block.createBlock("oreArdite", [{name: "Ardite Ore", texture: [["tcon_ore_ardite", 0]], inCreative: true}]);
ToolAPI.registerBlockMaterial(BlockID.oreArdite, "stone", MiningLv.COBALT, true);
Block.setDestroyLevel(BlockID.oreArdite, MiningLv.COBALT);

Item.addCreativeGroup("ores", Translation.translate("Ores"), [BlockID.oreCobalt, BlockID.oreArdite]);

MeltingRecipe.addRecipe(BlockID.oreCobalt, "molten_cobalt", MatValue.ORE);
MeltingRecipe.addRecipe(BlockID.oreArdite, "molten_ardite", MatValue.ORE);


const generateNetherOre = (id: number, rate: number, chunkX: number, chunkZ: number, random: java.util.Random) => {
    for(let i = 0; i < rate; i += 2){
        GenerationUtils.generateOre(
            chunkX * 16 + random.nextInt(16),
            32 + random.nextInt(64),
            chunkZ * 16 + random.nextInt(16),
            id, 0, 5, false, random.nextInt()
        );
        GenerationUtils.generateOre(
            chunkX * 16 + random.nextInt(16),
            random.nextInt(128),
            chunkZ * 16 + random.nextInt(16),
            id, 0, 5, false, random.nextInt()
        );
    }
}

Callback.addCallback("GenerateNetherChunk", (chunkX: number, chunkZ: number, random: java.util.Random) => {
    generateNetherOre(BlockID.oreCobalt, Cfg.oreGen.cobaltRate, chunkX, chunkZ, random);
    generateNetherOre(BlockID.oreArdite, Cfg.oreGen.arditeRate, chunkX, chunkZ, random);
});