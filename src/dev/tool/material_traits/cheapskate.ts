const TraitCheapskate = new class extends TconTrait {

    constructor(){
        super("cheapskate", "Cheapskate", "#AAAAAA");
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.durability = Math.max(1, stats.durability * 80 / 100 | 0);
    }

}
