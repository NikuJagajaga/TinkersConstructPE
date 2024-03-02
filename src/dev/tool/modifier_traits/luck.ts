const TraitLuck = new class extends TconTrait {

    constructor(){
        super("luck", "Luck", "#2d51e2");
    }

    private getLuckLevel(level: number): number {
        return level < 60 ? 0 : level < 180 ? 1 : level < 360 ? 2 : 3;
    }

    override getLocalizedName(level: number): string {
        const roman = toRoman(this.getLuckLevel(level));
        return translate(this.name) + " " + roman;
    }

    override applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.fortune = this.getLuckLevel(level);
    }
    
}
