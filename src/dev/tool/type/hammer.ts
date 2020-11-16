const textureHammer = new ToolTexture("model/tcontool_hammer");


class TinkersHammer extends TinkersTool3x3 {

    private static readonly DURABILITY_MODIFIER = 2.5;

    constructor(){
        super(["stone"], 4, 0);
    }

    buildStats(materials: string[]): ToolStats {
        const stats = new ToolStats();
        stats.head(materials[1], materials[1], materials[2], materials[3]);
        stats.handle(materials[0]);
        stats.level = Material[materials[1]].getHeadStats().level;
        stats.durability *= TinkersHammer.DURABILITY_MODIFIER;
        return stats;
    }

    miningSpeedModifier(): number {
        return 0.4;
    }

    damagePotential(): number {
        return 1.2;
    }

    getTexture(): ToolTexture {
        return textureHammer;
    }

    getRepairParts(): number[] {
        return [1, 2, 3];
    }

    getRepairModifierForPart(index: number): number {
        return index === 1 ? TinkersHammer.DURABILITY_MODIFIER : TinkersHammer.DURABILITY_MODIFIER * 0.6;
    }

}


TinkersToolHandler.registerTool("hammer", "Hammer", new TinkersHammer());
ToolForgeHandler.addRecipe(ItemID.tcontool_hammer, ["rod2", "hammer", "largeplate", "largeplate"]);
ToolForgeHandler.addContents({
    title: "Hammer",
    background: "tcon.icon.hammer",
    intro: "The Hammer is a broad mining tool. It harvests blocks in a wide range. Also effective against undead.",
    slots: [
        {x: -12, y: 10, bitmap: "rod2"},
        {x: 11, y: -13, bitmap: "hammer"},
        {x: 24, y: 6, bitmap: "plate"},
        {x: -8, y: -26, bitmap: "plate"}
    ],
    forgeOnly: true
});