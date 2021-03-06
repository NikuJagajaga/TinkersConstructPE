class ModEmerald extends TinkersModifier {

    constructor(){
        super("emerald", "Emerald", 4, [VanillaItemID.emerald], 1, false);
    }

    applyStats(stats: ToolStats, level: number): void {
        stats.durability += stats.durability >> 1;
        stats.level = Math.min(stats.level + 1, TinkersMaterial.DIAMOND);
    }
    
}