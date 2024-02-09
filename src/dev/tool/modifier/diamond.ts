class ModDiamond extends TinkersModifier {

    constructor(){
        super("diamond", "Diamond", 1, false);
        this.texIndex = 3;
        this.setRecipe(["diamond"]);
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
