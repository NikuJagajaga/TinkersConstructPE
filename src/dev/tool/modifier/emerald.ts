class ModEmerald extends TinkersModifier {

    constructor(){
        super("emerald", "Emerald", 4, ["emerald"], 1, false);
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.durability += stats.durability >> 1;
        if(stats.level < MiningLv.DIAMOND){
            stats.level++;
        }
    }
    
}