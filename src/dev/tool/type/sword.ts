const textureSword = new ToolTexture("model/tcontool_sword", 3, 1);


class TinkersSword extends TinkersTool {

    private static DURABILITY_MODIFIER = 1.1;

    constructor(){
        super(["fibre"], 3, 1, true);
    }

    override buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        stats.attack += 1;
        stats.durability *= TinkersSword.DURABILITY_MODIFIER;
        return stats;
    }

    override getTexture(): ToolTexture {
        return textureSword;
    }

    override getRepairModifierForPart(index: number): number {
        return TinkersSword.DURABILITY_MODIFIER;
    }

}


TinkersToolHandler.createTool("tcontool_sword", "Broad Sword", new TinkersSword());
ToolForgeHandler.addRecipe(ItemID.tcontool_sword, ["rod", "sword", "guard"]);
ToolForgeHandler.addLayout({
    title: "Broad Sword",
    background: "tcon.icon.sword",
    intro: "The Broad Sword is a universal weapon. Sweep attacks keep enemy hordes at bay. Also good against cobwebs!",
    slots: [
        {x: -21, y: 20, bitmap: "tcon.slot.rod"},
        {x: 15, y: -16, bitmap: "tcon.slot.sword"},
        {x: -3, y: 2, bitmap: "tcon.slot.guard"}
    ]
});