createItem("tcon_pattern_blank", "Pattern");
Recipes2.addShaped({id: ItemID.tcon_pattern_blank, count: 4}, "ab:ba", {a: "planks", b: "stick"});


Item.addCreativeGroup("tcon_sandcast", translate("TConstuct: Sand Cast"), [
    createItem("tcon_sandcast_blank", "Blank Sand Cast"),
    createItem("tcon_sandcast_pickaxe", "Pickaxe Head Sand Cast"),
    createItem("tcon_sandcast_shovel", "Shovel Head Sand Cast"),
    createItem("tcon_sandcast_axe", "Axe Head Sand Cast"),
    createItem("tcon_sandcast_broadaxe", "Broad Axe Head Sand Cast"),
    createItem("tcon_sandcast_sword", "Sword Blade Head Sand Cast"),
    createItem("tcon_sandcast_hammer", "Hammer Head Sand Cast"),
    createItem("tcon_sandcast_excavator", "Excavator Head Sand Cast"),
    createItem("tcon_sandcast_rod", "Tool Rod Sand Cast"),
    createItem("tcon_sandcast_rod2", "Tough Tool Rod Sand Cast"),
    createItem("tcon_sandcast_binding", "Binding Sand Cast"),
    createItem("tcon_sandcast_binding2", "Tough Binding Sand Cast"),
    createItem("tcon_sandcast_guard", "Wide Guard Sand Cast"),
    createItem("tcon_sandcast_largeplate", "Large Plate Sand Cast"),
    createItem("tcon_sandcast_ingot", "Ingot Sand Cast"),
    createItem("tcon_sandcast_nugget", "Nugget Sand Cast"),
    createItem("tcon_sandcast_gem", "Gem Sand Cast"),
    createItem("tcon_sandcast_plate", "Plate Sand Cast"),
    createItem("tcon_sandcast_gear", "Gear Sand Cast")
]);

Recipes2.addShapeless({id: ItemID.tcon_sandcast_blank, count: 4}, ["sand"]);

CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_pickaxe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_shovel, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_axe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_broadaxe, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_sword, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_hammer, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_excavator, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_rod, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_rod2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_binding, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_binding2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_guard, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_largeplate, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_ingot, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_nugget, MatValue.NUGGET);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_gem, MatValue.GEM);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_plate, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_sandcast_gear, MatValue.INGOT * 4);


Item.addCreativeGroup("tcon_claycast", translate("TConstuct: Clay Cast"), [
    createItem("tcon_claycast_pickaxe", "Pickaxe Head Clay Cast"),
    createItem("tcon_claycast_shovel", "Shovel Head Clay Cast"),
    createItem("tcon_claycast_axe", "Axe Head Clay Cast"),
    createItem("tcon_claycast_broadaxe", "Broad Axe Head Clay Cast"),
    createItem("tcon_claycast_sword", "Sword Blade Head Clay Cast"),
    createItem("tcon_claycast_hammer", "Hammer Head Clay Cast"),
    createItem("tcon_claycast_excavator", "Excavator Head Clay Cast"),
    createItem("tcon_claycast_rod", "Tool Rod Clay Cast"),
    createItem("tcon_claycast_rod2", "Tough Tool Rod Clay Cast"),
    createItem("tcon_claycast_binding", "Binding Clay Cast"),
    createItem("tcon_claycast_binding2", "Tough Binding Clay Cast"),
    createItem("tcon_claycast_guard", "Wide Guard Clay Cast"),
    createItem("tcon_claycast_largeplate", "Large Plate Clay Cast"),
    createItem("tcon_claycast_ingot", "Ingot Clay Cast"),
    createItem("tcon_claycast_nugget", "Nugget Clay Cast"),
    createItem("tcon_claycast_gem", "Gem Clay Cast"),
    createItem("tcon_claycast_plate", "Plate Clay Cast"),
    createItem("tcon_claycast_gear", "Gear Clay Cast")
]);

CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_pickaxe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_shovel, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_axe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_broadaxe, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_sword, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_hammer, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_excavator, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_rod, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_rod2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_binding, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_binding2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_guard, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_largeplate, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_ingot, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_nugget, MatValue.NUGGET);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_gem, MatValue.GEM);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_plate, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_claycast_gear, MatValue.INGOT * 4);


Item.addCreativeGroup("tcon_cast", translate("TConstuct: Cast"), [
    createItem("tcon_cast_pickaxe", "Pickaxe Head Cast"),
    createItem("tcon_cast_shovel", "Shovel Head Cast"),
    createItem("tcon_cast_axe", "Axe Head Cast"),
    createItem("tcon_cast_broadaxe", "Broad Axe Head Cast"),
    createItem("tcon_cast_sword", "Sword Blade Head Cast"),
    createItem("tcon_cast_hammer", "Hammer Head Cast"),
    createItem("tcon_cast_excavator", "Excavator Head Cast"),
    createItem("tcon_cast_rod", "Tool Rod Cast"),
    createItem("tcon_cast_rod2", "Tough Tool Rod Cast"),
    createItem("tcon_cast_binding", "Binding Cast"),
    createItem("tcon_cast_binding2", "Tough Binding Cast"),
    createItem("tcon_cast_guard", "Wide Guard Cast"),
    createItem("tcon_cast_largeplate", "Large Plate Cast"),
    createItem("tcon_cast_ingot", "Ingot Cast"),
    createItem("tcon_cast_nugget", "Nugget Cast"),
    createItem("tcon_cast_gem", "Gem Cast"),
    createItem("tcon_cast_plate", "Plate Cast"),
    createItem("tcon_cast_gear", "Gear Cast")
]);

CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_pickaxe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_shovel, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_axe, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_broadaxe, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_sword, MatValue.INGOT * 2);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_hammer, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_excavator, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_rod, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_rod2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_binding, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_binding2, MatValue.INGOT * 3);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_guard, MatValue.INGOT * 1);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_largeplate, MatValue.INGOT * 8);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_ingot, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_nugget, MatValue.NUGGET);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_gem, MatValue.GEM);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_plate, MatValue.INGOT);
CastingRecipe.setDefaultCapacity(ItemID.tcon_cast_gear, MatValue.INGOT * 4);

CastingRecipe.addMakeCastRecipes(VanillaItemID.iron_ingot, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.gold_ingot, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.brick, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.netherbrick, "ingot");
CastingRecipe.addMakeCastRecipes(VanillaItemID.iron_nugget, "nugget");
CastingRecipe.addMakeCastRecipes(VanillaItemID.gold_nugget, "nugget");
CastingRecipe.addMakeCastRecipes(VanillaItemID.emerald, "gem");
