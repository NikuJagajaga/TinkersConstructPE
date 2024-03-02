class TraitDiamond extends TconTrait {

    constructor(parent: TconModifier){
        super("diamond", "Diamond", parent);
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.durability += 500;
        if(stats.level < MiningLv.OBSIDIAN){
            stats.level++;
        }
        stats.efficiency += 0.5;
        stats.damage++;
    }
    
}
