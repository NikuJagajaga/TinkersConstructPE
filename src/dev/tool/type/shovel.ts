const textureShovel = new ToolTexture("model/tcontool_shovel");


class TinkersShovel extends TinkersTool {

    constructor(){
        super(["dirt"], 3, 1);
    }

    buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        return stats;
    }

    damagePotential(): number {
        return 0.9;
    }

    getTexture(): ToolTexture {
        return textureShovel;
    }

    useItem(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile): void {
        if(item.extra && block.id == VanillaBlockID.grass && coords.side == 1){ 
            const toolData = new ToolData(item);
            World.setBlock(coords.x, coords.y, coords.z, VanillaBlockID.grass_path);
            World.playSound(coords.x + 0.5, coords.y + 1, coords.z + 0.5, "step.grass", 1, 0.8);
            toolData.consumeDurability(1);
        }
    }

}


TinkersToolHandler.registerTool("shovel", "Shovel", new TinkersShovel());
ToolForgeHandler.addRecipe(ItemID.tcontool_shovel, ["rod", "shovel", "binding"]);
ToolForgeHandler.addContents({
    title: "Shovel",
    background: "tcon.icon.shovel",
    intro: "The Shovel digs up dirt. It is effective on dirt, sand, gravel, and snow. Just don't dig your own grave!",
    slots: [
        {x: 0, y: 0, bitmap: "rod"},
        {x: 18, y: -18, bitmap: "shovel"},
        {x: -20, y: 20, bitmap: "binding"}
    ]
});