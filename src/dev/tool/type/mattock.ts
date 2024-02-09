class TconMattock extends TconTool {

    constructor(miningLevel: number){

        super("tcontool_mattock_lv" + miningLevel, "Mattock", "tcontool_mattock");

        this.tconToolType = "mattock";
        this.blockTypes = ["wood", "dirt"];
        this.texture = new ToolTexture(this.tconToolType, 3, 1);
        this.miningSpeedModifier = 0.95;
        this.damagePotential = 0.9;
        this.repairParts = [1, 2];

        this.setToolParams(miningLevel);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1], materials[2])
             .handle(materials[0]);
        stats.damage += 3;
    }

    index = 0;
    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(item.extra && (block.id === VanillaTileID.grass || block.id === VanillaTileID.dirt) && coords.side === EBlockSide.UP){
            const stack = new TconToolStack(item);
            if(!stack.isBroken()){
                const region = WorldRegion.getForActor(player);
                region.setBlock(coords, VanillaTileID.farmland, 0);
                region.playSound(coords.x, coords.y, coords.z, "step.gravel");
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
                stack.applyToHand(player);
            }
        }
    }

}


ToolForgeHandler.addRecipe("mattock", ["rod", "axe", "shovel"]);
ToolForgeHandler.addLayout({
    title: "Mattock",
    background: "tcon.icon.mattock",
    intro: "The Cutter Mattock is a versatile farming tool. It is effective on wood, dirt, and plants. It also packs quite a punch.",
    slots: [
        {x: -11, y: 11, bitmap: "tcon.slot.rod"},
        {x: -2, y: -20, bitmap: "tcon.slot.axe"},
        {x: 18, y: -8, bitmap: "tcon.slot.shovel"}
    ]
});
