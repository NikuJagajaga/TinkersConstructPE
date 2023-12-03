const textureExcavator = new ToolTexture("model/tcontool_excavator", 4, 0);


class TinkersExcavator extends TinkersTool3x3 {

    private static readonly DURABILITY_MODIFIER = 1.75;

    constructor(){
        super(["dirt"], 4, 0);
    }

    override buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1], materials[2]);
        stats.extra(materials[3]);
        stats.handle(materials[0]);
        stats.durability *= TinkersExcavator.DURABILITY_MODIFIER;
        return stats;
    }

    override miningSpeedModifier(): number {
        return 0.28;
    }

    override damagePotential(): number {
        return 1.25;
    }

    override getTexture(): ToolTexture {
        return textureExcavator;
    }

    override getRepairParts(): number[] {
        return [1, 2];
    }

    override getRepairModifierForPart(index: number): number {
        return index === 1 ? TinkersExcavator.DURABILITY_MODIFIER : TinkersExcavator.DURABILITY_MODIFIER * 0.75;
    }

}


TinkersToolHandler.createTool("tcontool_excavator", "Excavator", new TinkersExcavator());
ToolForgeHandler.addRecipe(ItemID.tcontool_excavator, ["rod2", "excavator", "largeplate", "binding2"]);
ToolForgeHandler.addLayout({
    title: "Excavator",
    background: "tcon.icon.excavator",
    intro: "The Excavator is a broad digging tool. It digs up large areas of soil and snow in a wide range. Terraforming!",
    slots: [
        {x: -8, y: 4, bitmap: "tcon.slot.rod2"},
        {x: 12, y: -16, bitmap: "tcon.slot.excavator"},
        {x: -8, y: -16, bitmap: "tcon.slot.plate"},
        {x: -26, y: 20, bitmap: "tcon.slot.binding2"}
    ],
    forgeOnly: true
});