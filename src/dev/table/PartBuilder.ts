createBlock("tcon_partbuilder", [
    {name: "Part Builder", texture: [0, 0, ["log_side", 0]]},
    {name: "Part Builder", texture: [0, 0, ["log_side", 1]]},
    {name: "Part Builder", texture: [0, 0, ["log_side", 2]]},
    {name: "Part Builder", texture: [0, 0, ["log_side", 3]]},
    {name: "Part Builder", texture: [0, 0, ["log2", 0]]},
    {name: "Part Builder", texture: [0, 0, ["log2", 2]]}
], "wood");

Item.addCreativeGroup("tcon_partbuilder", "Part Builder", [BlockID.tcon_partbuilder]);

BlockModel.register(BlockID.tcon_partbuilder, (model, index) => {
    const tex = index <= 3 ? "log_side" : "log2";
    const meta = index <= 3 ? index : (index - 4) * 2;
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [[tex, meta], ["tcon_partbuilder", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, tex, meta);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, tex, meta);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, tex, meta);
    return model;
}, 6);

Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 0}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 1}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 1}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 1}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 2}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 2}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 3}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log", data: 3}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 4}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log2", data: 0}});
Recipes2.addShaped({id: BlockID.tcon_partbuilder, data: 5}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "log2", data: 1}});


const PartBuilderWindow = new class extends CraftingWindow {

    selectedPattern: number;
    tutorialMessage: string;

    constructor(){

        const elements: UI.ElementSet = {
            slotPattern: {type: "slot", x: 8, y: 136 - 36, bitmap: "tcon.slot.pattern", size: 72, isValid: id => id === ItemID.tcon_pattern_blank},
            slotMaterial: {type: "slot", x: 80, y: 136 - 36, size: 72},
            slotResult: {type: "slot", x: 440, y: 136 - 52, size: 104, visual: true, clicker: {onClick: () => this.onCraft()}},
            cursor: {type: "image", x: 0, y: 2000, z: 1, width: 64, height: 64, bitmap: "_selection"},
            textCost: {type: "text", x: 288, y: 300, font: {size: 24, color: Color.GRAY, alignment: UI.Font.ALIGN_CENTER}},
            textTitle: {type: "text", x: 780, y: 4, font: {size: 32, color: Color.YELLOW, bold: true, alignment: UI.Font.ALIGN_CENTER}, text: "Title"},
            textStats: {type: "text", x: 608, y: 64, font: {size: 24, color: Color.WHITE}, multiline: true, text: "Description"}
        };

        for(let i = 0; i < PartRegistry.types.length; i++){
            elements["btn" + i] = {
                type: "button",
                x: (i % 4) * 64 + 160,
                y: (i / 4 | 0) * 64 + 8,
                bitmap: "tcon.pattern." + PartRegistry.types[i].key,
                scale: 4,
                clicker: {onClick: () => {
                    this.selectedPattern = i;
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

        window.setCloseOnBackPressed(true);

        super(window);
        this.selectedPattern = -1;
        this.tutorialMessage = addLineBreaks(18, "Here you can craft tool parts to fulfill your tinkering fantasies") + "\n\n" + addLineBreaks(18, "To craft a part simply put its pattern into the left slot. The two right slot hold the material you want to craft your part out of.");

    }

    override onUpdate(elements: java.util.HashMap<string, UI.Element>): void {

        const patternData = PartRegistry.types[this.selectedPattern];
        const slotPattern = this.container.getSlot("slotPattern");
        const slotMaterial = this.container.getSlot("slotMaterial");
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
                                "Mining Level: " + TinkersMaterial.level[statsHead.level] + "\n" +
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

        if(this.selectedPattern === -1){
            elements.get("cursor").setPosition(0, 2000);
        }
        else{
            const selectedElem = elements.get("btn" + this.selectedPattern);
            elements.get("cursor").setPosition(selectedElem.x, selectedElem.y);
        }

        elements.get("slotResult").setBinding("source", resultId === 0 ? {id: 0, count: 0, data: 0} : {id: resultId, count: 1, data: 0});
        this.container.setText("textCost", textCost);
        this.container.setText("textTitle", textTitle || "Part Builder");
        this.container.setText("textStats", textStats || this.tutorialMessage);

    }

    private onCraft(): void {

        const patternData = PartRegistry.types[this.selectedPattern];
        const slotPattern = this.container.getSlot("slotPattern");
        const slotMaterial = this.container.getSlot("slotMaterial");
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
            Player.addItemToInventory(resultId, 1, 0);
            slotPattern.count--;
            slotMaterial.count -= cost;
            this.container.validateAll();
        }

    }

}


PartBuilderWindow.setTargetBlock(BlockID.tcon_partbuilder);
