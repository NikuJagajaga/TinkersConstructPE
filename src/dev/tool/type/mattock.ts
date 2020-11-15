const textureMattock = new ToolTexture("model/tcontool_mattock");


class TinkersMattock extends TinkersTool {

    constructor(){
        super(["wood", "dirt"], 3, 1);
    }

    buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1], materials[2]);
        stats.handle(materials[0]);
        stats.attack += 3;
        return stats;
    }

    miningSpeedModifier(): number {
        return 0.95;
    }

    damagePotential(): number {
        return 0.9;
    }

    getTexture(): ToolTexture {
        return textureMattock;
    }

    getRepairParts(): number[] {
        return [1, 2];
    }

    useItem(coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile): void {
        if(item.extra && (block.id == VanillaBlockID.grass || block.id == VanillaBlockID.dirt) && coords.side == 1){ 
            const toolData = new ToolData(item);
            World.setBlock(coords.x, coords.y, coords.z, VanillaBlockID.farmland);
            World.playSound(coords.x + 0.5, coords.y + 1, coords.z + 0.5, "step.gravel", 1, 0.8);
            toolData.consumeDurability(1);
        }
    }

}


TinkersToolHandler.registerTool("mattock", "Mattock", new TinkersMattock());
ToolForgeHandler.addRecipe(ItemID.tcontool_mattock, ["rod", "axe", "shovel"]);
ToolForgeHandler.addContents({
    title: "Mattock",
    background: "tcon.icon.mattock",
    intro: "The Cutter Mattock is a versatile farming tool. It is effective on wood, dirt, and plants. It also packs quite a punch.",
    slots: [
        {x: -11, y: 11, bitmap: "rod"},
        {x: -2, y: -20, bitmap: "axe"},
        {x: 18, y: -8, bitmap: "shovel"}
    ]
});