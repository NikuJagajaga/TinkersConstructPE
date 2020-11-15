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
        if(this[type][id]){
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
        this.addRecipe("basin", id, liquid, result, true, amount);
    }

    static getTableRecipe(id: number, liquid: string): ICastingRecipe {
        return this.table[id] ? this.table[id][liquid] : undefined;
    }

    static getBasinRecipe(id: number, liquid: string): ICastingRecipe {
        return this.basin[id] ? this.basin[id][liquid] : undefined;
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
        return liquid in this.table[id];
    }

    static isValidLiquidForBasin(id: number, liquid: string): boolean {
        return liquid in this.basin[id];
    }

    static calcCooldownTime(liquid: string, amount: number): number {
        return 24 + MoltenLiquid.getTemp(liquid) * amount / 1600;
    }

}