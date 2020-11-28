interface TinkersPartData {
    type: string;
    material: string;
}

class PartRegistry {

    private static data: {[id: number]: TinkersPartData} = {};

    private static readonly types: {key: string, name: string, cost: number}[] = [
        {key: "pickaxe", name: "Pickaxe Head", cost: 2},
        {key: "shovel", name: "Shovel Head", cost: 2},
        {key: "axe", name: "Axe Head", cost: 2},
        {key: "broadaxe", name: "Broad Axe Head", cost: 8},
        {key: "sword", name: "Sword Blade", cost: 2},
        {key: "hammer", name: "Hammer Head", cost: 8},
        {key: "excavator", name: "Excavator Head", cost: 8},
        {key: "rod", name: "Tool Rod", cost: 1},
        {key: "rod2", name: "Tough Tool Rod", cost: 3},
        {key: "binding", name: "Binding", cost: 1},
        {key: "binding2", name: "Tough Binding", cost: 3},
        {key: "guard", name: "Wide Guard", cost: 1},
        {key: "largeplate", name: "Large Plate", cost: 8}
    ];

    private static createParts(key: string, material: TinkersMaterial): void {
        const name = material.getName();
        this.types.forEach(type => {
            const id = createItem(`tconpart_${type.key}_${key}`, `${name} ${type.name}`);
            Item.addCreativeGroup("tconpart_" + type.key, type.name, [id]);
            this.data[id] = {type: type.key, material: key};
            const liquid = material.getMoltenLiquid();
            if(liquid){
                MeltingRecipe.addRecipe(id, liquid, MatValue.INGOT * type.cost);
                CastingRecipe.addTableRecipeForBoth(type.key, liquid, id);
            }
            CastingRecipe.addMakeCastRecipes(id, type.key);
        });
    }

    static setup(): void {
        for(let key in Material){
            PartRegistry.createParts(key, Material[key]);
        }
    }

    static getPartData(id: number) : TinkersPartData {
        return this.data[id];
    }

    static getIDFromData(type: string, material: string): number {
        for(let id in this.data){
            if(this.data[id].type === type && this.data[id].material === material){
                return parseInt(id);
            }
        }
        return 0;
    }

}


PartRegistry.setup();