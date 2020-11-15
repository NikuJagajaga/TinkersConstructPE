const texturePickaxe = new ToolTexture("model/tcontool_pickaxe");


class TinkersPickaxe extends TinkersTool {

    constructor(){
        super(["stone"], 3, 1);
    }

    buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        return stats;
    }

    getTexture(): ToolTexture {
        return texturePickaxe;
    }

}


TinkersToolHandler.registerTool("pickaxe", "Pickaxe", new TinkersPickaxe());
ToolForgeHandler.addRecipe(ItemID.tcontool_pickaxe, ["rod", "pickaxe", "binding"]);
ToolForgeHandler.addContents({
    title: "Pickaxe",
    background: "tcon.icon.pickaxe",
    intro: "The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?",
    slots: [
        {x: -18, y: 18, bitmap: "rod"},
        {x: 20, y: -20, bitmap: "pickaxe"},
        {x: 0, y: 0, bitmap: "binding"}
    ]
});