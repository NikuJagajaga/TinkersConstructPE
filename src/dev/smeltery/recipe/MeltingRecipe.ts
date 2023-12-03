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

    static addRecipe(source: AnyID, liquid: string, amount: number, temp: number = this.calcTemp(liquid, amount)): void {
        if(!source){
            return;
        }
        const item = getIDData(source);
        this.recipeItem[item.id + ":" + item.data] = {
            liquid: liquid,
            amount: amount,
            temp: temp
        };
    }

    static addRecipeForAmount(item: AnyID, liquid: string, amount: number, timeAmount: number): void {
        this.addRecipe(item, liquid, amount, this.calcTemp(liquid, timeAmount));
    }

    static getRecipe(id: number, data: number): IMeltingRecipe {
        return this.recipeItem[id + ":" + data] || this.recipeItem[id + ":-1"];
    }

    static isExist(id: number, data: number): boolean {
        return (id + ":" + data) in this.recipeItem || (id + ":-1") in this.recipeItem || false;
    }

    static getAllRecipeForRV(): RecipePattern[] {
        const list: RecipePattern[] = [];
        let split: string[];
        for(let key in this.recipeItem){
            split = key.split(":");
            list.push({
                input: [{id: parseInt(split[0]), count: 1, data: parseInt(split[1])}],
                output: [],
                outputLiq: [{liquid: this.recipeItem[key].liquid, amount: this.recipeItem[key].amount}],
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


MeltingRecipe.addRecipe("ice", "water", 1000, 305 - 300);
MeltingRecipe.addRecipe("packed_ice", "water", 2000, 310 - 300);
MeltingRecipe.addRecipe("snow", "water", 1000, 305 - 300);
MeltingRecipe.addRecipe("snowball", "water", 125, 301 - 300);

MeltingRecipe.addRecipe("rotten_flesh", "blood", 40);

MeltingRecipe.addRecipeForAmount("stone", "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);
MeltingRecipe.addRecipeForAmount("cobblestone", "molten_stone", MatValue.SEARED_MATERIAL, MatValue.ORE);

MeltingRecipe.addRecipe("obsidian", "molten_obsidian", MatValue.ORE);

MeltingRecipe.addRecipe("horsearmoriron", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("horsearmorgold", "molten_gold", MatValue.INGOT * 2);

MeltingRecipe.addRecipe("rail", "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe("activator_rail", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("detector_rail", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("golden_rail", "molten_gold", MatValue.INGOT);

MeltingRecipe.addRecipeForAmount("dirt", "molten_dirt", MatValue.INGOT, MatValue.BRICK_BLOCK);

MeltingRecipe.addRecipe("clay_ball", "molten_clay", MatValue.INGOT);
MeltingRecipe.addRecipe("clay", "molten_clay", MatValue.BRICK_BLOCK);

MeltingRecipe.addRecipe("emerald_ore", "molten_emerald", MatValue.GEM * Cfg.oreToIngotRatio);
MeltingRecipe.addRecipe("emerald", "molten_emerald", MatValue.GEM);
MeltingRecipe.addRecipe("emerald_block", "molten_emerald", MatValue.GEM * 9);

MeltingRecipe.addRecipe("sand", "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe("glass", "molten_glass", MatValue.GLASS);
MeltingRecipe.addRecipe("glass_pane", "molten_glass", MatValue.GLASS * 6 / 16);
MeltingRecipe.addRecipe("glass_bottle", "molten_glass", MatValue.GLASS);

MeltingRecipe.addRecipe("iron_nugget", "molten_iron", MatValue.NUGGET);
MeltingRecipe.addRecipe("iron_ingot", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("iron_block", "molten_iron", MatValue.BLOCK);
MeltingRecipe.addRecipe("gold_nugget", "molten_gold", MatValue.NUGGET);
MeltingRecipe.addRecipe("gold_ingot", "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe("gold_block", "molten_gold", MatValue.BLOCK);

MeltingRecipe.addRecipe("heavy_weighted_pressure_plate", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("light_weighted_pressure_plate", "molten_gold", MatValue.INGOT * 2);

MeltingRecipe.addRecipe("compass", "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe("clock", "molten_gold", MatValue.INGOT * 4);

MeltingRecipe.addRecipe("golden_helmet", "molten_gold", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("golden_chestplate", "molten_gold", MatValue.INGOT * 8);
MeltingRecipe.addRecipe("golden_leggings", "molten_gold", MatValue.INGOT * 7);
MeltingRecipe.addRecipe("golden_boots", "molten_gold", MatValue.INGOT * 4);
MeltingRecipe.addRecipe("golden_pickaxe", "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("golden_axe", "molten_gold", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("golden_sword", "molten_gold", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("golden_shovel", "molten_gold", MatValue.INGOT);
MeltingRecipe.addRecipe("golden_hoe", "molten_gold", MatValue.INGOT * 2);

MeltingRecipe.addRecipe("iron_helmet", "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("iron_chestplate", "molten_iron", MatValue.INGOT * 8);
MeltingRecipe.addRecipe("iron_leggings", "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe("iron_boots", "molten_iron", MatValue.INGOT * 4);
MeltingRecipe.addRecipe("iron_pickaxe", "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("iron_axe", "molten_iron", MatValue.INGOT * 3);
MeltingRecipe.addRecipe("iron_sword", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("iron_shovel", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("iron_hoe", "molten_iron", MatValue.INGOT * 2);

MeltingRecipe.addRecipe("bucket", "molten_iron", MatValue.INGOT * 3);

MeltingRecipe.addRecipe("hopper", "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("iron_bars", "molten_iron", MatValue.INGOT * 6 / 16);
MeltingRecipe.addRecipe("minecart", "molten_iron", MatValue.INGOT * 5);
MeltingRecipe.addRecipe("shears", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("shield", "molten_iron", MatValue.INGOT);
MeltingRecipe.addRecipe("tripwire_hook", "molten_iron", MatValue.INGOT / 2);
MeltingRecipe.addRecipe("iron_door", "molten_iron", MatValue.INGOT * 2);
MeltingRecipe.addRecipe("cauldron", "molten_iron", MatValue.INGOT * 7);
MeltingRecipe.addRecipe("anvil", "molten_iron", MatValue.BLOCK * 3 + MatValue.INGOT * 4);

MeltingRecipe.addRecipe("iron_ore", "molten_iron", MatValue.ORE);
MeltingRecipe.addRecipe("gold_ore", "molten_gold", MatValue.ORE);


MeltingRecipe.addEntRecipe(1, "blood", 20); //PLAYER
MeltingRecipe.addEntRecipe(63, "blood", 20); //PLAYER
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE_VILLAGER, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE_VILLAGE_V2, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.PIG_ZOMBIE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.ZOMBIE_HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.COW, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.PIG, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.SHEEP, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.CHICKEN, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.WOLF, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.CAT, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.RABBIT, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.HORSE, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.LLAMA, "blood", 20);
MeltingRecipe.addEntRecipe(EEntityType.IRON_GOLEM, "molten_iron", 18);
MeltingRecipe.addEntRecipe(EEntityType.SNOW_GOLEM, "water", 100);
MeltingRecipe.addEntRecipe(EEntityType.VILLAGER, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(EEntityType.VILLAGER_V2, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(EEntityType.VINDICATOR, "molten_emerald", 6);
MeltingRecipe.addEntRecipe(EEntityType.EVOCATION_ILLAGER, "molten_emerald", 6);
//MeltingRecipe.addEntRecipe(EEntityType.ILLUSIONER, "molten_emerald", 6);