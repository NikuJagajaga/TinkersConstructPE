class ModDiamond extends TinkersModifier {

    constructor(){
        super("diamond", "Diamond", 3, ["diamond"], 1, false);
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.durability += 500;
        if(stats.level < MiningLv.OBSIDIAN){
            stats.level++;
        }
        stats.speed += 0.5;
        stats.attack++;
    }
    
}