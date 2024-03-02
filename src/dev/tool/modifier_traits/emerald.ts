const TraitEmerald = new class extends TconTrait {

    constructor(){
        super("emerald", "Emerald", "#41f384");
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.durability += stats.durability >> 1;
        if(stats.level < MiningLv.DIAMOND){
            stats.level++;
        }
    }
    
}
