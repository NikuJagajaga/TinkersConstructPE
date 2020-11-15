class ModHaste extends TinkersModifier {

    private step1: number = 15;
    private step2: number = 25;

    constructor(){
        super("haste", "Haste", 0, [VanillaItemID.redstone], 50, true);
    }

    applyStats(stats: ToolStats, level: number): void {
        for(let i = level; i--;){
            stats.speed += stats.speed <= this.step1 ? 0.15 - 0.05 * stats.speed / this.step1 : stats.speed <= this.step2 ? 0.1 - 0.05 * (stats.speed - this.step1) / (this.step2 - this.step1) : 0.05;
        }
        stats.speed += (level / this.max | 0) * 0.5;
    }
    
}