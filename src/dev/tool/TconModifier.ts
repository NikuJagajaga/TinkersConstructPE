class TconModifier {

    readonly trait: TconTrait;
    readonly maxLevel: number;
    private texIndex = -1;
    private consumeSlots = 1;
    private recipe: Tile[];
    private hate: {[key: string]: true} = {};

    constructor(trait: TconTrait, maxLevel: number){
        this.trait = trait;
        this.trait.setParent(this);
        this.maxLevel = maxLevel;
    }

    setTexIndex(index: number): this {
        this.texIndex = index;
        return this;
    }

    setConsumeSlots(count: number): this {
        this.consumeSlots = count;
        return this;
    }

    setRecipe(recipe: AnyID[]): this {
        this.recipe = recipe.map(item => getIDData(item));
        return this;
    }

    addConflict(...mods: string[]): this {
        for(const mod of mods){
            this.hate[mod] = true;
        }
        return this;
    }

    getTexIndex(): number {
        return this.texIndex;
    }

    getConsumeSlots(): number {
        return this.consumeSlots;
    }

    getRecipe(): Tile[] {
        return this.recipe;
    }

    canBeTogether(modifiers: {type: string, level: number}[]): boolean {
        for(const mod of modifiers){
            if(this.hate[mod.type]){
                return false;
            }
        }
        return true;
    }

    //haste:50_silk:1
    static encodeToString(modifiers: {type: string, level: number}[]): string {
        return modifiers.map(mod => mod.type + ":" + mod.level).join("_");
    }

    static decodeToArray(code: string): {type: string, level: number}[] {
        const array: {type: string, level: number}[] = [];
        const split = new String(code).split("_");
        let mod: string[];
        let level = 0
        for(const str of split){
            mod = str.split(":");
            level = parseInt(mod[1]);
            if(mod.length === 2 && (mod[0] in Modifier) && !isNaN(level)){
                array.push({type: mod[0], level});
            }
        }
        return array;
    }

    static decodeToObj(code: string): {[key: string]: number} {
        const mods: {[key: string]: number} = {};
        for(const mod of this.decodeToArray(code)){
            mods[mod.type] ??= 0;
            mods[mod.type] += mod.level;
        }
        return mods;
    }

}


const Modifier: {[key: string]: TconModifier} = {

    haste: new TconModifier(TraitHaste, 50)
        .setTexIndex(0)
        .setRecipe(["redstone"]),

    luck: new TconModifier(TraitLuck, 360)
        .setTexIndex(1)
        .setRecipe(["lapis_lazuli"])
        .addConflict("luck", "silk"),

    sharp: new TconModifier(TraitSharp, 72)
        .setTexIndex(2)
        .setRecipe(["quartz"])

};
