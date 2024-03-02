class TraitEmerald extends TconTrait {

    constructor(parent: TconModifier){
        super("emerald", "Emerald", parent);
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.durability += stats.durability >> 1;
        if(stats.level < MiningLv.DIAMOND){
            stats.level++;
        }
    }
    
}
