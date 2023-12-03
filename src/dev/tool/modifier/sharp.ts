class ModSharp extends TinkersModifier {

    constructor(){
        super("sharp", "Sharper", 2, ["quartz"], 72, true);
    }

    override applyStats(stats: ToolStats, level: number): void {
        for(let i = level; i--;) {
            stats.attack += stats.attack <= 10 ? 0.05 - 0.025 * stats.attack / 10 : stats.attack <= 20 ? 0.025 - 0.01 * stats.attack / 20 : 0.015;
        }
        stats.attack += (level / this.max | 0) * 0.25;
    }
    
}