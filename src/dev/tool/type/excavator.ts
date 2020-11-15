const textureExcavator = new ToolTexture("model/tcontool_excavator");


class TinkersExcavator extends TinkersTool3x3 {

    private static readonly DURABILITY_MODIFIER = 1.75;

    constructor(){
        super(["dirt"], 4, 0);
    }

    buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1], materials[2]);
        stats.extra(materials[3]);
        stats.handle(materials[0]);
        stats.durability *= TinkersExcavator.DURABILITY_MODIFIER;
        return stats;
    }

    miningSpeedModifier(): number {
        return 0.28;
    }

    damagePotential(): number {
        return 1.25;
    }

    getTexture(): ToolTexture {
        return textureExcavator;
    }

    getRepairParts(): number[] {
        return [1, 2];
    }

    getRepairModifierForPart(index: number): number {
        return index === 1 ? TinkersExcavator.DURABILITY_MODIFIER : TinkersExcavator.DURABILITY_MODIFIER * 0.75;
    }

}


TinkersToolHandler.registerTool("excavator", "Excavator", new TinkersExcavator());
ToolForgeHandler.addRecipe(ItemID.tcontool_excavator, ["rod2", "excavator", "plate", "binding2"]);
ToolForgeHandler.addContents({
    title: "Excavator",
    background: "tcon.icon.excavator",
    intro: "The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!",
    slots: [
        {x: -8, y: 4, bitmap: "rod2"},
        {x: 12, y: -16, bitmap: "excavator"},
        {x: -8, y: -16, bitmap: "plate"},
        {x: -26, y: 20, bitmap: "binding2"}
    ],
    forgeOnly: true
});