interface TinkersPartData {
    type: EPartType;
    material: string;
}

namespace PartRegistry {

    const data: {[id: number]: TinkersPartData} = {};

    export const types: {key: EPartType, name: string, cost: number}[] = [
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

    const nameOverrideFunc: Callback.ItemNameOverrideFunction = (item, translation, name) => translation + "\n" + getTooltips(item.id).join("\n");

    export function createParts(key: string, material: TinkersMaterial): void {
        let id = 0;
        for(const type of types){
            id = createItem(`tconpart_${type.key}_${key}`, material.getLocalizationOfPart(type.name));
            Item.registerNameOverrideFunction(id, nameOverrideFunc);
            Item.addCreativeGroup("tconpart_" + type.key, translate(type.name), [id]);
            data[id] = {type: type.key, material: key};
        }
    }

    for(let key in Material){
        PartRegistry.createParts(key, Material[key]);
    }

    export function registerRecipes(key: string, material: TinkersMaterial): void {
        let id = 0;
        let liquid = "";
        for(const type of types){
            id = ItemID[`tconpart_${type.key}_${key}`];
            liquid = material.getMoltenLiquid();
            if(liquid){
                MeltingRecipe.addRecipe(id, liquid, MatValue.INGOT * type.cost);
                CastingRecipe.addTableRecipeForAll(type.key, liquid, id);
            }
            CastingRecipe.addMakeCastRecipes(id, type.key);
        }
    }

    export function getPartData(id: number): TinkersPartData {
        return data[id];
    }

    export function getIDFromData(type: string, material: string): number {
        for(let id in data){
            if(data[id].type === type && data[id].material === material){
                return +id;
            }
        }
        return 0;
    }

    export function getAllPartBuildRecipeForRV(): RecipePattern[] {

        const list: RecipePattern[] = [];

        for(let key in Material){
            if(!Material[key].isMetal){
                for(const type of types){
                    list.push({
                        input: [{id: ItemID.tcon_pattern_blank, count: 1, data: 0}, {...Material[key].getItem(), count: type.cost}],
                        output: [{id: PartRegistry.getIDFromData(type.key, key), count: 1, data: 0}],
                        pattern: type.key
                    });
                }
            }
        }

        return list;

    }

    export function getTooltips(id: number): string[] {
        const tooltips: string[] = [];
        const partData = PartRegistry.getPartData(id);
        if(partData){
            const matData = Material[partData.material];
            if(matData){
                const mask = PartCategory[partData.type];
                if(mask & EPartCategory.HEAD){
                    const head = matData.getHeadStats();
                    const miningTier = MiningLvName[head.level];
                    tooltips.push("", "§f" + translate("Head"));
                    tooltips.push("§7" + translate("Durability: ") + head.durability);
                    tooltips.push(translate("Mining Tier: ") + translate(miningTier));
                    tooltips.push(translate("Mining Speed: ") + head.efficiency);
                    tooltips.push(translate("Melee Damage: ") + head.damage);
                }
                if(mask & EPartCategory.HANDLE){
                    const handle = matData.getHandleStats();
                    tooltips.push("", "§f" + translate("Handle"));
                    tooltips.push("§7" + translate("Multiplier: ") + handle.modifier);
                    tooltips.push(translate("Durability: ") + handle.durability);
                }
                if(mask & EPartCategory.EXTRA){
                    const extra = matData.getExtraStats();
                    tooltips.push("", "§f" + translate("Extra"));
                    tooltips.push("§7" + translate("Durability: ") + extra.durability);
                }
            }
        }
        return tooltips;
    }

    const onTooltipFunc: KEX.ItemsModule.OnTooltipCallback = (item, text, level) => {
        const tooltips = PartRegistry.getTooltips(item.id);
        for(const line of tooltips){
            text.add(line);
        }
    }

    export function replaceTooltipsWithKEX(api: typeof KEX): void {
        for(let id in data){
            delete Item.nameOverrideFunctions[id];
            api.ItemsModule.addTooltip(+id, onTooltipFunc);
        }
    }

}


Callback.addCallback("PreLoaded", () => {
    for(let key in Material){
        PartRegistry.registerRecipes(key, Material[key]);
    }
});
