const Modifier: {[key: string]: TinkersModifier} = {
    haste: new ModHaste(),
    luck: new ModLuck(),
    sharp: new ModSharp(),
    diamond: new ModDiamond(),
    emerald: new ModEmerald(),
    silk: new ModSilk(),
    reinforced: new ModReinforced(),
    beheading: new ModBeheading(),
    smite: new ModSmite(),
    spider: new ModSpider(),
    fiery: new ModFiery(),
    necrotic: new ModNecrotic(),
    knockback: new ModKnockback(),
    mending: new ModMending(),
    shuling: new ModShulking(),
    web: new ModWeb()
};


class TinkersToolHandler {

    private static tools: {[id: number]: TinkersTool} = {};

    private static ToolLib_setTool(id: number, toolMaterial: ToolAPI.ToolMaterial, toolType: TinkersTool): void {
        Item.setToolRender(id, true);
        const toolData: {[key: string]: any} = {brokenId: 0, ...toolType};
        if(!toolMaterial.durability){
            toolMaterial.durability = Item.getMaxDamage(id);
        }
        if(!toolData.blockTypes){
            toolData.isNative = true;
            Item.setMaxDamage(id, toolMaterial.durability);
        }
        ToolAPI.registerTool(id, toolMaterial, toolData.blockTypes, toolData);
        if(toolData.useItem){
            Item.registerUseFunctionForID(id, toolData.useItem);
        }
        if(toolData.destroyBlock){
            Callback.addCallback("DestroyBlock", (coords, block, player) => {
                const item = Player.getCarriedItem();
                if(item.id === id){
                    toolData.destroyBlock(coords, coords.side, item, block);
                }
            });
        }
        if(toolData.continueDestroyBlock){
            Callback.addCallback("DestroyBlockContinue", (coords, block, progress) => {
                const item = Player.getCarriedItem();
                if(item.id === id){
                    toolData.continueDestroyBlock(item, coords, block, progress);
                }
            });
        }
    }

    static createTool(namedID: string, name: string, toolData: TinkersTool): number {
        const id = createItem(namedID, name, {name: namedID}, {stack: 1, isTech: true});
        Item.setMaxDamage(id, 14);
        this.ToolLib_setTool(id, {durability: 0, level: 0, efficiency: 0, damage: 0}, toolData);
        Item.registerNameOverrideFunction(id, (item, name) => {
            try{
                if(!item.extra){
                    return name;
                }
                const tData = new ToolData(item);
                return tData.getName(name);
            }
            catch(e){
                alert("nameError: " + e);
            }
        });
        //ItemModel.getFor(id, -1).setModelOverrideCallback(item => item.extra ? this.getModel(item) : null);
        for(let i = 0; i <= 14; i++){
            ItemModel.getFor(id, i).setModelOverrideCallback(item => item.extra ? this.getModel(item) : null);
        }
        this.tools[id] = toolData;
        return id;
    }

    static isTool(id: number): boolean {
        return id in this.tools;
    }

    static getToolData(id: number): TinkersTool {
        return this.tools[id] || null;
    }

    private static models: {[key: string]: {normal: ItemModel, broken: ItemModel}} = {};

    private static getModel(item: ItemInstance): any {
        try{
            const toolData = new ToolData(item);
            const suffix = toolData.isBroken() ? "broken" : "normal";
            const texture = toolData.toolData.getTexture();
            const path = texture.getPath();
            const uniqueKey = toolData.uniqueKey();
            if(this.models[uniqueKey]){
                return this.models[uniqueKey][suffix];
            }
            const mesh = [new RenderMesh(), new RenderMesh(), new RenderMesh(), new RenderMesh()];
            const coordsNormal: {x: number, y: number}[] = [];
            const coordsBroken: {x: number, y: number}[] = [];
            let index: number;
            for(let i = 0; i < toolData.toolData.partsCount; i++){
                index = Material[toolData.materials[i]].getTexIndex();
                coordsNormal.push(texture.getCoords(i, index));
                coordsBroken.push(texture.getCoords(i === toolData.toolData.brokenIndex ? toolData.toolData.partsCount : i, index));
            }
            for(let key in toolData.modifiers){
                index = Modifier[key].getTexIndex();
                coordsNormal.push(texture.getModCoords(index));
                coordsBroken.push(texture.getModCoords(index));
            }
            mesh.forEach((m, i) => {
                const coords = i >> 1 ? coordsBroken : coordsNormal;
                let z: number;
                for(let j = 0; j < coords.length; j++){
                    z = i & 1 ? -0.001 * (coords.length - j) : 0.001 * (coords.length - j);
                    m.setColor(1, 1, 1);
                    m.setNormal(1, 1, 0);
                    m.addVertex(0, 1, z, coords[j].x, coords[j].y);
                    m.addVertex(1, 1, z, coords[j].x + 0.0625, coords[j].y);
                    m.addVertex(0, 0, z, coords[j].x, coords[j].y + 0.0625);
                    m.addVertex(1, 1, z, coords[j].x + 0.0625, coords[j].y);
                    m.addVertex(0, 0, z, coords[j].x, coords[j].y + 0.0625);
                    m.addVertex(1, 0, z, coords[j].x + 0.0625, coords[j].y + 0.0625);
                }
                if((i & 1) === 0){
                    m.translate(0.4, -0.1, 0.2);
                    m.rotate(0.5, 0.5, 0.5, 0, -2.1, 0.4);
                    m.scale(2, 2, 2);
                }
            });
            const data = {
                normal: {hand: mesh[0], ui: mesh[1]},
                broken: {hand: mesh[2], ui: mesh[3]}
            };
            const modelNormal = ItemModel.newStandalone();
            const modelBroken = ItemModel.newStandalone();
            modelNormal.setModel(data.normal.hand, path);
            modelNormal.setUiModel(data.normal.ui, path);
            modelNormal.setSpriteUiRender(true);
            modelBroken.setModel(data.broken.hand, path);
            modelBroken.setUiModel(data.broken.ui, path);
            modelBroken.setSpriteUiRender(true);
            this.models[uniqueKey] = {normal: modelNormal, broken: modelBroken};
            //Game.message(uniqueKey);
            return this.models[uniqueKey][suffix];
        }
        catch(e){
            //alert("iconError: " + e);
            return null;
        }
    }

}
