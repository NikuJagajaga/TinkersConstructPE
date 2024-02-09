class ModLuck extends TinkersModifier {

    constructor(){
        super("luck", "Luck", 360, false);
        this.texIndex = 1;
        this.setRecipe(["lapis_lazuli"]);
        this.addConflict("silk");
    }

    override applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.fortune = level < 60 ? 0 : level < 180 ? 1 : level < 360 ? 2 : 3;
    }
    
}
