class ModEmerald extends TinkersModifier {

    constructor(){
        super("emerald", "Emerald", 1, false);
        this.texIndex = 4;
        this.setRecipe(["emerald"]);
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.durability += stats.durability >> 1;
        if(stats.level < MiningLv.DIAMOND){
            stats.level++;
        }
    }
    
}
