class TconPickaxe extends TconTool {

    constructor(){

        super("tcontool_pickaxe", "Pickaxe");

        this.blockTypes = ["stone"];
        this.texture = new ToolTexture("pickaxe", 3, 1);

        this.setToolParams();
        this.addToCreative(3);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1])
             .extra(materials[2])
             .handle(materials[0]);
    }

}


ItemRegistry.registerItem(new TconPickaxe());
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
