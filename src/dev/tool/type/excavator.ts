class TconExcavator extends TconTool3x3 {

    private static readonly DURABILITY_MODIFIER = 1.75;

    constructor(){

        super("tcontool_excavator", "Excavator");

        this.blockTypes = ["stone"];
        this.texture = new ToolTexture("model/tcontool_excavator", 4, 0);
        this.miningSpeedModifier = 0.28;
        this.damagePotential = 1.25;
        this.repairParts = [1, 2];

        this.setToolParams();

    }

    override buildStats(stats: ToolStats, materials: string[]): void {
        stats.head(materials[1], materials[2])
             .extra(materials[3])
             .handle(materials[0]);
        stats.durability *= TconExcavator.DURABILITY_MODIFIER;
    }

    override getRepairModifierForPart(index: number): number {
        return index === 1 ? TconExcavator.DURABILITY_MODIFIER : TconExcavator.DURABILITY_MODIFIER * 0.75;
    }

}


ItemRegistry.registerItem(new TconExcavator());
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
