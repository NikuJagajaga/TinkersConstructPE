const TraitSilk = new class extends TconTrait {

    constructor(){
        super("silk", "Silky", "#fbe28b");
    }
    
    override applyStats(stats: ToolStats, level: number): void {
        stats.efficiency = Math.max(1, stats.efficiency - 3);
        stats.damage = Math.max(1, stats.damage - 3);
    }

    override applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.silk = true;
    }

}
