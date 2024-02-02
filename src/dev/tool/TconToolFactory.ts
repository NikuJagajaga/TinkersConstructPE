namespace TconToolFactory {


    const tools: {[type: string]: {[lv: number]: number}} = {};


    const nameOverrideFunc: Callback.ItemNameOverrideFunction = (item, translation, name) => {
        if(item.extra){
            const stack = new TconToolStack(item);
            const tooltips = stack.getTooltips();
            return stack.getName() + "\n" + tooltips.join("\n");
        }
        return name;
    }

    const nameOverrideFuncWithoutTooltips: Callback.ItemNameOverrideFunction = (item, translation, name) => {
        if(item.extra){
            const stack = new TconToolStack(item);
            return stack.getName();
        }
        return translation;
    }

    const onTooltipFunc: KEX.ItemsModule.OnTooltipCallback = (item, text, level) => {
        if(item.extra){
            const stack = new TconToolStack(item);
            const tooltips = stack.getTooltips();
            for(let line of tooltips){
                text.add(line);
            }
        }
    }


    export function registerTool(toolId: number, type: string, miningLevel: number): void {
        tools[type] ??= {};
        tools[type][miningLevel] = toolId;
        Item.registerNameOverrideFunction(toolId, nameOverrideFunc);
    }


    export function addKEXFeature(api: typeof KEX): void {
        let id = 0;
        for(let type in tools){
            for(let lv in tools[type]){
                id = tools[type][lv];
                Item.registerNameOverrideFunction(id, nameOverrideFuncWithoutTooltips);
                api.ItemsModule.addTooltip(id, onTooltipFunc);
                api.ItemsModule.setExplodable(id, true);
                api.ItemsModule.setFireResistant(id, true);
            }
        }
    }


    export function getToolId(type: string, miningLevel: number): number {
        if(tools[type]){
            return tools[type][miningLevel] || -1;
        }
        return -1;
    }


    export function createToolStack(type: string, materials: string[]): TconToolStack {
        let id = 0;
        if(!tools[type]){
            return null;
        }
        for(let lv in tools[type]){
            id = tools[type][lv];
            break;
        }
        if(id === 0){
            return null;
        }
        return new TconToolStack({
            id, count: 1, data: 0,
            extra: new ItemExtraData()
                .putInt("durability", 0)
                .putInt("xp", 0)
                .putInt("repair", 0)
                .putString("materials", materials.join("_"))
                .putString("modifiers", "")
        });
    }


    export function isTool(id: number): boolean {
        for(let type in tools){
            for(let lv in tools[type]){
                if(id === tools[type][lv]){
                    return true;
                }
            }
        }
        return false;
    }


    export function getType(id: number): string {
        for(let type in tools){
            for(let lv in tools[type]){
                if(id === tools[type][lv]){
                    return type;
                }
            }
        }
        return "";
    }


    export function addToCreative(type: string, name: string, partsCount: number): void {

        const materials: string[] = [];
        let stack: TconToolStack;

        for(let key in Material){
            materials.length = 0;
            for(let i = 0; i < partsCount; i++){
                materials.push(key);
            }
            stack = TconToolFactory.createToolStack(type, materials);
            if(stack && stack.id !== -1){
                Item.addToCreative(stack.id, stack.count, stack.data, stack.extra.putInt("xp", 2e9));
            }
        }
        for(let lv in tools[type]){
            Item.addCreativeGroup("tcontool_" + type, translate(name), [tools[type][lv]]);
        }

    }


}
