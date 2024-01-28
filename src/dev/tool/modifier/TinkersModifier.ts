abstract class TinkersModifier {

    private recipe: {id: number, data: number}[];
    private hate: {[key: string]: true};

    constructor(private key: string, private name: string, private texIndex: number, recipe: (Tile | number | Recipes2.VanillaID)[], public max: number, multi: boolean, hate?: string[]){
        this.recipe = recipe.map(item => getIDData(item));
        this.hate = {};
        if(!multi){
            this.hate[key] = true;
        }
        if(hate){
            for(let mod of hate){
                this.hate[mod] = true;
            }
        }
    }

    getKey(): string {
        return this.key;
    }

    getName(): string {
        return this.name;
    }

    getLocalizedName(): string {
        return translate(this.getName());
    }

    getTexIndex(): number {
        return this.texIndex;
    }

    getRecipe(): Tile[] {
        return this.recipe;
    }

    canBeTogether(modifiers: {type: string, level: number}[]): boolean {
        for(let mod of modifiers){
            if(this.hate[mod.type]){
                return false;
            }
        }
        return true;
    }

    applyStats(stats: ToolStats, level: number): void {

    }

    applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        
    }

    onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, player: number, level: number): void {

    }

    onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return 0;
    }

    onDealDamage(victim: number, player: number, damageValue: number, damageType: number, level: number): void {

    }
    
    onKillEntity(victim: number, player: number, damageType: number, level: number): void {

    }

    onConsume(level: number): boolean {
        return false;
    }

    onMending(level: number): number {
        return 0;
    }

}


class TinkersModifierHandler {

    //haste:50_silk:1
    static encodeToString(array: {type: string, level: number}[]): string {
        return array.map(mod => mod.type + ":" + mod.level).join("_");
    }

    static decodeToArray(code: string): {type: string, level: number}[] {
        return new String(code).split("_").filter(s => s).map(s => {
            const split = s.split(":");
            return {type: split[0], level: parseInt(split[1])};
        });
    }

    static decodeToObj(code: string): {[key: string]: number} {
        const mods: {[key: string]: number} = {};
        for(let mod of this.decodeToArray(code)){
            mods[mod.type] ??= 0;
            mods[mod.type] += mod.level;
        }
        return mods;
    }

}