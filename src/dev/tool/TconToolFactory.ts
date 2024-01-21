class TconToolFactory {


    private static tools: {[type: string]: {[lv: number]: number}} = {};


    static registerToolId(toolId: number, type: string, miningLevel: number): void {
        this.tools[type] ??= {};
        this.tools[type][miningLevel] = toolId;
    }


    static getToolId(type: string, miningLevel: number): number {
        if(this.tools[type]){
            return this.tools[type][miningLevel] || -1;
        }
        return -1;
    }


    static createToolStack(type: string, materials: string[]): TconToolStack {
        let id = 0;
        if(!this.tools[type]){
            return null;
        }
        for(let lv in this.tools[type]){
            id = this.tools[type][lv];
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


    static isTool(id: number): boolean {
        for(let type in this.tools){
            for(let lv in this.tools[type]){
                if(id === this.tools[type][lv]){
                    return true;
                }
            }
        }
        return false;
    }


    static getType(id: number): string {
        for(let type in this.tools){
            for(let lv in this.tools[type]){
                if(id === this.tools[type][lv]){
                    return type;
                }
            }
        }
        return "";
    }


    static addToCreative(type: string, name: string, partsCount: number): void {

        const materials: string[] = [];
        let stack: TconToolStack;

        for(let key in Material){
            materials.length = 0;
            for(let i = 0; i < partsCount; i++){
                materials.push(key);
            }
            stack = this.createToolStack(type, materials);
            if(stack && stack.id !== -1){
                Item.addToCreative(stack.id, stack.count, stack.data, stack.extra.putInt("xp", 2e9));
            }
        }
        for(let lv in this.tools[type]){
            Item.addCreativeGroup("tcontool_" + type, name, [this.tools[type][lv]]);
        }

    }


}
