IDRegistry.genBlockID("oreCobalt");
Block.createBlock("oreCobalt", [{name: "Cobalt Ore", texture: [["tcon_ore_cobalt", 0]], inCreative: true}]);
ToolAPI.registerBlockMaterial(BlockID.oreCobalt, "stone", TinkersMaterial.COBALT, true);
Block.setDestroyLevel(BlockID.oreCobalt, TinkersMaterial.COBALT);

IDRegistry.genBlockID("oreArdite");
Block.createBlock("oreArdite", [{name: "Ardite Ore", texture: [["tcon_ore_ardite", 0]], inCreative: true}]);
ToolAPI.registerBlockMaterial(BlockID.oreArdite, "stone", TinkersMaterial.COBALT, true);
Block.setDestroyLevel(BlockID.oreArdite, TinkersMaterial.COBALT);

Item.addCreativeGroup("ores", Translation.translate("Ores"), [BlockID.oreCobalt, BlockID.oreArdite]);

MeltingRecipe.addRecipe(BlockID.oreCobalt, "molten_cobalt", MatValue.ORE);
MeltingRecipe.addRecipe(BlockID.oreArdite, "molten_ardite", MatValue.ORE);


const generateNetherOre = (id: number, rate: number, x: number, z: number, random: java.util.Random) => {
    for(let i = 0; i < rate; i += 2){
        GenerationUtils.generateOre(
            x + random.nextInt(16),
            32 + random.nextInt(64),
            z + random.nextInt(16),
            id, 0, 5, false, random.nextInt()
        );
        GenerationUtils.generateOre(
            x + random.nextInt(16),
            random.nextInt(128),
            z + random.nextInt(16),
            id, 0, 5, false, random.nextInt()
        );
    }
}

Callback.addCallback("GenerateNetherChunk", (chunkX: number, chunkZ: number, random: java.util.Random) => {
    const x = chunkX << 4;
    const z = chunkZ << 4;
    generateNetherOre(BlockID.oreCobalt, Cfg.oreGen.cobaltRate, x, z, random);
    generateNetherOre(BlockID.oreArdite, Cfg.oreGen.arditeRate, x, z, random);
});