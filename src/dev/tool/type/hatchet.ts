const textureHatchet = new ToolTexture("model/tcontool_hatchet");


class TinkersHatchet extends TinkersTool {

    constructor(){
        super(["wood", "plant"], 3, 1);
    }

    buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1]);
        stats.extra(materials[2]);
        stats.handle(materials[0]);
        stats.attack += 0.5;
        return stats;
    }

    damagePotential(): number {
        return 1.1;
    }

    getTexture(): ToolTexture {
        return textureHatchet;
    }

}


TinkersToolHandler.registerTool("hatchet", "Hatchet", new TinkersHatchet());
ToolForgeHandler.addRecipe(ItemID.tcontool_hatchet, ["rod", "axe", "binding"]);
ToolForgeHandler.addContents({
    title: "Hatchet",
    background: "tcon.icon.hatchet",
    intro: "The Hatchet chops up wood and makes short work of leaves. It also makes for a passable weapon. Chop chop!",
    slots: [
        {x: -11, y: 11, bitmap: "rod"},
        {x: -2, y: -20, bitmap: "axe"},
        {x: 18, y: -8, bitmap: "binding"}
    ]
});