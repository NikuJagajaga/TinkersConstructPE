class ToolCrafterWindow extends CraftingWindow {

    consume: number[];
    page: number;
    isForge: boolean;
    winContent: UI.WindowContent;

    constructor(name: string, isForge: boolean){

        const window = new UI.StandardWindow({
            standard: {
                header: {text: {text: name}, height: 60},
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
                    onClick: () => this.onCraft()
                }},
                buttonPrev: {type: "button", x: 50, y: 452, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                    onClick: () => this.turnPage(-1)
                }},
                buttonNext: {type: "button", x: 254, y: 452, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                    onClick: () => this.turnPage(1)
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

        super(window);

        this.page = 0;
        this.isForge = !!isForge;

        //width 640
        const windowMain = window.getWindow("content");
        this.winContent = windowMain.getContent();

    }

    override onOpen(window: UI.Window): void {
        super.onOpen(window);
        this.turnPage(0);
    }

    override onClose(window: UI.Window): void {
        this.container.clearSlot("slotResult");
        super.onClose(window);
    }

    override onUpdate(elements: java.util.HashMap<string, UI.Element>): void {

        let consume: number[] = [];

        const slotTool = this.container.getSlot("slot0");

        if(ToolForgeHandler.isTool(slotTool.id) && slotTool.extra){

            const slots: ItemInstance[] = [];
            const items: ItemInstance[] = [];
            let slot: UI.Slot;
            let find: ItemInstance;
            for(let i = 1; i < 6; i++){
                slot = this.container.getSlot("slot" + i);
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

            const mat = stack.instance.repairParts.map(index => Material[stack.materials[index]].getItem());
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
                this.container.setSlot("slotResult", result.id, result.count, result.data, result.extra);
                // const extra = stack.extra.copy();
                // extra.putInt("durability", newDur);
                // extra.putInt("repair", stack.repairCount + 1);
                // extra.putString("modifiers", TinkersModifierHandler.encodeToString(modifiers));
                // this.container.setSlot("slotResult", stack.id, 1, Math.ceil(newDur / stack.stats.durability * stack.instance.maxDamage), extra);
            }
            else{
                this.container.clearSlot("slotResult");
            }

        }
        else{

            const result = ToolForgeHandler.getRecipes(this.isForge).find(recipe => {
                let slot: UI.Slot;
                let partData: TinkersPartData;
                for(let i = 0; i < 6; i++){
                    slot = this.container.getSlot("slot" + i);
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
                    slot = this.container.getSlot("slot" + i);
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
                this.container.setSlot("slotResult", result.result, 1, 0, extra);
            }
            else{
                this.container.clearSlot("slotResult");
            }

        }

        const slotResult = this.container.getSlot("slotResult");
        if(ToolForgeHandler.isTool(slotResult.id) && slotResult.extra){
            this.showInfo(slotResult);
        }
        else if(ToolForgeHandler.isTool(slotTool.id) && slotTool.extra){
            this.showInfo(slotTool);
        }
        else{
            const layout = ToolForgeHandler.getLayoutList(this.isForge)[this.page];
            this.container.setText("textStats", addLineBreaks(16, layout.intro));
            this.container.setText("textModifiers", "       .\n     /( _________\n     |  >:=========`\n     )(  \n     \"\"");
        }

        this.consume = consume;
        
    }

    private onCraft(): void {

        if(this.container.getSlot("slotResult").id !== 0){
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
                    slot = this.container.getSlot("slot" + i);
                    slot.count -= this.consume[i] || 0;
                    this.container.validateSlot("slot" + i);
                }
                slot = this.container.getSlot("slotResult");
                Player.setInventorySlot(index, slot.id, 1, slot.data, slot.extra);
                this.isForge ?
                    SoundManager.playSound("random.anvil_use", 1, 0.95 + 0.2 * Math.random()) :
                    SoundManager.playSound("tcon.little_saw.ogg");
            }
            catch(e){
                alert("craftError: " + e);
            }
        }

    }

    private turnPage(page: -1 | 0 | 1): void {

        const layouts = ToolForgeHandler.getLayoutList(this.isForge);

        this.page += page;
        this.page = this.page < 0 ? layouts.length - 1 : this.page >= layouts.length ? 0 : this.page;

        const centerX = 160;
        const centerY = 210;
        const scale = 5;
        const layout = layouts[this.page];
        let slot: UI.UISlotElement;

        for(let i = 0; i < 6; i++){
            slot = this.winContent.elements["slot" + i] as UI.UISlotElement;
            if(layout.slots[i]){
                slot.x = layout.slots[i].x * scale + centerX;
                slot.y = layout.slots[i].y * scale + centerY;
                slot.bitmap = layout.slots[i].bitmap;
            }
            else{
                slot.y = 2000;
            }
        }

        this.container.setText("textTitle", layout.title);
        this.container.setText("textStats", addLineBreaks(16, layout.intro));
        (this.winContent.elements.bgImage as UI.UIImageElement).bitmap = layout.background;

    }

    private showInfo(item: ItemInstance): void {

        const stack = new TconToolStack(item);
        const modifiers = TinkersModifierHandler.decodeToArray(item.extra.getString("modifiers"));

        this.container.setText("textStats",
            "Durability: " + (stack.stats.durability - item.extra.getInt("durability")) + "/" + stack.stats.durability + "\n" +
            "Mining Level: " + TinkersMaterial.level[stack.stats.level] + "\n" +
            "Mining Speed: " + ((stack.stats.efficiency * 100 | 0) / 100) + "\n" +
            "Attack: " + ((stack.stats.damage * 100 | 0) / 100) + "\n" +
            "Modifiers: " + (Cfg.modifierSlots + ToolLeveling.getLevel(stack.xp, stack.instance.is3x3) - modifiers.length)
        );

        this.container.setText("textModifiers", modifiers.map(mod => {
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

    const winStation = new ToolCrafterWindow("Tool Station", false);
    const winForge = new ToolCrafterWindow("Tool Forge", true);

    winStation.addTargetBlock(BlockID.tcon_toolstation);
    winForge.addTargetBlock(BlockID.tcon_toolforge_iron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_gold);
    winForge.addTargetBlock(BlockID.tcon_toolforge_cobalt);
    winForge.addTargetBlock(BlockID.tcon_toolforge_ardite);
    winForge.addTargetBlock(BlockID.tcon_toolforge_manyullyn);
    winForge.addTargetBlock(BlockID.tcon_toolforge_pigiron);
    winForge.addTargetBlock(BlockID.tcon_toolforge_alubrass);

})();
