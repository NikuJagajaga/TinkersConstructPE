class TconExcavator extends TconTool3x3 {

    private static readonly DURABILITY_MODIFIER = 1.75;

    constructor(miningLevel: number){

        super("tcontool_excavator_lv" + miningLevel, "Excavator", "tcontool_excavator");

        this.tconToolType = "excavator";
        this.blockTypes = ["dirt"];
        this.texture = new ToolTexture(this.tconToolType, 4, 0);
        this.miningSpeedModifier = 0.28;
        this.damagePotential = 1.25;
        this.repairParts = [1, 2];

        this.setToolParams(miningLevel);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1], materials[2])
             .extra(materials[3])
             .handle(materials[0]);
        stats.durability *= TconExcavator.DURABILITY_MODIFIER;
    }

    override getRepairModifierForPart(index: number): number {
        return index === 1 ? TconExcavator.DURABILITY_MODIFIER : TconExcavator.DURABILITY_MODIFIER * 0.75;
    }

}


ItemRegistry.registerItem(new TconExcavator(MiningLv.STONE));
ItemRegistry.registerItem(new TconExcavator(MiningLv.IRON));
ItemRegistry.registerItem(new TconExcavator(MiningLv.DIAMOND));
ItemRegistry.registerItem(new TconExcavator(MiningLv.OBSIDIAN));
ItemRegistry.registerItem(new TconExcavator(MiningLv.COBALT));

TconToolFactory.addToCreative("excavator", "Excavator", 4);
ToolForgeHandler.addRecipe("excavator", ["rod2", "excavator", "largeplate", "binding2"]);

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
