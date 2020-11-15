createItem("tcon_silky_cloth", "Silky Cloth");
createItem("tcon_silky_jewel", "Silky Jewel");
Recipes2.addShaped(ItemID.tcon_silky_cloth, "aaa:aba:aaa", {a: VanillaItemID.string, b: VanillaItemID.gold_ingot});
Recipes2.addShaped(ItemID.tcon_silky_jewel, "_a_:aba:_a_", {a: ItemID.tcon_silky_cloth, b: VanillaItemID.emerald});
MeltingRecipe.addRecipe(ItemID.tcon_silky_cloth, "molten_gold", MatValue.INGOT);


class ModSilk extends TinkersModifier {

    constructor(){
        super("silk", "SilkTouch", 5, [ItemID.tcon_silky_jewel], 1, false, ["luck"]);
    }
    
    applyStats(stats: ToolStats, level: number): void {
        stats.speed -= 3;
        stats.attack -= 3;
    }

    applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        enchant.silk = true;
    }

}