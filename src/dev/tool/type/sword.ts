const textureSword = new ToolTexture("model/tcontool_sword");


class TinkersSword extends TinkersTool {

    private static DURABILITY_MODIFIER = 1.1;

    constructor(){
        super(["fibre"], 3, 1, true);
    }

    buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        stats.attack += 1;
        stats.durability *= TinkersSword.DURABILITY_MODIFIER;
        return stats;
    }

    getTexture(): ToolTexture {
        return textureSword;
    }

    getRepairModifierForPart(index: number): number {
        return TinkersSword.DURABILITY_MODIFIER;
    }

}


TinkersToolHandler.registerTool("sword", "Broad Sword", new TinkersSword());
ToolForgeHandler.addRecipe(ItemID.tcontool_sword, ["rod", "sword", "guard"]);
ToolForgeHandler.addContents({
    title: "Broad Sword",
    background: "tcon.icon.sword",
    intro: "The Broad Sword is a universal weapon. Sweep attacks keep enemy hordes at bay. Also good against cobwebs!",
    slots: [
        {x: -21, y: 20, bitmap: "rod"},
        {x: 15, y: -16, bitmap: "sword"},
        {x: -3, y: 2, bitmap: "guard"}
    ]
});