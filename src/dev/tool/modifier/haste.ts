class ModHaste extends TinkersModifier {

    private static readonly step1 = 15;
    private static readonly step2 = 25;

    constructor(){
        super("haste", "Haste", 0, ["redstone"], 50, true);
    }

    override applyStats(stats: ToolStats, level: number): void {
        for(let i = level; i--;){
            stats.speed += stats.speed <= ModHaste.step1 ? 0.15 - 0.05 * stats.speed / ModHaste.step1 : stats.speed <= ModHaste.step2 ? 0.1 - 0.05 * (stats.speed - ModHaste.step1) / (ModHaste.step2 - ModHaste.step1) : 0.05;
        }
        stats.speed += (level / this.max | 0) * 0.5;
    }
    
}