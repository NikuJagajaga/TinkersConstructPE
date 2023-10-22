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
            hate.forEach(mod => {
                this.hate[mod] = true;
            });
        }
    }

    getKey(): string {
        return this.key;
    }

    getName(): string {
        return this.name;
    }

    getTexIndex(): number {
        return this.texIndex;
    }

    getRecipe(): {id: number, data: number}[] {
        return this.recipe;
    }

    canBeTogether(modifiers: {type: string, level: number}[]): boolean {
        for(let i = 0; i < modifiers.length; i++){
            if(this.hate[modifiers[i].type]){
                return false;
            }
        }
        return true;
    }

    applyStats(stats: ToolStats, level: number): void {

    }

    applyEnchant(enchant: ToolAPI.EnchantData, level: number): void {
        
    }

    onDestroy(item: ItemInstance, coords: Callback.ItemUseCoordinates, block: Tile, level: number): void {

    }

    onAttack(item: ItemInstance, victim: number, level: number): number {
        return 0;
    }

    onDealDamage(victim: number, damageValue: number, damageType: number, level: number): void {

    }
    
    onKillEntity(entity: number, damageType: number, level: number): void {

    }

    onConsume(level: number): boolean {
        return false;
    }

    onMending(level: number): number {
        return 0;
    }

}


class TinkersModifierHandler {

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
        const mods = {}
        new String(code).split("_").filter(s => s).map(s => s.split(":")).forEach(data => {
            const num = parseInt(data[1]);
            if(data[0] in Modifier){
                mods[data[0]] = data[0] in mods ? mods[data[0]] + num : num;
            }
        });
        return mods;
    }

}