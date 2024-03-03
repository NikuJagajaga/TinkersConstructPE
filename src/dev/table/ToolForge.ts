interface ForgePageProperties {
    durability: number,
    maxDurability: number,
    miningTier: number,
    miningSpeed: number,
    meleeDamage: number,
    modifierSlots: number,
    traits: {key: string, level: number}[]
}

class ToolCrafterWindow extends CraftingWindow {

    consume: number[];
    page: number;
    isForge: boolean;

    constructor(windowName: string, title: string, isForge: boolean){

        const TRAITS_LINES = 32;

        const window = new UI.StandardWindow({
            standard: {
                header: {text: {text: translate(title)}, height: 60},
                inventory: {standard: true},
                background: {standard: true}
            },
            drawing: [
                {type: "frame", x: 580, y: 0, width: 400, height: 240, bitmap: "tcon.frame", scale: 4},
                {type: "frame", x: 580, y: 260, width: 400, height: 240, bitmap: "tcon.frame", scale: 4}
            ],
            elements: {
                imageBg: {type: "image", x: 50, y: 95, bitmap: "tcon.icon.repair", scale: 18.75},
                slot0: {type: "slot", x: 0, y: 2000, z: 1, size: 80},
                slot1: {type: "slot", x: 0, y: 2000, z: 1, size: 80},
                slot2: {type: "slot", x: 0, y: 2000, z: 1, size: 80},
                slot3: {type: "slot", x: 0, y: 2000, z: 1, size: 80},
                slot4: {type: "slot", x: 0, y: 2000, z: 1, size: 80},
                slot5: {type: "slot", x: 0, y: 2000, z: 1, size: 80},
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

        const loc = window.getWindow("content").getLocation();
        
        window.addWindow("stats", {
            // -14 is mistery (which is actually status bar offset, enable fullscreen!)
            location: {x: loc.x + loc.windowToGlobal(580 + 20), y: loc.y + loc.windowToGlobal(0 + 20), width: loc.windowToGlobal(400 - 40), height: loc.windowToGlobal(240 - 40), scrollY: 250},
            drawing: [
                {type: "background", color: Color.TRANSPARENT}
            ],
            elements: {
                textTitle: {type: "text", x: 500, y: -30, font: {size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true}},
                textStats: {type: "text", x: 20, y: 120, font: {size: 72, color: Color.WHITE, shadow: 0.5}, multiline: true}
            }
        });

        window.addWindow("traits", {
            location: {x: loc.x + loc.windowToGlobal(580 + 20), y: loc.y + loc.windowToGlobal(260 + 20), width: loc.windowToGlobal(400 - 40), height: loc.windowToGlobal(240 - 40), scrollY: 800},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "text", x: 500, y: 50, font: {size: 80, color: Color.YELLOW, shadow: 0.5, alignment: UI.Font.ALIGN_CENTER, bold: true}, text: translate("Traits")}
            ],
            elements: (() => {
                const elems: UI.ElementSet = {};
                for(let i = 0; i < TRAITS_LINES; i++){
                    elems["textTrait" + i] = {type: "text", x: 20, y: 120 + 80 * i, font: {size: 64, color: Color.WHITE, shadow: 0.5}, text: ""}
                }
                return elems;
            })()
        });

        super(windowName, window);

        this.page = 0;
        this.isForge = !!isForge;

        const setTextTraitsLines = (win: UI.WindowGroup, lines: [string, number][]) => {

            const content = win.getWindow("traits")?.getContent();

            if(content){
                let text: UI.UITextElement;
                for(let i = 0; i < TRAITS_LINES; i++){
                    text = content.elements["textTrait" + i] as UI.UITextElement;
                    if(lines[i]){
                        text.text = lines[i][0];
                        text.font.color = lines[i][1];
                    }
                    else{
                        text.text = "";
                    }
                }
            }

        }

        ItemContainer.addClientEventListener(this.name, "changeLayout", (container, win, content, data: ForgeLayout) => {

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

            content.elements.imageBg.bitmap = data.background;

            container.setText("textTitle", translate(data.title));
            container.setText("textStats", addLineBreaks(20, translate(data.intro)));

        });

        ItemContainer.addClientEventListener(this.name, "showInfo", (container, win: UI.WindowGroup, content, data: ForgePageProperties) => {
            const miningTier = MiningLvName[data.miningTier] ?? "Unknown mining tier %s";

            container.setText("textStats", addLineBreaks(20,
                translate("Durability: ") + data.durability + "/" + data.maxDurability + "\n" +
                translate("Mining Tier: ") + translate(miningTier, data.miningTier) + "\n" +
                translate("Mining Speed: ") + data.miningSpeed + "\n" +
                translate("Melee Damage: ") + data.meleeDamage + "\n" +
                translate("Modifiers: ") + data.modifierSlots
            ));

            setTextTraitsLines(win, data.traits.map(t => {
                const trait = Traits[t.key];
                if(trait == null){
                    return [`${translate("Unknown trait %s", t.key)} (${t.level})`, Color.WHITE];
                }
                let name = trait.getLocalizedName(t.level);
                if(trait.parent && trait.parent.maxLevel > 1){
                    let maxLevel = trait.parent.maxLevel;
                    while(maxLevel < t.level){
                        maxLevel += trait.parent.maxLevel;
                    }
                    name += ` (${t.level}/${maxLevel})`
                }
                return [name, trait.color];
            }));

        });

        ItemContainer.addClientEventListener(this.name, "showHammer", (container, win: UI.WindowGroup, content, data: ForgeLayout) => {

            container.setText("textStats", addLineBreaks(20, translate(data.intro)));

            setTextTraitsLines(win, [
                ["       .", Color.GRAY],
                ["     /( _________", Color.GRAY],
                ["     |  >:=========`", Color.GRAY],
                ["     )(  ", Color.GRAY],
                ['     ""', Color.GRAY],
            ]);

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

        if(TconToolFactory.isTool(slotTool.id) && slotTool.extra){

            const slots: ItemInstance[] = [];
            const items: ItemInstance[] = [];
            for(let i = 1; i < 6; i++){
                const slot = container.getSlot("slot" + i);
                slots[i] = {id: slot.id, count: slot.count, data: slot.data};
                if(slot.id === 0){
                    continue;
                }
                const find = items.find(item => item.id === slot.id && item.data === slot.data);
                find ? find.count += slot.count : items.push({id: slot.id, count: slot.count, data: slot.data});
            }

            const addMod: {[key: string]: number} = {};
            for(let key in Modifiers){
                const count = Math.min(...Modifiers[key].getRecipe().map(recipe => {
                    const find2 = items.find(item => item.id === recipe.id && (recipe.data === -1 || item.data === recipe.data));
                    return find2 ? find2.count : 0;
                }));
                if(count > 0){
                    addMod[key] = count;
                }
            }

            const stack = new TconToolStack(slotTool);
            const {modifiers, usedCount, maxCount} = stack.getModifierInfo();
            for(let key in addMod){
                const find3 = modifiers.find(mod => mod.type === key);
                if(find3 && find3.level < Modifiers[key].maxLevel){
                    addMod[key] = Math.min(addMod[key], Modifiers[key].maxLevel - find3.level);
                    find3.level += addMod[key];
                    continue;
                }
                if(Modifiers[key].canBeTogether(modifiers) && usedCount + Modifiers[key].getConsumeSlots() <= maxCount){
                    addMod[key] = Math.min(addMod[key], Modifiers[key].maxLevel);
                    modifiers.push({type: key, level: addMod[key]});
                }
                else{
                    delete addMod[key];
                }
            }

            const space = stack.durability;
            let newDur = space;
            let findRepair: ItemInstance;
            let countRepair = 0;

            for(const item of items){
                const value = stack.calcRepair(item);
                if(value > 0){
                    findRepair = item;
                    while(countRepair < findRepair.count && value * countRepair < space){
                        countRepair++;
                    }
                    newDur = Math.max(0, space - value * countRepair);
                    break;
                }
            }

            const useItems: ItemInstance[] = [];

            for(let key in addMod){
                useItems.push(...Modifiers[key].getRecipe().map(item => ({id: item.id, count: addMod[key], data: item.data})));
            }
            countRepair > 0 && useItems.push({id: findRepair.id, count: countRepair, data: findRepair.data});

            if(useItems.length > 0){

                consume = slots.map(s => {
                    const i = useItems.findIndex(item => item.id === s.id && (item.data === -1 || item.data === s.data));
                    if(i === -1){
                        return 0;
                    }
                    const min = Math.min(s.count, useItems[i].count);
                    useItems[i].count -= min;
                    useItems[i].count <= 0 && useItems.splice(i, 1);
                    return min;
                });
                
                consume[0] = 1;

                let result = stack.clone();
                result.durability = newDur;
                result.extra.putInt("repair", stack.repairCount + 1);
                result.extra.putString("modifiers", TconModifier.encodeToString(modifiers));
                result = new TconToolStack(result);
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
                    partData ? materials.push(partData.material) : alert(translate("Unknown slot type %s", slot.id));
                    consume[i] = 1;
                }
                const stack = TconToolFactory.createToolStack(result.result, materials);
                container.setSlot("slotResult", stack.id, stack.count, stack.data, stack.extra);
            }
            else{
                container.clearSlot("slotResult");
            }

        }

        const slotResult = container.getSlot("slotResult");
        if(TconToolFactory.isTool(slotResult.id) && slotResult.extra){
            this.showInfo(container, slotResult);
        }
        else if(TconToolFactory.isTool(slotTool.id) && slotTool.extra){
            this.showInfo(container, slotTool);
        }
        else{
            const layout = ToolForgeHandler.getLayoutList(this.isForge)[this.page];
            container.sendEvent("showHammer", layout);
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
            if(this.isForge){
                client.send("tcon.playSound", {name: "tcon.anvil_use.ogg", volume: 0.5, pitch: 0.95 + 0.2 * Math.random()});
            }
            else{
                client.send("tcon.playSound", {name: "tcon.little_saw.ogg"});
            }
                
            this.onUpdate(container);
        }

    }

    private turnPage(container: ItemContainer, page: -1 | 0 | 1): void {

        const layouts = ToolForgeHandler.getLayoutList(this.isForge);

        this.page += page;
        this.page = this.page < 0 ? layouts.length - 1 : this.page >= layouts.length ? 0 : this.page;

        const layout = layouts[this.page];
        container.sendEvent("changeLayout", layout);

        this.onUpdate(container);

    }

    private showInfo(container: ItemContainer, item: ItemInstance): void {

        const stack = new TconToolStack(item);
        const modInfo = stack.getModifierInfo();

        container.sendEvent("showInfo", {
            durability: stack.stats.durability - stack.durability,
            maxDurability: stack.stats.durability,
            miningTier: stack.stats.level,
            miningSpeed: (stack.stats.efficiency * 100 | 0) / 100,
            meleeDamage: (stack.stats.damage * 100 | 0) / 100,
            modifierSlots: modInfo.maxCount - modInfo.usedCount,
            traits: stack.traits.map(t => ({key: t.trait.key, level: t.level}))
        } as ForgePageProperties);

    }

}


createBlock("tcon_toolstation", [{name: "Tinker Station"}], "wood");
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

    const winStation = new ToolCrafterWindow("tcon_toolstation", "Tinker Station", false);
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
