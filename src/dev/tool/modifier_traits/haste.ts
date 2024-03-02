const TraitHaste = new class extends TconTrait {

    constructor(){
        super("haste", "Haste", "#910000");
    }

    override applyStats(stats: ToolStats, level: number): void {
        const step1 = 15;
        const step2 = 25;
        for(let i = 0; i < level; i++){
            if(stats.efficiency <= step1){
                stats.efficiency += 0.15 - 0.05 * stats.efficiency / step1;
            }
            else if(stats.efficiency <= step2){
                stats.efficiency += 0.1 - 0.05 * (stats.efficiency - step1) / (step2 - step1);
            }
            else{
                stats.efficiency += 0.05;
            }
        }
        stats.efficiency += (level / this.parent.maxLevel | 0) * 0.5;
    }
    
}
