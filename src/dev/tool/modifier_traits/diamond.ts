const TraitDiamond = new class extends TconTrait {

    constructor(){
        super("diamond", "Diamond", "#8cf4e2");
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
