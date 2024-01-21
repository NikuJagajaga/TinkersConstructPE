class TconPickaxe extends TconTool {

    constructor(miningLevel: number){

        super("tcontool_pickaxe_lv" + miningLevel, "Pickaxe", "tcontool_pickaxe");

        this.tconToolType = "pickaxe";
        this.blockTypes = ["stone"];
        this.texture = new ToolTexture(this.tconToolType, 3, 1);

        this.setToolParams(miningLevel);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1])
             .extra(materials[2])
             .handle(materials[0]);
    }

}


ItemRegistry.registerItem(new TconPickaxe(MiningLv.STONE));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.IRON));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconPickaxe(MiningLv.COBALT));

TconToolFactory.addToCreative("pickaxe", "Pickaxe", 3);
ToolForgeHandler.addRecipe("pickaxe", ["rod", "pickaxe", "binding"]);

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
