const texturePickaxe = new ToolTexture("model/tcontool_pickaxe");


class TinkersPickaxe extends TinkersTool {

    constructor(){
        super(["stone"], 3, 1);
    }

    override buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        return stats;
    }

    override getTexture(): ToolTexture {
        return texturePickaxe;
    }

}


const myPickaxe = new TinkersPickaxe();
alert("buildStats: " + !!myPickaxe.buildStats);
TinkersToolHandler.createTool("tcontool_pickaxe", "Pickaxe", myPickaxe);
ToolForgeHandler.addRecipe(ItemID.tcontool_pickaxe, ["rod", "pickaxe", "binding"]);
ToolForgeHandler.addLayout({
    title: "Pickaxe",
    background: "tcon.icon.pickaxe",
    intro: "The Pickaxe is a precise mining tool. It is effective on stone and ores. It breaks blocks, OK?",
    slots: [
        {x: -18, y: 18, bitmap: "tcon.slot.rod"},
        {x: 20, y: -20, bitmap: "tcon.slot.pickaxe"},
        {x: 0, y: 0, bitmap: "tcon.slot.binding"}
    ]
});