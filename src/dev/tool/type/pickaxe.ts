class TconPickaxe extends TconTool {

    readonly tconToolType = "pickaxe";
    readonly blockTypes = ["stone"];
    readonly isWeapon = false;
    readonly partsCount = 3;
    readonly headParts = [1];
    readonly texture = new ToolTexture(this.tconToolType, this.partsCount, 1);

    constructor(miningLevel: number){
        super("tcontool_pickaxe_lv" + miningLevel, "Pickaxe", "tcontool_pickaxe");
        this.setToolParams(miningLevel);
    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1])
             .extra(materials[2])
             .handle(materials[0]);
    }

}


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
