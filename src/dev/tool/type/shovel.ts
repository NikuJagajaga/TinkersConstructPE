class TconShovel extends TconTool {

    constructor(){

        super("tcontool_shovel", "Shovel");

        this.blockTypes = ["dirt"];
        this.texture = new ToolTexture("model/tcontool_shovel", 3, 1);
        this.damagePotential = 0.9;

        this.setToolParams();
        this.addToCreative(3);

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
                stack.consumeDurability(1);
                stack.addXp(1);
                stack.applyToHand(player);
            }
        }
    }

}


ItemRegistry.registerItem(new TconShovel());
ToolForgeHandler.addRecipe(ItemID.tcontool_shovel, ["rod", "shovel", "binding"]);
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
