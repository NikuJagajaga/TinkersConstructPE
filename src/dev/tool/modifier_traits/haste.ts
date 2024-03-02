class TraitHaste extends TconTrait {

    private static readonly step1 = 15;
    private static readonly step2 = 25;

    constructor(parent: TconModifier){
        super("haste", "Haste", parent);
    }

    override applyStats(stats: ToolStats, level: number): void {
        for(let i = 0; i < level; i++){
            if(stats.efficiency <= TraitHaste.step1){
                stats.efficiency += 0.15 - 0.05 * stats.efficiency / TraitHaste.step1;
            }
            else if(stats.efficiency <= TraitHaste.step2){
                stats.efficiency += 0.1 - 0.05 * (stats.efficiency - TraitHaste.step1) / (TraitHaste.step2 - TraitHaste.step1);
            }
            else{
                stats.efficiency += 0.05;
            }
        }
        stats.efficiency += (level / this.parent.maxLevel | 0) * 0.5;
    }
    
}
