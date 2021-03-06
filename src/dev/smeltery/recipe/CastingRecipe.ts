interface ICastingRecipe {id: number, data: number, consume: boolean, amount: number};

class CastingRecipe {

    private static table: {[id: number]: {[liquid: string]: ICastingRecipe}} = {};
    private static basin: {[id: number]: {[liquid: string]: ICastingRecipe}} = {};
    private static capacity: {[id: string]: number} = {};

    private static addRecipe(type: "table" | "basin", id: number, liquid: string, result: Tile | number, consume: boolean, amount: number): void {
        let resultID: number;
        let resultData: number;
        if(typeof result === "number"){
            resultID = result;
            resultData = 0;
        }
        else {
            resultID = result.id;
            resultData = result.data;
        }
        this[type][id] = this[type][id] || {};
        this[type][id][liquid] = {id: resultID, data: resultData, consume: consume, amount: amount};
    }

    private static getLimits(type: "table" | "basin", id: number): {[liquid: string]: number} {
        const limits: {[liquid: string]: number} = {};
        if(this[type][id] && typeof this[type][id] === "object"){
            if(this.capacity[id]){
                limits.__global = this.capacity[id];
            }
            for(let key in this[type][id]){
                if(this[type][id][key].amount){
                    limits[key] = this[type][id][key].amount;
                }
            }
        }
        return limits;
    }

    private static getClayCastID(type: string): number {
        return ItemID["tcon_claycast_" + type];
    }

    private static getCastID(type: string): number {
        return ItemID["tcon_cast_" + type];
    }

    static addTableRecipe(id: number, liquid: string, result: Tile | number, consume: boolean, amount?: number): void {
        this.addRecipe("table", id, liquid, result, consume, amount);
    }

    static addTableRecipeForBoth(type: string, liquid: string, result: Tile | number, amount?: number): void {
        this.addTableRecipe(this.getClayCastID(type), liquid, result, true, amount);
        this.addTableRecipe(this.getCastID(type), liquid, result, false, amount);
    }

    static addMakeCastRecipes(id: number, type: string): void {
        const claycast = this.getClayCastID(type);
        const cast = this.getCastID(type);
        if(claycast){
            this.addTableRecipe(id, "molten_clay", claycast, true, MatValue.INGOT * 2);
        }
        if(cast){
            this.addTableRecipe(id, "molten_gold", cast, true, MatValue.INGOT * 2);
            this.addTableRecipe(id, "molten_alubrass", cast, true, MatValue.INGOT);
        }
    }

    static addBasinRecipe(id: number, liquid: string, result: Tile | number, amount: number = MatValue.BLOCK): void {
        this.addRecipe("basin", id, liquid, result, id !== 0, amount);
    }

    static getTableRecipe(id: number, liquid: string): ICastingRecipe {
        return this.table[id] ? this.table[id][liquid] : undefined;
    }

    static getBasinRecipe(id: number, liquid: string): ICastingRecipe {
        return this.basin[id] ? this.basin[id][liquid] : undefined;
    }

    static getAllRecipeForRV(type: "table" | "basin"): RecipePattern[] {
        const list: RecipePattern[] = [];
        let key: string;
        let liquid: string;
        let id: number;
        let limits: {[liq: string]: number};
        let result: ICastingRecipe;
        for(key in this[type]){
            id = parseInt(key);
            limits = this.getLimits(type, id);
            for(liquid in this[type][id]){
                result = this[type][id][liquid];
                list.push({
                    input: [{id: id, count: 1, data: 0}],
                    output: [{id: result.id, count: 1, data: result.data}],
                    inputLiq: [{liquid: liquid, amount: limits[liquid] || limits.__global}],
                    consume: result.consume
                });
            }
        }
        return list;
    }

    static setDefaultCapacity(id: number, capacity: number): void {
        this.capacity[id] = capacity;
    }

    static getTableLimits(id): {[liquid: string]: number} {
        return this.getLimits("table", id);
    }

    static getBasinLimits(id): {[liquid: string]: number} {
        return this.getLimits("basin", id);
    }

    static isValidLiquidForTable(id: number, liquid: string): boolean {
        if(id in this.table){
            return liquid in this.table[id];
        }
        return false;
    }

    static isValidLiquidForBasin(id: number, liquid: string): boolean {
        if(id in this.basin){
            return liquid in this.basin[id];
        }
        return false;
    }

    static calcCooldownTime(liquid: string, amount: number): number {
        return 24 + MoltenLiquid.getTemp(liquid) * amount / 1600;
    }

}


CastingRecipe.addTableRecipe(0, "molten_glass", VanillaBlockID.glass_pane, false, MatValue.GLASS * 6 / 16);
CastingRecipe.addBasinRecipe(0, "molten_iron", VanillaBlockID.iron_block);
CastingRecipe.addBasinRecipe(0, "molten_gold", VanillaBlockID.gold_block);
CastingRecipe.addBasinRecipe(0, "molten_obsidian", VanillaBlockID.obsidian, 288);
CastingRecipe.addTableRecipeForBoth("ingot", "molten_iron", VanillaItemID.iron_ingot);
CastingRecipe.addTableRecipeForBoth("ingot", "molten_gold", VanillaItemID.gold_ingot);
CastingRecipe.addTableRecipeForBoth("ingot", "molten_clay", VanillaItemID.brick);
CastingRecipe.addTableRecipeForBoth("nugget", "molten_iron", VanillaItemID.iron_nugget);
CastingRecipe.addTableRecipeForBoth("nugget", "molten_gold", VanillaItemID.gold_nugget);
CastingRecipe.addTableRecipeForBoth("gem", "molten_emerald", VanillaItemID.emerald);
CastingRecipe.addBasinRecipe(0, "molten_emerald", VanillaBlockID.emerald_block, MatValue.GEM * 9);
CastingRecipe.addBasinRecipe(0, "molten_clay", VanillaBlockID.hardened_clay, MatValue.INGOT * 4);
CastingRecipe.addBasinRecipe(VanillaBlockID.stained_hardened_clay, "water", VanillaBlockID.hardened_clay, 250);
CastingRecipe.addBasinRecipe(VanillaBlockID.sand, "blood", {id: VanillaBlockID.sand, data: 1}, 10);


CastingRecipe.setDefaultCapacity(VanillaItemID.bucket, 1000);

Callback.addCallback("PreLoaded", () => {
    let empty: {id: number, data: number, liquid: string};
    let full: number[];
    for(let key in LiquidRegistry.EmptyByFull){
        empty = LiquidRegistry.EmptyByFull[key];
        if(empty.id === VanillaItemID.bucket && empty.data === 0){
            full = key.split(":").map(v => parseInt(v));
            CastingRecipe.addTableRecipe(VanillaItemID.bucket, empty.liquid, {id: full[0], data: full[1] === -1 ? 0 : full[1]}, true);
        }
    }
});