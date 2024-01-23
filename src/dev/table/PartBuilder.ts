Item.addCreativeGroup("tcon_partbuilder", "Part Builder", [
    createBlock("tcon_partbuilder0", [{name: "Part Builder", texture: [0, 0, ["log_side", 0]]}], "wood"),
    createBlock("tcon_partbuilder1", [{name: "Part Builder", texture: [0, 0, ["log_side", 1]]}], "wood"),
    createBlock("tcon_partbuilder2", [{name: "Part Builder", texture: [0, 0, ["log_side", 2]]}], "wood"),
    createBlock("tcon_partbuilder3", [{name: "Part Builder", texture: [0, 0, ["log_side", 3]]}], "wood"),
    createBlock("tcon_partbuilder4", [{name: "Part Builder", texture: [0, 0, ["log2", 0]]}], "wood"),
    createBlock("tcon_partbuilder5", [{name: "Part Builder", texture: [0, 0, ["log2", 2]]}], "wood")
]);

BlockModel.register(BlockID.tcon_partbuilder0, (model, index) => {
    const tex = "log_side";
    const meta = 0;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder1, (model, index) => {
    const tex = "log_side";
    const meta = 1;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder2, (model, index) => {
    const tex = "log_side";
    const meta = 2;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder3, (model, index) => {
    const tex = "log_side";
    const meta = 3;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder4, (model, index) => {
    const tex = "log2";
    const meta = 0;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
});
BlockModel.register(BlockID.tcon_partbuilder5, (model, index) => {
    const tex = "log2";
    const meta = 2;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
});

Recipes2.addShaped(BlockID.tcon_partbuilder0, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 0}});
Recipes2.addShaped(BlockID.tcon_partbuilder1, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 1}});
Recipes2.addShaped(BlockID.tcon_partbuilder2, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 2}});
Recipes2.addShaped(BlockID.tcon_partbuilder3, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 3}});
Recipes2.addShaped(BlockID.tcon_partbuilder4, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log2", data: 0}});
Recipes2.addShaped(BlockID.tcon_partbuilder5, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log2", data: 1}});


const PartBuilderWindow = new class extends CraftingWindow {

    selectedPattern = -1;

    constructor(){

        const elements: UI.ElementSet = {
            slotPattern: {type: "slot", x: 8, y: 136 - 36, bitmap: "tcon.slot.pattern", size: 72},
            slotMaterial: {type: "slot", x: 80, y: 136 - 36, size: 72},
            slotResult: {type: "slot", x: 440, y: 136 - 52, size: 104, visual: true, clicker: {onClick: (_, container: ItemContainer) => container.sendEvent("craft", {})}},
            cursor: {type: "image", x: 0, y: 2000, z: 1, width: 64, height: 64, bitmap: "_selection"},
            textCost: {type: "text", x: 288, y: 300, font: {size: 24, color: Color.GRAY, alignment: UI.Font.ALIGN_CENTER}},
            textTitle: {type: "text", x: 780, y: 4, font: {size: 32, color: Color.YELLOW, bold: true, alignment: UI.Font.ALIGN_CENTER}, text: "Title"},
            textStats: {type: "text", x: 608, y: 64, font: {size: 24, color: Color.WHITE}, multiline: true, text: "Description"},
            btnR: {type: "button", x: 440 + 104 - 36, y: 136 + 52 + 24, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: 2, clicker: {onClick: () => RV?.RecipeTypeRegistry.openRecipePage("tcon_partbuilder")}},
            textR: {type: "text", x: 440 + 104 - 22, y: 136 + 52 + 18, z: 1, text: "R", font: {color: Color.WHITE, size: 20, shadow: 0.5, align: UI.Font.ALIGN_CENTER}}
        };

        for(let i = 0; i < PartRegistry.types.length; i++){
            elements["btn" + i] = {
                type: "button",
                x: (i % 4) * 64 + 160,
                y: (i / 4 | 0) * 64 + 8,
                bitmap: "tcon.pattern." + PartRegistry.types[i].key,
                scale: 4,
                clicker: {onClick: (_, container: ItemContainer) => {
                    container.sendEvent("select", {index: i});
                }}
            };
        }

        const window = new UI.StandardWindow({
            standard: {
                header: {text: {text: "Part Builder"}, height: 60},
                inventory: {standard: true},
                background: {standard: true}
            },
            drawing: [
                {type: "frame", x: 580, y: 0, width: 400, height: 480, bitmap: "tcon.frame", scale: 4}
            ],
            elements: elements
        });

        super("tcon_partbuilder", window);

        ItemContainer.addClientEventListener(this.name, "refresh", (container, win, content, data: {result: number, index: number}) => {
            const elems = window.getElements();
            elems.get("slotResult").setBinding("source", data.result === 0 ? {id: 0, count: 0, data: 0} : {id: Network.serverToLocalId(data.result), count: 1, data: 0});
            if(data.index === -1){
                elems.get("cursor")?.setPosition(0, 2000);
            }
            else{
                const selectedElem = elems.get("btn" + data.index);
                elems.get("cursor")?.setPosition(selectedElem.x, selectedElem.y);
            }
        });

    }

    override addServerEvents(container: ItemContainer): void {

        container.addServerEventListener("select", (con, client, data: {index: number}) => {
            this.selectedPattern = data.index;
            this.onUpdate(con);
        });

        container.addServerEventListener("craft", (con, client, data) => this.onCraft(con, client));

    }

    autoSetPattern(container: ItemContainer, player: number): void {
        const slotPattern = container.getSlot("slotPattern");
        if(slotPattern.isEmpty()){
            const actor = new PlayerActor(player);
            let inv: ItemInstance;
            for(let i = 0; i < 36; i++){
                inv = actor.getInventorySlot(i);
                if(inv.id === ItemID.tcon_pattern_blank){
                    slotPattern.set(inv.id, inv.count, inv.data, inv.extra);
                    slotPattern.markDirty();
                    container.sendChanges();
                    actor.setInventorySlot(i, 0, 0, 0, null);
                    break;
                }
            }
        }
    }

    override isValidAddTransfer(container: ItemContainer, slotName: string, id: number, amount: number, data: number, extra: ItemExtraData, player: number): boolean {
        switch(slotName){
            case "slotPattern":
                if(id === ItemID.tcon_pattern_blank) return true;
                break;
            case "slotMaterial":
                let item: Tile;
                for(let key in Material){
                    item = Material[key].getItem();
                    if(item && id === item.id && (item.data === -1 || data === item.data)){
                        this.autoSetPattern(container, player);
                        return true;
                    }
                }
                break;
        }
        return false;
    }

    override isValidGetTransfer(container: ItemContainer, slotName: string, id: number, amount: number, data: number, extra: ItemExtraData, player: number): boolean {
        if(slotName === "slotResult") return false;
        return true;
    }

    override onUpdate(container: ItemContainer): void {

        const patternData = PartRegistry.types[this.selectedPattern];
        const slotPattern = container.getSlot("slotPattern");
        const slotMaterial = container.getSlot("slotMaterial");
        let item: Tile;
        let statsHead: HeadStats;
        let statsHandle: HandleStats;
        let statsExtra: ExtraStats;
        let resultId = 0;
        let textCost = "";
        let textTitle = "";
        let textStats = "";

        if(slotPattern.id === ItemID.tcon_pattern_blank && patternData){

            for(let key in Material){
                item = Material[key].getItem();
                if(item && item.id === slotMaterial.id && (item.data === -1 || item.data === slotMaterial.data)){
                    statsHead = Material[key].getHeadStats();
                    statsHandle = Material[key].getHandleStats();
                    statsExtra = Material[key].getExtraStats();
                    textTitle = Material[key].getName();
                    textStats = "Head\n" +
                                "Durability: " + statsHead.durability + "\n" +
                                "Mining Level: " + MiningLvName[statsHead.level] + "\n" +
                                "Mining Speed: " + statsHead.speed + "\n" +
                                "Attack" + statsHead.attack + "\n" +
                                "\n" +
                                "Handle\n" +
                                "Modifier: " + statsHandle.modifier + "\n" +
                                "Durability: " + statsHandle.durability + "\n" +
                                "\n" +
                                "Extra\n" +
                                "Durability: " + statsExtra.durability;
                    if(!Material[key].isMetal){
                        textCost = `Material Value:  ${slotMaterial.count} / ${patternData.cost}`;
                        if(slotMaterial.count >= patternData.cost){
                            resultId = PartRegistry.getIDFromData(patternData.key, key);
                        }
                    }
                    break;
                }
            }

        }

        container.setText("textCost", textCost);
        container.setText("textTitle", textTitle || "Part Builder");
        container.setText("textStats", textStats || addLineBreaks(18, "Here you can craft tool parts to fulfill your tinkering fantasies") + "\n\n" + addLineBreaks(18, "To craft a part simply put its pattern into the left slot. The two right slot hold the material you want to craft your part out of."));
        container.sendChanges();
        container.sendEvent("refresh", {result: resultId, index: this.selectedPattern});

    }

    onCraft(container: ItemContainer, client: NetworkClient): void {

        const patternData = PartRegistry.types[this.selectedPattern];
        const slotPattern = container.getSlot("slotPattern");
        const slotMaterial = container.getSlot("slotMaterial");
        let item: Tile;
        let cost = 0;
        let resultId = 0;

        if(slotPattern.id === ItemID.tcon_pattern_blank && patternData){
            cost = patternData.cost;
            for(let key in Material){
                item = Material[key].getItem();
                if(item && item.id === slotMaterial.id && (item.data === -1 || item.data === slotMaterial.data)){
                    if(!Material[key].isMetal){
                        if(slotMaterial.count >= cost){
                            resultId = PartRegistry.getIDFromData(patternData.key, key);
                        }
                    }
                    break;
                }
            }
        }

        if(resultId !== 0){
            const actor = new PlayerActor(client.getPlayerUid());
            actor.addItemToInventory(resultId, 1, 0, null, true);
            slotPattern.count--;
            slotMaterial.count -= cost;
            container.markAllSlotsDirty();
            container.validateAll();
            container.sendChanges();
            client.send("tcon.playSound", {name: "tcon.little_saw.ogg"});
        }

        this.onUpdate(container);

    }

}


PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder0);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder1);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder2);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder3);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder4);
PartBuilderWindow.addTargetBlock(BlockID.tcon_partbuilder5);
