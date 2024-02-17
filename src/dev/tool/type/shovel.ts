class TconShovel extends TconTool {

    readonly tconToolType = "shovel";
    readonly blockTypes = ["dirt"];
    readonly isWeapon = false;
    readonly partsCount = 3;
    readonly headParts = [1];
    readonly texture = new ToolTexture(this.tconToolType, this.partsCount, 1);

    readonly damagePotential = 0.9;

    constructor(miningLevel: number){
        super("tcontool_shovel_lv" + miningLevel, "Shovel", "tcontool_shovel");
        this.setToolParams(miningLevel);
    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1])
             .extra(materials[2])
             .handle(materials[0]);
    }

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, block: Tile, player: number): void {
        if(item.extra && block.id === VanillaTileID.grass && coords.side === EBlockSide.UP){
            const stack = new TconToolStack(item);
            if(!stack.isBroken()){
                const region = WorldRegion.getForActor(player);
                region.setBlock(coords, VanillaTileID.grass_path, 0);
                region.playSound(coords.x, coords.y, coords.z, "step.grass");
                stack.consumeDurability(1, player);
                stack.addXp(1, player);
                stack.applyToHand(player);
            }
        }
    }

}


ToolForgeHandler.addRecipe("shovel", ["rod", "shovel", "binding"]);
ToolForgeHandler.addLayout({
    title: "Shovel",
    background: "tcon.icon.shovel",
    intro: "The Shovel digs up dirt. It is effective on dirt, sand, gravel, and snow. Just don't dig your own grave!",
    slots: [
        {x: 0, y: 0, bitmap: "tcon.slot.rod"},
        {x: 18, y: -18, bitmap: "tcon.slot.shovel"},
        {x: -20, y: 20, bitmap: "tcon.slot.binding"}
    ]
});
