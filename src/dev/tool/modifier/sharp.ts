class ModSharp extends TinkersModifier {

    constructor(){
        super("sharp", "Sharper", 2, ["quartz"], 72, true);
    }

    override applyStats(stats: ToolStats, level: number): void {
        for(let i = 0; i < level; i++){
            if(stats.damage <= 10){
                stats.damage += 0.05 - 0.025 * stats.damage / 10;
            }
            else if(stats.damage <= 20){
                stats.damage += 0.025 - 0.01 * stats.damage / 20;
            }
            else{
                stats.damage += 0.015;
            }
        }
        stats.damage += (level / this.max | 0) * 0.25;
    }
    
}
