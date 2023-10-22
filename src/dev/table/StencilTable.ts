createBlock("tcon_stenciltable", [
    {name: "Stencil Table", texture: [0, 0, ["planks", 0]]},
    {name: "Stencil Table", texture: [0, 0, ["planks", 1]]},
    {name: "Stencil Table", texture: [0, 0, ["planks", 2]]},
    {name: "Stencil Table", texture: [0, 0, ["planks", 3]]},
    {name: "Stencil Table", texture: [0, 0, ["planks", 4]]},
    {name: "Stencil Table", texture: [0, 0, ["planks", 5]]}
], "wood");

Item.addCreativeGroup("tcon_stenciltable", "Stencil Table", [BlockID.tcon_stenciltable]);

BlockModel.register(BlockID.tcon_stenciltable, (model, index) => {
    model.addBox( 0/16, 12/16,  0/16,  16/16, 16/16, 16/16, [["planks", index], ["tcon_stenciltable", 0], ["tcon_table_side", 0]]);
    model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, "planks", index);
    model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, "planks", index);
    model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, "planks", index);
    model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, "planks", index);
    return model;
}, 6);

Recipes2.addShaped({id: BlockID.tcon_stenciltable, data: 0}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "planks", data: 0}});
Recipes2.addShaped({id: BlockID.tcon_stenciltable, data: 1}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "planks", data: 1}});
Recipes2.addShaped({id: BlockID.tcon_stenciltable, data: 2}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "planks", data: 2}});
Recipes2.addShaped({id: BlockID.tcon_stenciltable, data: 3}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "planks", data: 3}});
Recipes2.addShaped({id: BlockID.tcon_stenciltable, data: 4}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "planks", data: 4}});
Recipes2.addShaped({id: BlockID.tcon_stenciltable, data: 5}, "a:b", {a: ItemID.tcon_pattern_blank, b: {id: "planks", data: 5}});


class StencilTable extends TableBase {

    private static readonly window = (() => {

        const elements: UI.UIElementSet = {
            slot0: {type: "slot", x: 300, y: 90, size: 100, isValid: id => id === ItemID.tcon_pattern_blank},
            slotResult: {type: "slot", x: 600, y: 90, size: 100, isValid: () => false, clicker: {
                onClick: (container, tile) => {
                    const source = container.getSlot("slot0");
                    if(source.id === ItemID.tcon_pattern_blank){
                        source.count--;
                        container.validateSlot("slot0");
                        Player.addItemToInventory(PatternChest.patterns[tile.data.page], 1, 0);
                    }
                }
            }},
            buttonPrev: {type: "button", x: 544, y: 200, bitmap: "_button_prev_48x24", bitmap2: "_button_prev_48x24p", scale: 2, clicker: {
                onClick: (container, tile) => {
                    if(--tile.data.page < 0){
                        tile.data.page = PatternChest.patterns.length - 1;
                    }
                }
            }},
            buttonNext: {type: "button", x: 660, y: 200, bitmap: "_button_next_48x24", bitmap2: "_button_next_48x24p", scale: 2, clicker: {
                onClick: (container, tile) => {
                    if(++tile.data.page >= PatternChest.patterns.length){
                        tile.data.page = 0;
                    }
                }
            }},
            buttonExit: {type: "closeButton", x: 907, y: 18, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 5}
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
            location: {x: 200, y: 20, width: 600, height: 450},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: 750, bitmap: "classic_frame_bg_light", scale: 6},
                {type: "text", x: 50, y: 60, text: "Stencil Table", font: {size: 40}},
                {type: "text", x: 50, y: 290, text: "Inventory", font: {size: 40}},
                {type: "bitmap", x: 434, y: 95, bitmap: "tcon.arrow", scale: 6}
            ],
            elements: elements
        });

        window.setInventoryNeeded(true);
        window.setBlockingBackground(true);

        window.setEventListener({
            onOpen: win => {
                Threading.initThread("tcon_crafting", () => {
                    try{
                        const container = win.getContainer();
                        const tile = container.getParent();
                        while(win.isOpened()){
                            if(container.getSlot("slot0").id === ItemID.tcon_pattern_blank){
                                container.setSlot("slotResult", PatternChest.patterns[tile.data.page], 1, 0);
                            }
                            else{
                                container.clearSlot("slotResult");
                                tile.data.page = 0;
                            }
                            Thread.sleep(100);
                        }
                        container.clearSlot("slotResult");
                    }
                    catch(e){
                        alert("StencilTableError: " + e);
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
        super(1, 14/16);
    }

    defaultValues = {
        meta: 0,
        page: 0
    };

    getGuiScreen(): UI.Window {
        return StencilTable.window;
    }

    setAnimItem(): void {
        this.displayItem([{x: 0, z: 0}]);
    }

}


TileEntity.registerPrototype(BlockID.tcon_stenciltable, new StencilTable());