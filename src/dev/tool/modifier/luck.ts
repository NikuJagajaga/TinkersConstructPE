class ModLuck extends TinkersModifier {

    constructor(){
        super("luck", "Luck", 1, ["lapis_lazuli"], 360, false, ["silk"]);
    }

    override applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.fortune = level < 60 ? 0 : level < 180 ? 1 : level < 360 ? 2 : 3;
    }
    
}