createItem("tcon_silky_cloth", "Silky Cloth");
createItem("tcon_silky_jewel", "Silky Jewel");
Recipes2.addShaped(ItemID.tcon_silky_cloth, "aaa:aba:aaa", {a:"string", b: "gold_ingot"});
Recipes2.addShaped(ItemID.tcon_silky_jewel, "_a_:aba:_a_", {a: ItemID.tcon_silky_cloth, b: "emerald"});
MeltingRecipe.addRecipe(ItemID.tcon_silky_cloth, "molten_gold", MatValue.INGOT);


class ModSilk extends TinkersModifier {

    constructor(){
        super("silk", "Silky", 1, false);
        this.texIndex = 5;
        this.setRecipe([ItemID.tcon_silky_jewel]);
        this.addConflict("luck");
    }
    
    override applyStats(stats: ToolStats, level: number): void {
        stats.efficiency = Math.max(1, stats.efficiency - 3);
        stats.damage = Math.max(1, stats.damage - 3);
    }

    override applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.silk = true;
    }

}
