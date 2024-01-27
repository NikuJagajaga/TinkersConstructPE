class TconHammer extends TconTool3x3 {

    private static readonly DURABILITY_MODIFIER = 2.5;

    constructor(miningLevel: number){

        super("tcontool_hammer_lv" + miningLevel, "Hammer", "tcontool_hammer");

        this.tconToolType = "hammer";
        this.blockTypes = ["stone"];
        this.texture = new ToolTexture(this.tconToolType, 4, 0);
        this.miningSpeedModifier = 0.4;
        this.damagePotential = 1.2;
        this.repairParts = [1, 2, 3];

        this.setToolParams(miningLevel);

    }

    override buildStats(stats: ToolStats, materials: TinkersMaterial[]): void {
        stats.head(materials[1], materials[1], materials[2], materials[3])
             .handle(materials[0]);
        stats.level = materials[1].getHeadStats().level;
        stats.durability *= TconHammer.DURABILITY_MODIFIER;
    }

    override getRepairModifierForPart(index: number): number {
        return index === 1 ? TconHammer.DURABILITY_MODIFIER : TconHammer.DURABILITY_MODIFIER * 0.6;
    }

}


ToolForgeHandler.addRecipe("hammer", ["rod2", "hammer", "largeplate", "largeplate"]);
ToolForgeHandler.addLayout({
    title: "Hammer",
    background: "tcon.icon.hammer",
    intro: "The Hammer is a broad mining tool. It harvests blocks in a wide range. Also effective against undead.",
    slots: [
        {x: -12, y: 10, bitmap: "tcon.slot.rod2"},
        {x: 11, y: -13, bitmap: "tcon.slot.hammer"},
        {x: 24, y: 6, bitmap: "tcon.slot.plate"},
        {x: -8, y: -26, bitmap: "tcon.slot.plate"}
    ],
    forgeOnly: true
});
