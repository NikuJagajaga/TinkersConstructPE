class ModHaste extends TinkersModifier {

    private static readonly step1 = 15;
    private static readonly step2 = 25;

    constructor(){
        super("haste", "Haste", 50, true);
        this.texIndex = 0;
        this.setRecipe(["redstone"]);
    }

    override applyStats(stats: ToolStats, level: number): void {
        for(let i = 0; i < level; i++){
            if(stats.efficiency <= ModHaste.step1){
                stats.efficiency += 0.15 - 0.05 * stats.efficiency / ModHaste.step1;
            }
            else if(stats.efficiency <= ModHaste.step2){
                stats.efficiency += 0.1 - 0.05 * (stats.efficiency - ModHaste.step1) / (ModHaste.step2 - ModHaste.step1);
            }
            else{
                stats.efficiency += 0.05;
            }
        }
        stats.efficiency += (level / this.max | 0) * 0.5;
    }
    
}
