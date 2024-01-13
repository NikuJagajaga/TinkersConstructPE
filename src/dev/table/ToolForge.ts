class ToolCrafterWindow extends CraftingWindow {

    consume: number[];
    page: number;
    isForge: boolean;

    constructor(windowName: string, title: string, isForge: boolean){

        const window = new UI.StandardWindow({
            standard: {
                header: {text: {text: title}, height: 60},
                inventory: {standard: true},
                background: {standard: true}
            },
            drawing: [
                {type: "frame", x: 580, y: 0, width: 400, height: 240, bitmap: "tcon.frame", scale: 4},
                {type: "frame", x: 580, y: 260, width: 400, height: 240, bitmap: "tcon.frame", scale: 4}
            ],
            elements: {
                bgImage: {type: "image", x: 50, y: 95, bitmap: "tcon.icon.repair", scale: 18.75},
                slot0: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot1: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot2: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot3: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot4: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slot5: {type: "slot", x: 0, y: 0, z: 1, size: 80},
                slotResult: {type: "slot", x: 420, y: 190, size: 120, visual: true, clicker: {
                    onClick: (_, container: ItemContainer) => container.sendEvent("craft", {})
                }},
                buttonPrev: {type: "button", x: 50, y: 452, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                    onClick: (_, container: ItemContainer) => container.sendEvent("page", {page: -1})
                }},
                buttonNext: {type: "button", x: 254, y: 452, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                    onClick: (_, container: ItemContainer) => container.sendEvent("page", {page: 1})
                }}
            }
        });

        window.addWindow("stats", {
            location: {x: 722, y: 90, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250},
            drawing: [
                {type: "background", color: Color.TRANSPARENT}
            ],
            elements: {
                textTitle: {type: "text", x: 500, y: -30, font: {size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true}},
                textStats: {type: "text", x: 20, y: 120, font: {size: 72, color: Color.WHITE, shadow: 0.5}, multiline: true}
            }
        });

        window.addWindow("modifiers", {
            location: {x: 722, y: 257, width: 400 * 0.64 - 20, height: 240 * 0.64 - 20, scrollY: 250},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "text", x: 500, y: 50, font: {size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true}, text: "Modifiers"}
            ],
            elements: {
                textModifiers: {type: "text", x: 20, y: 120, font: {size: 72, color: Color.WHITE, shadow: 0.5}, multiline: true}
            }
        });

        super(windowName, window);

        this.page = 0;
        this.isForge = !!isForge;

        ItemContainer.addClientEventListener(this.name, "changeLayout", (container, win, content, data: {bg: string, slots: {x: number, y: number, bitmap: string}[]}) => {

            const centerX = 160;
            const centerY = 210;
            const scale = 5;
            let slot: UI.UISlotElement;
    
            for(let i = 0; i < 6; i++){
                slot = content.elements["slot" + i] as UI.UISlotElement;
                if(data.slots[i]){
                    slot.x = data.slots[i].x * scale + centerX;
                    slot.y = data.slots[i].y * scale + centerY;
                    slot.bitmap = data.slots[i].bitmap;
                }
                else{
                    slot.y = 2000;
                }
            }
            
            content.elements.bgImage.bitmap = data.bg;

        });

    }

    override addServerEvents(container: ItemContainer): void {

        container.addServerEventListener("page", (con, client, data: {page: -1 | 0 | 1}) => this.turnPage(con, data.page));

        container.addServerEventListener("craft", (con, client, data) => this.onCraft(con, client));
        
    }

    override onOpen(container: ItemContainer): void {
        this.turnPage(container, 0);
    }

    override onClose(container: ItemContainer): void {
        container.clearSlot("slotResult");
    }

    override onUpdate(container: ItemContainer): void {

        let consume: number[] = [];

        const slotTool = container.getSlot("slot0");

        if(ToolForgeHandler.isTool(slotTool.id) && slotTool.extra){

            const slots: ItemInstance[] = [];
            const items: ItemInstance[] = [];
            let slot: ItemContainerSlot;
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
            let count = 0;
            for(let key in Modifier){
                count = Math.min(...Modifier[key].getRecipe().map(recipe => {
                    const find2 = items.find(item => item.id === recipe.id && (recipe.data === -1 || item.data === recipe.data));
                    return find2 ? find2.count : 0;
                }));
                if(count > 0){
                    addMod[key] = count;
                }
            }

            const stack = new TconToolStack(slotTool);
            const modifiers = TinkersModifierHandler.decodeToArray(stack.extra.getString("modifiers"));
            let find3: {type: string, level: number};
            for(let key in addMod){
                find3 = modifiers.find(mod => mod.type === key);
                if(find3 && find3.level < Modifier[key].max){
                    addMod[key] = Math.min(addMod[key], Modifier[key].max - find3.level);
                    find3.level += addMod[key];
                    continue;
                }
                if(Modifier[key].canBeTogether(modifiers) && modifiers.length < Cfg.modifierSlots + ToolLeveling.getLevel(stack.xp, stack.instance.is3x3)){
                    addMod[key] = Math.min(addMod[key], Modifier[key].max);
                    modifiers.push({type: key, level: addMod[key]});
                }
                else{
                    delete addMod[key];
                }
            }

            const mat = stack.instance.repairParts.map(index => stack.materials[index].getItem());
            const space = stack.durability;
            let newDur = space;
            let value = 0;
            find = null;
            count = 0;

            for(let i = 0; i < mat.length; i++){
                find = items.find(item => item.id === mat[i].id && (mat[i].data === -1 || item.data === mat[i].data));
                if(find){
                    value = RepairHandler.calcRepairAmount(find);
                    if(value > 0){
                        value *= stack.instance.getRepairModifierForPart(i);
                        while(count < find.count && RepairHandler.calcRepair(stack, value * count) < space){
                            count++;
                        }
                        newDur = Math.max(0, space - (RepairHandler.calcRepair(stack, value * count) | 0));
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

                const result = stack.clone();
                result.durability = newDur;
                result.extra.putInt("repair", stack.repairCount + 1);
                result.extra.putString("modifiers", TinkersModifierHandler.encodeToString(modifiers));
                container.setSlot("slotResult", result.id, result.count, result.data, result.extra);

            }
            else{
                container.clearSlot("slotResult");
            }

        }
        else{

            const result = ToolForgeHandler.getRecipes(this.isForge).find(recipe => {
                let slot: ItemContainerSlot;
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
                let slot: ItemContainerSlot;
                let partData: TinkersPartData;
                for(let i = 0; i < result.pattern.length; i++){
                    slot = container.getSlot("slot" + i);
                    partData = PartRegistry.getPartData(slot.id);
                    partData ? materials.push(partData.material) : alert("part error: " + slot.id);
                    consume[i] = 1;
                }
                const extra = new ItemExtraData().putInt("durability", 0)
                                                 .putInt("xp", 0)
                                                 .putInt("repair", 0)
                                                 .putString("materials", materials.join("_"))
                                                 .putString("modifiers", "");
                container.setSlot("slotResult", result.result, 1, 0, extra);
            }
            else{
                container.clearSlot("slotResult");
            }

        }

        const slotResult = container.getSlot("slotResult");
        if(ToolForgeHandler.isTool(slotResult.id) && slotResult.extra){
            this.showInfo(container, slotResult);
        }
        else if(ToolForgeHandler.isTool(slotTool.id) && slotTool.extra){
            this.showInfo(container, slotTool);
        }
        else{
            const layout = ToolForgeHandler.getLayoutList(this.isForge)[this.page];
            container.setText("textStats", addLineBreaks(16, layout.intro));
            container.setText("textModifiers", "       .\n     /( _________\n     |  >:=========`\n     )(  \n     \"\"");
        }

        this.consume = consume;
        container.sendChanges();
        
    }

    private onCraft(container: ItemContainer, client: NetworkClient): void {

        const slotResult = container.getSlot("slotResult");

        if(slotResult.id !== 0){
            const actor = new PlayerActor(client.getPlayerUid());
            let slot: ItemContainerSlot;
            for(let i = 0; i < 6; i++){
                slot = container.getSlot("slot" + i);
                slot.count -= this.consume[i] || 0;
                slot.markDirty();
                slot.validate();
            }
            actor.addItemToInventory(slotResult.id, slotResult.count, slotResult.data, slotResult.extra, true);
            this.isForge ?
                client.send("tcon.playSound", {name: "tcon.anvil_use.ogg", volume: 0.5, pitch: 0.95 + 0.2 * Math.random()}) :
                client.send("tcon.playSound", {name: "tcon.little_saw.ogg"});
            this.onUpdate(container);
        }

    }

    private turnPage(container: ItemContainer, page: -1 | 0 | 1): void {

        const layouts = ToolForgeHandler.getLayoutList(this.isForge);

        this.page += page;
        this.page = this.page < 0 ? layouts.length - 1 : this.page >= layouts.length ? 0 : this.page;

        const layout = layouts[this.page];

        container.setText("textTitle", layout.title);
        container.setText("textStats", addLineBreaks(16, layout.intro));
        container.sendEvent("changeLayout", {bg: layout.background, slots: layout.slots});

        this.onUpdate(container);

    }

    private showInfo(container: ItemContainer, item: ItemInstance): void {

        const stack = new TconToolStack(item);
        const modifiers = TinkersModifierHandler.decodeToArray(item.extra.getString("modifiers"));

        container.setText("textStats",
            "Durability: " + (stack.stats.durability - item.extra.getInt("durability")) + "/" + stack.stats.durability + "\n" +
            "Mining Level: " + TinkersMaterial.level[stack.stats.level] + "\n" +
            "Mining Speed: " + ((stack.stats.efficiency * 100 | 0) / 100) + "\n" +
            "Attack: " + ((stack.stats.damage * 100 | 0) / 100) + "\n" +
            "Modifiers: " + (Cfg.modifierSlots + ToolLeveling.getLevel(stack.xp, stack.instance.is3x3) - modifiers.length)
        );

        container.setText("textModifiers", modifiers.map(mod => {
            return `${Modifier[mod.type].getName()} (${mod.level}/${Modifier[mod.type].max})`;
        }).join("\n"));

    }

}


createBlock("tcon_toolstation", [{name: "Tool Station"}], "wood");
Recipes2.addShaped(BlockID.tcon_toolstation, "a:b", {a: ItemID.tcon_pattern_blank, b: "crafting_table"});
BlockModel.register(BlockID.tcon_toolstation, (model, index) => {
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [["tcon_toolstation", 0], ["tcon_toolstation", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, "tcon_table_side", 0);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, "tcon_table_side", 0);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, "tcon_table_side", 0);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, "tcon_table_side", 0);
    return model;
});

ToolForgeHandler.createForgeBlock("tcon_toolforge_iron", "iron_block");
ToolForgeHandler.createForgeBlock("tcon_toolforge_gold", "gold_block");
ToolForgeHandler.createForgeBlock("tcon_toolforge_cobalt", BlockID.blockCobalt);
ToolForgeHandler.createForgeBlock("tcon_toolforge_ardite", BlockID.blockArdite);
ToolForgeHandler.createForgeBlock("tcon_toolforge_manyullyn", BlockID.blockManyullyn);
ToolForgeHandler.createForgeBlock("tcon_toolforge_pigiron", BlockID.blockPigiron);
ToolForgeHandler.createForgeBlock("tcon_toolforge_alubrass", BlockID.blockAlubrass);


(() => {

    const winStation = new ToolCrafterWindow("tcon_toolstation", "Tool Station", false);
    const winForge = new ToolCrafterWindow("tcon_toolforge", "Tool Forge", true);

    winStation.addTargetBlock(BlockID.tcon_toolstation);
    winForge.addTargetBlock(BlockID.tcon_toolforge_iron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_gold);
    winForge.addTargetBlock(BlockID.tcon_toolforge_cobalt);
    winForge.addTargetBlock(BlockID.tcon_toolforge_ardite);
    winForge.addTargetBlock(BlockID.tcon_toolforge_manyullyn);
    winForge.addTargetBlock(BlockID.tcon_toolforge_pigiron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_alubrass);

})();
