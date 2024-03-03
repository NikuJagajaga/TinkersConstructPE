const TraitFractured = new class extends TconTrait {

    constructor(){
        super("fractured", "Fractured", "#ede6bf");
    }

    override applyStats(stats: ToolStats, level: number): void {
        stats.damage += 1.5;
    }

}
