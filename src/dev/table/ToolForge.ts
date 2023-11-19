interface ForgeInfo {
    title: string;
    background: string;
    intro: string;
    slots: {x: number, y: number, bitmap: string}[];
    coords?: {x: number, z: number}[];
    forgeOnly?: boolean;
}


class RepairHandler {

    private static readonly value = MatValue.SHARD * 4 / MatValue.INGOT | 0;

    static calcRepairAmount(id: number, data): number {
        let item: Tile;
        for(let key in Material){
            item = Material[key].getItem();
            if(item.id === id && (item.data === -1 || item.data === data)){
                return Material[key].getHeadStats().durability * this.value;
            }
        }
        return 0;
    }

    static calcRepair(tool: ItemInstance, amount: number): number {
        const toolData = new ToolData(tool);
        const origDur = toolData.getBaseStats().durability;
        const actDur = toolData.stats.durability;
        const modCount = TinkersModifierHandler.decodeToArray(tool.extra.getString("modifiers")).length;
        let increase = Math.max(Math.min(10, actDur / origDur) * amount, actDur / 64);
        increase *= 1 - Math.min(3, modCount) * 0.05;
        increase *= Math.max(0.5, 1 - tool.extra.getInt("repair") * 0.005);
        return Math.ceil(increase);
    }

}


class ToolForgeHandler {

    static variations: number;
    private static variation: {tex: string, block: Tile}[] = [];

    private static info: ForgeInfo[] = [];
    private static recipe: {result: number, pattern: string[]}[] = [];
    private static consume: number[] = [];

    private static content: UI.WindowContent;

    static addVariation(tex: string, block: number | Tile): void {
        let id: number;
        let data: number;
        if(typeof block === "number"){
            id = block;
            data = 0;
        }
        else{
            id = block.id;
            data = block.data;
        }
        if(this.variation.some(v => v.block.id === id && v.block.data === data)){
            return;
        }
        this.variations = this.variation.push({tex: tex, block: {id: id, data: data}});
    }

    private static getTexByMeta(meta: number): string {
        return this.variation[meta] ? this.variation[meta].tex : null;
    }

    static createForge(): void {
        const array = [];
        for(let i = 0; i < this.variations; i++){
            array.push({name: "Tool Forge"});
        }
        const id = createBlock("tcon_toolforge", array);
        BlockModel.register(id, (model, index) => {
            const tex = this.getTexByMeta(index);
            model.addBox( 0/16, 15/16,  0/16,  16/16, 16/16, 16/16, "tcon_toolforge", 0);
            model.addBox( 0/16, 12/16,  0/16,  16/16, 15/16, 16/16, tex, 0);
            model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, 0);
            model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, 0);
            model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, 0);
            model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, 0);
            return model;
        }, this.variations);
        Item.addCreativeGroup("tcon_toolforge", "Tool Forge", [BlockID.tcon_toolstation, id]);
        this.variation.forEach((v, i) => {
            Recipes2.addShaped({id: id, data: i}, "aaa:bcb:b_b", {a: BlockID.tcon_stone, b: v.block, c: BlockID.tcon_toolstation});
        });
        //TileEntity.registerPrototype(id, new ToolForge());
    }

    static addContents(info: ForgeInfo): void {
        const centerX = 160;
        const centerY = 210;
        const scale = 5;
        info.coords = [];
        for(let i = 0; i < 6; i++){
            if(!info.slots[i]){
                info.slots[i] = {x: 200, y: 36, bitmap: "classic_ slot"};
            }
            info.coords[i] = {x: info.slots[i].x / 61, z: info.slots[i].y / 61};
            info.slots[i].x = info.slots[i].x * scale + centerX;
            info.slots[i].y = info.slots[i].y * scale + centerY;
            info.slots[i].bitmap = "tcon.slot." + info.slots[i].bitmap;
        }
        info.intro = addLineBreaks(16, info.intro);
        this.info.push(info);
    }

    static getInfo(page: number): ForgeInfo {
        return this.info[page];
    }

    static addRecipe(result: number, pattern: string[]): void {
        this.recipe.push({result: result, pattern: pattern});
    }

    private static window = (() => {

        const window = new UI.StandardWindow({
            standard: {
                header: {text: {text: "Tool Forge"}},
                inventory: {standard: true},
                background: {standard: true}
            },
            drawing: [
                {type: "frame", x: 580, y: 0, width: 400, height: 240, bitmap: "tcon.frame", scale: 4},
                {type: "frame", x: 580, y: 260, width: 400, height: 240, bitmap: "tcon.frame", scale: 4}
            ],
            elements: {
                background: {type: "image", x: 50, y: 95, bitmap: "tcon.icon.repair", scale: 18.75},
                slot0: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot1: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot2: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot3: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot4: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot5: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slotResult: {type: "slot", x: 420, y: 190, size: 120, visual: true, clicker: {
                    onClick: (container, tile) => {
                        /*
                        if(container.getSlot("slotResult").id !== 0){
                            try{
                                let index = -1;
                                for(let i = 0; i < 36; i++){
                                    if(Player.getInventorySlot(i).id === 0){
                                        index = i;
                                        break;
                                    }
                                }
                                if(index === -1){
                                    alert("no space");
                                    return;
                                }
                                let slot: UI.Slot;
                                for(let i = 0; i < 6; i++){
                                    slot = container.getSlot("slot" + i);
                                    slot.count -= ToolForgeHandler.consume[i] || 0;
                                    container.validateSlot("slot" + i);
                                }
                                slot = container.getSlot("slotResult");
                                Player.setInventorySlot(index, slot.id, 1, slot.data, slot.extra);
                                tile.blockID === BlockID.tcon_toolstation ?
                                    SoundManager.playSound("saw.ogg", 0.5) :
                                    World.playSoundAtEntity(player, "random.anvil_use", 0.9, 0.95 + 0.2 * Math.random());
                            }
                            catch(e){
                                alert("craftError: " + e);
                            }
                        }
                        */
                    }
                }},
                buttonPrev: {type: "button", x: 50, y: 452, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                    onClick: (container, tile) => {
                        ToolForgeHandler.turnPage(-1);
                    }
                }},
                buttonNext: {type: "button", x: 254, y: 452, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                    onClick: (container, tile) => {
                        ToolForgeHandler.turnPage(1);
                    }
                }},
                //textTitle: {type: "text", x: 780, y: 0, font: {size: 30, color: Color.YELLOW, shadow: 0.5, alignment: 1, bold: true}},
                //textStats: {type: "text", x: 600, y: 60, font: {size: 26, color: Color.WHITE, shadow: 0.5}, multiline: true},
                //textModifiers: {type: "text", x: 600, y: 300, font: {size: 26, color: Color.WHITE, shadow: 0.5}, multiline: true},
                textDebug: {type: "text", x: 100, y: 0}
            }
        });

        window.addWindow("stats", {
            location: {x: 712 + 10, y: 100 + 10, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250},
            drawing: [
                {type: "background", color: Color.TRANSPARENT}
            ],
            elements: {
                textTitle: {type: "text", x: 500, y: -30, font: {size: 80, color: Color.YELLOW, shadow: 0.5, alignment: 1, bold: true}},
                textStats: {type: "text", x: 20, y: 120, font: {size: 72, color: Color.WHITE, shadow: 0.5}, multiline: true}
            }
        });

        window.addWindow("modifiers", {
            location: {x: 712 + 10, y: 267 + 10, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "text", x: 500, y: 50, font: {size: 80, color: Color.YELLOW, shadow: 0.5, alignment: 1, bold: true}, text: "Modifiers"}
            ],
            elements: {
                textModifiers: {type: "text", x: 20, y: 120, font: {size: 72, color: Color.WHITE, shadow: 0.5}, multiline: true}
            }
        });

        //width 640
        const windowMain = window.getWindow("content");
        ToolForgeHandler.content = windowMain.getContent();

        windowMain.setEventListener({
            onOpen: win => {
                const container = win.getContainer();
                const tile = container.getParent();
                ToolForgeHandler.turnPage(0);

                Threading.initThread("tcon_crafting", () => {

                    try{

                        while(win.isOpened()){

                            let consume: number[] = [];

                            const slotTool = container.getSlot("slot0");

                            if(TinkersToolHandler.isTool(slotTool.id) && slotTool.extra){

                                const slots: ItemInstance[] = [];
                                const items: ItemInstance[] = [];
                                let slot: UI.Slot;
                                let find: ItemInstance;
                                for(let i = 1; i < 6; i++){
                                    slot = container.getSlot("slot" + i);
                                    slots[i] = {id: slot.id, count: slot.count, data: slot.data};
                                    if(slot.id === 0){
                                        continue;
                                    }
                                    find = items.find(item => item.id === slot.id && item.data === slot.data);
                                    find ? find.count += slot.count : items.push({id: slot.id, count: slot.count, data: slot.data});
                                }

                                const addMod: {[key: string]: number} = {};
                                let count: number;
                                for(let key in Modifier){
                                    count = Math.min(...Modifier[key].getRecipe().map(recipe => {
                                        const find2 = items.find(item => item.id === recipe.id && (recipe.data === -1 || item.data === recipe.data));
                                        return find2 ? find2.count : 0;
                                    }));
                                    if(count > 0){
                                        addMod[key] = count;
                                    }
                                }

                                const toolData = new ToolData(slotTool);
                                const modifiers = TinkersModifierHandler.decodeToArray(slotTool.extra.getString("modifiers"));
                                let find3: {type: string, level: number};
                                for(let key in addMod){
                                    find3 = modifiers.find(mod => mod.type === key);
                                    if(find3 && find3.level < Modifier[key].max){
                                        addMod[key] = Math.min(addMod[key], Modifier[key].max - find3.level);
                                        find3.level += addMod[key];
                                        continue;
                                    }
                                    if(Modifier[key].canBeTogether(modifiers) && modifiers.length < Cfg.modifierSlots + toolData.getLevel()){
                                        addMod[key] = Math.min(addMod[key], Modifier[key].max);
                                        modifiers.push({type: key, level: addMod[key]});
                                    }
                                    else{
                                        delete addMod[key];
                                    }
                                }

                                const mat = toolData.toolData.getRepairParts().map(index => Material[toolData.materials[index]].getItem());
                                const space = slotTool.extra.getInt("durability");
                                let newDur = space;
                                let value = 0;
                                find = null;
                                count = 0;

                                for(let i = 0; i < mat.length; i++){
                                    find = items.find(item => item.id === mat[i].id && (mat[i].data === -1 || item.data === mat[i].data));
                                    if(find){
                                        value = RepairHandler.calcRepairAmount(find.id, find.data);
                                        if(value > 0){
                                            value *= toolData.toolData.getRepairModifierForPart(i);
                                            while(count < find.count && RepairHandler.calcRepair(slotTool, value * count) < space){
                                                count++;
                                            }
                                            newDur = Math.max(0, space - (RepairHandler.calcRepair(slotTool, value * count) | 0));
                                            break;
                                        }
                                    }
                                }

                                items.length = 0;
                                for(let key in addMod){
                                    items.push(...Modifier[key].getRecipe().map(item => ({id: item.id, count: addMod[key], data: item.data})));
                                }
                                count > 0 && items.push({id: find.id, count: count, data: 0});

                                if(items.length > 0){
                                    consume = slots.map(s => {
                                        const i = items.findIndex(item => item.id === s.id && (item.data === -1 || item.data === s.data));
                                        if(i === -1){
                                            return 0;
                                        }
                                        const min = Math.min(s.count, items[i].count);
                                        items[i].count -= min;
                                        items[i].count <= 0 && items.splice(i, 1);
                                        return min;
                                    });
                                    consume[0] = 1;

                                    const extra = slotTool.extra.copy();
                                    extra.putInt("durability", newDur);
                                    extra.putString("modifiers", TinkersModifierHandler.encodeToString(modifiers));
                                    container.setSlot("slotResult", slotTool.id, 1, Math.ceil(newDur / toolData.stats.durability * 14), extra);
                                }
                                else{
                                    container.clearSlot("slotResult");
                                }

                            }
                            else{

                                const result = ToolForgeHandler.recipe.find(recipe => {
                                    let slot: UI.Slot;
                                    let partData: TinkersPartData;
                                    for(let i = 0; i < 6; i++){
                                        slot = container.getSlot("slot" + i);
                                        if(recipe.pattern[i]){
                                            partData = PartRegistry.getPartData(slot.id);
                                            if(!partData || partData.type !== recipe.pattern[i]){
                                                return false;
                                            }
                                        }
                                        else if(slot.id !== 0){
                                            return false;
                                        }
                                    }
                                    return true;
                                });

                                if(result){
                                    const materials = [];
                                    let slot: UI.Slot;
                                    let partData: TinkersPartData;
                                    for(let i = 0; i < result.pattern.length; i++){
                                        slot = container.getSlot("slot" + i);
                                        partData = PartRegistry.getPartData(slot.id);
                                        partData ? materials.push(partData.material) : alert("part error: " + slot.id);
                                        consume[i] = 1;
                                    }
                                    const extra = new ItemExtraData();
                                    extra.putInt("durability", 0);
                                    extra.putInt("xp", 0);
                                    extra.putInt("repair", 0);
                                    extra.putString("materials", materials.join("_"));
                                    extra.putString("modifiers", "");
                                    container.setSlot("slotResult", result.result, 1, 0, extra);
                                }
                                else{
                                    container.clearSlot("slotResult");
                                }

                            }

                            const slotResult = container.getSlot("slotResult");
                            if(TinkersToolHandler.isTool(slotResult.id) && slotResult.extra){
                                ToolForgeHandler.showInfo(slotResult);
                            }
                            else if(TinkersToolHandler.isTool(slotTool.id) && slotTool.extra){
                                ToolForgeHandler.showInfo(slotTool);
                            }
                            else{
                                const info = ToolForgeHandler.getInfo(tile.data.page);
                                container.setText("textStats", info.intro);
                                container.setText("textModifiers", "       .\n     /( _________\n     |  >:=========`\n     )(  \n     \"\"");
                            }

                            ToolForgeHandler.consume = consume;
                            Thread.sleep(100);

                        }

                    }
                    catch(e){
                        alert("ToolForgeError: " + e);
                    }

                });

            },
            onClose: win => {
                const container = win.getContainer();
                const tile = container.getParent();
                container.clearSlot("slotResult");
                tile.setAnimItem();
            }
        });

        return window;

    })();


    private static turnPage(page: number): void {
        const container = this.window.getContainer();
        const tile = container.getParent();
        tile.data.page += page;
        tile.data.page = tile.data.page < 0 ? this.info.length - 1 : tile.data.page >= this.info.length ? 0 : tile.data.page;
        const info = this.getInfo(tile.data.page);
        if(page !== 0 && tile.blockID === BlockID.tcon_toolstation && info.forgeOnly){
            this.turnPage(page);
            return;
        }
        let slot: UI.UIElement;
        for(let i = 0; i < 6; i++){
            slot = this.content.elements["slot" + i];
            slot.x = info.slots[i].x;
            slot.y = info.slots[i].y;
            //slot.bitmap = info.slots[i].bitmap;
        }
        tile.container.setText("textTitle", info.title);
        tile.container.setText("textStats", info.intro);
        //this.content.elements.background.bitmap = info.background;
    }

    private static showInfo(item: ItemInstance): void {
        const container = this.window.getContainer();
        const toolData = new ToolData(item);
        const modifiers = TinkersModifierHandler.decodeToArray(item.extra.getString("modifiers"));
        container.setText("textStats",
            "Durability: " + (toolData.stats.durability - item.extra.getInt("durability")) + "/" + toolData.stats.durability + "\n" +
            "Mining Level: " + TinkersMaterial.level[toolData.stats.level] + "\n" +
            "Mining Speed: " + ((toolData.stats.efficiency * 100 | 0) / 100) + "\n" +
            "Attack: " + ((toolData.stats.damage * 100 | 0) / 100) + "\n" +
            "Modifiers: " + (Cfg.modifierSlots + toolData.getLevel() - modifiers.length)
        );
        container.setText("textModifiers", modifiers.map(mod => {
            return `${Modifier[mod.type].getName()} (${mod.level}/${Modifier[mod.type].max})`;
        }).join("\n"));
    }

    static getWindow(): UI.StandardWindow {
        return this.window;
    }

}


ToolForgeHandler.addContents({
    title: "Repair & Modify",
    background: "tcon.icon.repair",
    intro: "",
    slots: [
        {x: 0, y: 0, bitmap: "tool"},
        {x: -18, y: 20, bitmap: "lapis"},
        {x: -22, y: -5, bitmap: "dust"},
        {x: 0, y: -23, bitmap: "ingot"},
        {x: 22, y: -5, bitmap: "diamond"},
        {x: 18, y: 20, bitmap: "quartz"}
    ]
});


Callback.addCallback("PreLoaded", () => {
    ToolForgeHandler.addVariation("iron_block", VanillaBlockID.iron_block);
    ToolForgeHandler.addVariation("gold_block", VanillaBlockID.gold_block);
    ToolForgeHandler.addVariation("tcon_block_cobalt", BlockID.blockCobalt);
    ToolForgeHandler.addVariation("tcon_block_ardite", BlockID.blockArdite);
    ToolForgeHandler.addVariation("tcon_block_manyullyn", BlockID.blockManyullyn);
    ToolForgeHandler.addVariation("tcon_block_pigiron", BlockID.blockPigiron);
    ToolForgeHandler.addVariation("tcon_block_alubrass", BlockID.blockAlubrass);
    ToolForgeHandler.createForge();
});
