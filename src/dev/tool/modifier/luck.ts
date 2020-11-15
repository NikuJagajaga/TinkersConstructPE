class ModLuck extends TinkersModifier {

    constructor(){
        super("luck", "Luck", 1, [{id: VanillaItemID.dye, data: 4}], 360, false, ["silk"]);
    }

    applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.fortune = level < 60 ? 0 : level < 180 ? 1 : level < 360 ? 2 : 3;
    }
    
}