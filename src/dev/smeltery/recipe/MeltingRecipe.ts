interface IMeltingRecipe extends LiquidInstance {
    temp: number;
}

class MeltingRecipe {

    private static readonly LOG9_2 = Math.LN2 / Math.log(9);

    private static recipeItem: {[key: string]: IMeltingRecipe} = {};
    private static recipeEnt: {[key: number]: LiquidInstance} = {};

    private static calcTemp(liquid: string, amount: number): number {
        return (amount / MatValue.BLOCK) ** this.LOG9_2 * MoltenLiquid.getTemp(liquid) | 0;
    }

    static addRecipe(item: number | Tile, liquid: string, amount: number, temp: number = this.calcTemp(liquid, amount)): void {
        this.recipeItem[typeof item === "number" ? item : item.id + ":" + item.data] = {
            liquid: liquid,
            amount: amount,
            temp: temp
        };
    }

    static addRecipeForAmount(item: number | Tile, liquid: string, amount: number, timeAmount: number): void {
        this.addRecipe(item, liquid, amount, this.calcTemp(liquid, timeAmount));
    }

    static getRecipe(id: number, data: number): IMeltingRecipe {
        return this.recipeItem[id + ":" + data] || this.recipeItem[id];
    }

    static isExist(id: number, data: number): boolean {
        return (id + ":" + data) in this.recipeItem || id in this.recipeItem || false;
    }

    static getAllRecipeForRV(): {input: ItemInstance[], output: ItemInstance[], outputLiq: LiquidInstance, temp: number}[] {
        const list = [];
        let split: string[];
        for(let key in this.recipeItem){
            split = key.split(":");
            list.push({
                input: [{id: parseInt(split[0]), count: 1, data: split[1] ? parseInt(split[1]) : 0}],
                output: [],
                outputLiq: {liquid: this.recipeItem[key].liquid, amount: this.recipeItem[key].amount},
                temp: this.recipeItem[key].temp
            });
        }
        return list;
    }

    static addEntRecipe(entityType: number, liquid: string, amount: number): void {
        this.recipeEnt[entityType] = {liquid: liquid, amount: amount};
    }

    static getEntRecipe(ent: number): LiquidInstance {
        const entityType = Entity.getType(ent);
        return this.recipeEnt[entityType];
    }

}


MeltingRecipe.addRecipe(VanillaBlockID.ice, "water", 1000, 305 - 300);
MeltingRecipe.addRecipe(VanillaBlockID.packed_ice, "water", 2000, 310 - 300);
MeltingRecipe.addRecipe(VanillaBlockID.snow, "water", 1000, 305 - 300);
MeltingRecipe.addRecipe(VanillaItemID.snowball, "water", 125, 301 - 300);

MeltingRecipe.addRecipe(VanillaItemID.rotten_flesh, "blood", 40);

MeltingRecipe.addRecipeForAmount(VanillaBlockID.stone, "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);
MeltingRecipe.addRecipeForAmount(VanillaBlockID.cobblestone, "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);

MeltingRecipe.addRecipe(VanillaBlockID.obsidian, "molten_obsidian", MatValue.ORE);

MeltingRecipe.addRecipe(VanillaItemID.horsearmoriron, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.horsearmorgold, "molten_gold", MatValue.INGOT * 2);

MeltingRecipe.addRecipe(VanillaBlockID.rail, "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe(VanillaBlockID.activator_rail, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.detector_rail, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.golden_rail, "molten_gold", MatValue.INGOT);

MeltingRecipe.addRecipeForAmount(VanillaBlockID.dirt, "molten_dirt", MatValue.INGOT, MatValue.BRICK_BLOCK);

MeltingRecipe.addRecipe(VanillaItemID.clay_ball, "molten_clay", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.clay, "molten_clay", MatValue.BRICK_BLOCK);

MeltingRecipe.addRecipe(VanillaBlockID.emerald_ore, "molten_emerald", MatValue.GEM * Cfg.oreToIngotRatio);
MeltingRecipe.addRecipe(VanillaItemID.emerald, "molten_emerald", MatValue.GEM);
MeltingRecipe.addRecipe(VanillaBlockID.emerald_block, "molten_emerald", MatValue.GEM * 9);

MeltingRecipe.addRecipe(VanillaBlockID.sand, "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe(VanillaBlockID.glass, "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe(VanillaBlockID.glass_pane, "molten_glass", MatValue.GLASS * 6 / 16);
MeltingRecipe.addRecipe(VanillaItemID.glass_bottle, "molten_glass", MatValue.GLASS);

MeltingRecipe.addRecipe(VanillaItemID.iron_nugget, "molten_iron", MatValue.NUGGET);
MeltingRecipe.addRecipe(VanillaItemID.iron_ingot, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.iron_block, "molten_iron", MatValue.BLOCK);
MeltingRecipe.addRecipe(VanillaItemID.gold_nugget, "molten_gold", MatValue.NUGGET);
MeltingRecipe.addRecipe(VanillaItemID.gold_ingot, "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.gold_block, "molten_gold", MatValue.BLOCK);

MeltingRecipe.addRecipe(VanillaBlockID.heavy_weighted_pressure_plate, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaBlockID.light_weighted_pressure_plate, "molten_gold", MatValue.INGOT * 2);

MeltingRecipe.addRecipe(VanillaItemID.compass, "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaItemID.clock, "molten_gold", MatValue.INGOT * 4);

MeltingRecipe.addRecipe(VanillaItemID.golden_helmet, "molten_gold", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaItemID.golden_chestplate, "molten_gold", MatValue.INGOT * 8);
MeltingRecipe.addRecipe(VanillaItemID.golden_leggings, "molten_gold", MatValue.INGOT * 7);
MeltingRecipe.addRecipe(VanillaItemID.golden_boots, "molten_gold", MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaItemID.golden_pickaxe, "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.golden_axe, "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.golden_sword, "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.golden_shovel, "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaItemID.golden_hoe, "molten_gold", MatValue.INGOT * 2);

MeltingRecipe.addRecipe(VanillaItemID.iron_helmet, "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaItemID.iron_chestplate, "molten_iron", MatValue.INGOT * 8);
MeltingRecipe.addRecipe(VanillaItemID.iron_leggings, "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe(VanillaItemID.iron_boots, "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe(VanillaItemID.iron_pickaxe, "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.iron_axe, "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe(VanillaItemID.iron_sword, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.iron_shovel, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaItemID.iron_hoe, "molten_iron", MatValue.INGOT * 2);

MeltingRecipe.addRecipe(VanillaItemID.bucket, "molten_iron", MatValue.INGOT * 3);

MeltingRecipe.addRecipe(VanillaBlockID.hopper, "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaBlockID.iron_bars, "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe(VanillaItemID.minecart, "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe(VanillaItemID.shears, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaItemID.shield, "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe(VanillaBlockID.tripwire_hook, "molten_iron", MatValue.INGOT / 2);
MeltingRecipe.addRecipe(VanillaBlockID.iron_door, "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe(VanillaBlockID.cauldron, "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe(VanillaBlockID.anvil, "molten_iron", MatValue.BLOCK * 3 + MatValue.INGOT * 4);

MeltingRecipe.addRecipe(VanillaBlockID.iron_ore, "molten_iron", MatValue.ORE);
MeltingRecipe.addRecipe(VanillaBlockID.gold_ore, "molten_gold", MatValue.ORE);


MeltingRecipe.addEntRecipe(1, "blood", 20);//Native.EntityType.PLAYER
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE_VILLAGER, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE_VILLAGE_V2, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.PIG_ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.ZOMBIE_HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.COW, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.PIG, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.SHEEP, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.CHICKEN, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.WOLF, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.CAT, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.RABBIT, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.LLAMA, "blood", 20);
MeltingRecipe.addEntRecipe(Native.EntityType.IRON_GOLEM, "molten_iron", 18);
MeltingRecipe.addEntRecipe(Native.EntityType.SNOW_GOLEM, "water", 100);
MeltingRecipe.addEntRecipe(Native.EntityType.VILLAGER, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(Native.EntityType.VILLAGER_V2, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(Native.EntityType.VINDICATOR, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(Native.EntityType.EVOCATION_ILLAGER, "molten_emerald", 6);
//MeltingRecipe.addEntRecipe(Native.EntityType.ILLUSIONER, "molten_emerald", 6);