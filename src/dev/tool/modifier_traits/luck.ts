class TraitLuck extends TconTrait {

    constructor(parent: TconModifier){
        super("luck", "Luck", parent);
    }

    override applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.fortune = level < 60 ? 0 : level < 180 ? 1 : level < 360 ? 2 : 3;
    }
    
}
