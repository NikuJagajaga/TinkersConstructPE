class PatternRegistry {

    private static data: {[id: number]: {type: string, cost: number}} = {};

    static registerData(id: number, type: string, cost: number): void {
        this.data[id] = {type: type, cost: cost};
    }

    static getData(id: number): {type: string, cost: number} {
        return this.data[id];
    }

    static isPattern(id: number): boolean {
        return id in this.data;
    }

    static getAllRecipeForRV(): {input: ItemInstance[], output: ItemInstance[]}[] {
        const list = [];
        let material: number;
        let pattern: string;
        for(let mat in Material){
            if(Material[mat].isMetal){
                continue;
            }
            material = Material[mat].getItem();
            for(pattern in this.data){
                list.push({
                    input: [{id: parseInt(pattern), count: 1, data: 0}, {id: material, count: this.data[pattern].cost, data: 0}],
                    output: [{id: PartRegistry.getIDFromData(this.data[pattern].type, mat), count: 1, data: 0}]
                });
            }
        }
        return list;
    }

}


createItem("tcon_pattern_blank", "Blank Pattern");
createItem("tcon_pattern_pickaxe", "Pickaxe Head Pattern");
createItem("tcon_pattern_shovel", "Shovel Head Pattern");
createItem("tcon_pattern_axe", "Axe Head Pattern");
createItem("tcon_pattern_broadaxe", "Broad Axe Head Pattern");
createItem("tcon_pattern_sword", "Sword Blade Head Pattern");
createItem("tcon_pattern_hammer", "Hammer Head Pattern");
createItem("tcon_pattern_excavator", "Excavator Head Pattern");
createItem("tcon_pattern_rod", "Tool Rod Pattern");
createItem("tcon_pattern_rod2", "Tough Tool Rod Pattern");
createItem("tcon_pattern_binding", "Binding Pattern");
createItem("tcon_pattern_binding2", "Tough Binding Pattern");
createItem("tcon_pattern_guard", "Wide Guard Pattern");
createItem("tcon_pattern_largeplate", "Large Plate Pattern");

Item.addCreativeGroup("tcon_pattern", "Pattern", [
    ItemID.tcon_pattern_blank,
    ItemID.tcon_pattern_pickaxe,
    ItemID.tcon_pattern_shovel,
    ItemID.tcon_pattern_axe,
    ItemID.tcon_pattern_broadaxe,
    ItemID.tcon_pattern_sword,
    ItemID.tcon_pattern_hammer,
    ItemID.tcon_pattern_excavator,
    ItemID.tcon_pattern_rod,
    ItemID.tcon_pattern_rod2,
    ItemID.tcon_pattern_binding,
    ItemID.tcon_pattern_binding2,
    ItemID.tcon_pattern_guard,
    ItemID.tcon_pattern_largeplate
]);

Recipes2.addShapedWith2x2({item: "item:tcon_pattern_blank", count: 4}, "ab:ba", {a: "planks", b: "stick"});
PatternRegistry.registerData(ItemID.tcon_pattern_pickaxe, "pickaxe", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_shovel, "shovel", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_axe, "axe", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_broadaxe, "broadaxe", 8);
PatternRegistry.registerData(ItemID.tcon_pattern_sword, "sword", 2);
PatternRegistry.registerData(ItemID.tcon_pattern_hammer, "hammer", 8);
PatternRegistry.registerData(ItemID.tcon_pattern_excavator, "excavator", 8);
PatternRegistry.registerData(ItemID.tcon_pattern_rod, "rod", 1);
PatternRegistry.registerData(ItemID.tcon_pattern_rod2, "rod2", 3);
PatternRegistry.registerData(ItemID.tcon_pattern_binding, "binding", 1);
PatternRegistry.registerData(ItemID.tcon_pattern_binding2, "binding2", 3);
PatternRegistry.registerData(ItemID.tcon_pattern_guard, "guard", 1);
PatternRegistry.registerData(ItemID.tcon_pattern_largeplate, "largeplate", 8);


createItem("tcon_claycast_pickaxe", "Pickaxe Head Clay Cast");
createItem("tcon_claycast_shovel", "Shovel Head Clay Cast");
createItem("tcon_claycast_axe", "Axe Head Clay Cast");
createItem("tcon_claycast_broadaxe", "Broad Axe Head Clay Cast");
createItem("tcon_claycast_sword", "Sword Blade Head Clay Cast");
createItem("tcon_claycast_hammer", "Hammer Head Clay Cast");
createItem("tcon_claycast_excavator", "Excavator Head Clay Cast");
createItem("tcon_claycast_rod", "Tool Rod Clay Cast");
createItem("tcon_claycast_rod2", "Tough Tool Rod Clay Cast");
createItem("tcon_claycast_binding", "Binding Clay Cast");
createItem("tcon_claycast_binding2", "Tough Binding Clay Cast");
createItem("tcon_claycast_guard", "Wide Guard Clay Cast");
createItem("tcon_claycast_largeplate", "Large Plate Clay Cast");

Item.addCreativeGroup("tcon_claycast", "Clay Cast", [
    ItemID.tcon_claycast_pickaxe,
    ItemID.tcon_claycast_shovel,
    ItemID.tcon_claycast_axe,
    ItemID.tcon_claycast_broadaxe,
    ItemID.tcon_claycast_sword,
    ItemID.tcon_claycast_hammer,
    ItemID.tcon_claycast_excavator,
    ItemID.tcon_claycast_rod,
    ItemID.tcon_claycast_rod2,
    ItemID.tcon_claycast_binding,
    ItemID.tcon_claycast_binding2,
    ItemID.tcon_claycast_guard,
    ItemID.tcon_claycast_largeplate
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


createItem("tcon_cast_pickaxe", "Pickaxe Head Cast");
createItem("tcon_cast_shovel", "Shovel Head Cast");
createItem("tcon_cast_axe", "Axe Head Cast");
createItem("tcon_cast_broadaxe", "Broad Axe Head Cast");
createItem("tcon_cast_sword", "Sword Blade Head Cast");
createItem("tcon_cast_hammer", "Hammer Head Cast");
createItem("tcon_cast_excavator", "Excavator Head Cast");
createItem("tcon_cast_rod", "Tool Rod Cast");
createItem("tcon_cast_rod2", "Tough Tool Rod Cast");
createItem("tcon_cast_binding", "Binding Cast");
createItem("tcon_cast_binding2", "Tough Binding Cast");
createItem("tcon_cast_guard", "Wide Guard Cast");
createItem("tcon_cast_largeplate", "Large Plate Cast");
createItem("tcon_cast_ingot", "Ingot Cast");
createItem("tcon_cast_nugget", "Nugget Cast");
createItem("tcon_cast_gem", "Gem Cast");
createItem("tcon_cast_plate", "Plate Cast");
createItem("tcon_cast_gear", "Gear Cast");

Item.addCreativeGroup("tcon_cast", "Cast", [
    ItemID.tcon_cast_pickaxe,
    ItemID.tcon_cast_shovel,
    ItemID.tcon_cast_axe,
    ItemID.tcon_cast_broadaxe,
    ItemID.tcon_cast_sword,
    ItemID.tcon_cast_hammer,
    ItemID.tcon_cast_excavator,
    ItemID.tcon_cast_rod,
    ItemID.tcon_cast_rod2,
    ItemID.tcon_cast_binding,
    ItemID.tcon_cast_binding2,
    ItemID.tcon_cast_guard,
    ItemID.tcon_cast_largeplate,
    ItemID.tcon_cast_ingot,
    ItemID.tcon_cast_nugget,
    ItemID.tcon_cast_gem,
    ItemID.tcon_cast_plate,
    ItemID.tcon_cast_gear
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