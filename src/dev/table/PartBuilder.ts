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

Recipes2.addShapedWith2x2({item: "block:tcon_partbuilder", data: 0}, "a:b", {a: "item:tcon_pattern_blank", b: {item: "log", data: 0}}, "tcon_partbuilder_0");
Recipes2.addShapedWith2x2({item: "block:tcon_partbuilder", data: 1}, "a:b", {a: "item:tcon_pattern_blank", b: {item: "log", data: 1}}, "tcon_partbuilder_1");
Recipes2.addShapedWith2x2({item: "block:tcon_partbuilder", data: 2}, "a:b", {a: "item:tcon_pattern_blank", b: {item: "log", data: 2}}, "tcon_partbuilder_2");
Recipes2.addShapedWith2x2({item: "block:tcon_partbuilder", data: 3}, "a:b", {a: "item:tcon_pattern_blank", b: {item: "log", data: 3}}, "tcon_partbuilder_3");
Recipes2.addShapedWith2x2({item: "block:tcon_partbuilder", data: 4}, "a:b", {a: "item:tcon_pattern_blank", b: {item: "log2", data: 0}}, "tcon_partbuilder_4");
Recipes2.addShapedWith2x2({item: "block:tcon_partbuilder", data: 5}, "a:b", {a: "item:tcon_pattern_blank", b: {item: "log2", data: 1}}, "tcon_partbuilder_5");


class PartBuilder extends TableBase {

    private static readonly window = (() => {

        const tutorial = addLineBreaks(18, "Here you can craft tool parts to fulfill your tinkering fantasies") + "\n\n" + addLineBreaks(18, "To craft a part simply put its pattern into the left slot. The two right slot hold the material you want to craft your part out of.");

        const findPatternchest = (coords: TileEntity) => {
            const nears = StorageInterface.getNearestContainers(coords, -1);
            let tile;
            for(let side in nears){
                tile = nears[side].getParent();
                if(parseInt(side) >= 2 && tile.blockID === BlockID.tcon_patternchest){
                    return tile;
                }
            }
            return null;
        };

        const turnPage = (tile: TileEntity, num: -1 | 1) => {
            const pc = findPatternchest(tile);
            if(pc){
                let list: number[] = pc.getList();
                if(list.length > 0){
                    const slot = tile.container.getSlot("slot0");
                    if(!PatternRegistry.isPattern(slot.id)){
                        return;
                    }
                    const index = PatternChest.getIndex(slot.id);
                    if(slot.id !== 0){
                        if(pc.upFlag(slot.id)){
                            tile.container.clearSlot("slot0");
                            list = pc.getList();
                        }
                        else{
                            const pos = Entity.getPosition(player);
                            tile.container.dropSlot("slot0", pos.x, pos.y, pos.z);
                        }
                    }
                    let page = list.findIndex(i => i === index) + num;
                    if(page < 0){
                        page = list.length - 1;
                    }
                    if(page >= list.length){
                        page = 0;
                    }
                    const id = PatternChest.patterns[list[page]];
                    tile.container.setSlot("slot0", id, 1, 0);
                    pc.downFlag(id);
                }
            }
        };
    
        const elements: UI.UIElementSet = {
            slot0: {type: "slot", x: 200, y: 90, size: 100, isValid: id => PatternRegistry.isPattern(id), bitmap: "tcon.slot.pattern"},
            slot1: {type: "slot", x: 300, y: 90, size: 100, isValid: id => {
                for(let key in Material){
                    if(Material[key].getItem() === id){
                        return true;
                    }
                }
                return false;
            }},
            slotResult: {type: "slot", x: 600, y: 90, size: 100, isValid: () => false, clicker: {
                onClick: (container, tile) => {
                    const slot = container.getSlot("slot1");
                    const recipe = PatternRegistry.getData(container.getSlot("slot0").id);
                    let result: number
                    for(let key in Material){
                        result = 0;
                        if(Material[key].getItem() === slot.id){
                            result = PartRegistry.getIDFromData(recipe.type, key);
                            if(!Material[key].isMetal && result){
                                if(slot.count >= recipe.cost){
                                    slot.count -= recipe.cost;
                                    container.validateSlot("slot1");
                                    Player.addItemToInventory(result, 1, 0);
                                    return;
                                }
                            }
                        }
                    }
                }
            }},
            textCost: {type: "text", x: 650, y: 200, font: {color: Color.GRAY, size: 30, alignment: 1}},
            buttonPrev: {type: "button", x: 144, y: 200, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                onClick: (container, tile) => {
                    turnPage(tile, -1);
                }
            }},
            buttonNext: {type: "button", x: 260, y: 200, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                onClick: (container, tile) => {
                    turnPage(tile, 1);
                }
            }},
            buttonExit: {type: "closeButton", x: 907, y: 18, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 5},
            imageArrow: {type: "image", x: 434, y: 95, bitmap: "tcon.arrow", scale: 6, clicker: {
                onClick: container => {
                    RV && RV.openRecipePage("tcon_partbuilder", container);
                }
            }}
        };
    
        for(let i = 0; i < 36; i++){
            elements["inv" + i] = {
                type: "invSlot",
                x: 50 + (i % 9) * 100,
                y: i < 9 ? 620 : 200 + (i / 9 | 0) * 100,
                size: 100,
                index: i
            }
        }
    
        const window = new UI.Window({
            location: {x: 50, y: 20, width: 600, height: 450},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: 750, bitmap: "classic_frame_bg_light", scale: 6},
                {type: "text", x: 50, y: 60, text: "Part Builder", font: {size: 40}},
                {type: "text", x: 50, y: 290, text: "Inventory", font: {size: 40}}
            ],
            elements: elements
        });
    
        const window2 = new UI.Window({
            location: {x: 650, y: 20, width: 300, height: 450},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: 1500, bitmap: "tcon.frame", scale: 12},
            ],
            elements: {
                textTitle: {type: "text", x: 500, y: 40, font: {size: 80, color: Color.YELLOW, bold: true, alignment: 1}},
                textStats: {type: "text", x: 60, y: 200, font: {size: 70, color: Color.WHITE}, multiline: true}
            }
        });
    
        const elements2 = window2.getElements();
    
        window.addAdjacentWindow(window2);
        window.setInventoryNeeded(true);
        window.setBlockingBackground(true);
    
        window.setEventListener({
            onOpen: win => {
                Threading.initThread("tcon_crafting", () => {
                    try{
                        const container = win.getContainer();
                        let slot: UI.Slot;
                        let recipe: {type: string, cost: number};
                        let result: number;
                        let statsHead: HeadStats;
                        let statsHandle: HandleStats;
                        let statsExtra: ExtraStats;
                        let textCost: string;
                        let textTitle: string;
                        let textStats: string;
                        while(win.isOpened()){
                            slot = container.getSlot("slot1");
                            recipe = PatternRegistry.getData(container.getSlot("slot0").id);
                            result = 0;
                            textCost = "";
                            textTitle = "";
                            textStats = "";
                            if(recipe){
                                for(let key in Material){
                                    result = 0;
                                    if(Material[key].getItem() === slot.id){
                                        statsHead = Material[key].getHeadStats();
                                        statsHandle = Material[key].getHandleStats();
                                        statsExtra = Material[key].getExtraStats();
                                        textTitle = Material[key].getName();
                                        textStats = "Head" + "\n" +
                                                    "Durability: " + statsHead.durability + "\n" +
                                                    "Mining Level: " + TinkersMaterial.level[statsHead.level] + "\n" +
                                                    "Mining Speed: " + statsHead.speed + "\n" +
                                                    "Attack" + statsHead.attack + "\n" +
                                                    "\n" +
                                                    "Handle" + "\n" +
                                                    "Modifier: " + statsHandle.modifier + "\n" +
                                                    "Durability: " + statsHandle.durability + "\n" +
                                                    "\n" +
                                                    "Extra" + "\n" +
                                                    "Durability: " + statsExtra.durability;
                                        if(!Material[key].isMetal){
                                            textCost = `Material Value:  ${slot.count} / ${recipe.cost}`;
                                            if(slot.count >= recipe.cost){
                                                result = PartRegistry.getIDFromData(recipe.type, key);
                                            }
                                        }
                                        break;
                                    }
                                }
                            }
                            container.setText("textCost", textCost);
                            result ? container.setSlot("slotResult", result, 1, 0) : container.clearSlot("slotResult");
                            elements2.get("textTitle").onBindingUpdated("text", textTitle || "Part Builder");
                            elements2.get("textStats").onBindingUpdated("text", textStats || tutorial);
                            Thread.sleep(100);
                        }
                        container.clearSlot("slotResult");
                    }
                    catch(e){
                        alert("PartBuilderError: " + e);
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

    constructor(){
        super(2, 0.46875);
    }

    getGuiScreen(): UI.Window {
        return PartBuilder.window;
    }

    setAnimItem(): void {
        const c = 0.2125;
        this.displayItem([{x: -c, z: -c}, {x: c, z: -c}]);
    }

}


TileEntity.registerPrototype(BlockID.tcon_partbuilder, new PartBuilder());