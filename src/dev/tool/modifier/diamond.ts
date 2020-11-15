class ModDiamond extends TinkersModifier {

    constructor(){
        super("diamond", "Diamond", 3, [VanillaItemID.diamond], 1, false);
    }

    applyStats(stats: ToolStats, level: number): void {
        stats.durability += 500;
        stats.level = Math.min(stats.level + 1, TinkersMaterial.OBSIDIAN);
        stats.speed += 0.5;
        stats.attack++;
    }
    
}