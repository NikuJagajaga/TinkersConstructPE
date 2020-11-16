/*
0: top
1: side
2: front
3: d-side
4: d-front
*/


class PatternChest extends TileBase {

    static readonly patterns = [
        ItemID.tcon_pattern_pickaxe,
        ItemID.tcon_pattern_shovel,
        ItemID.tcon_pattern_axe,
        ItemID.tcon_pattern_broadaxe,
        ItemID.tcon_pattern_sword,
        ItemID.tcon_pattern_hammer,
        ItemID.tcon_pattern_excavator,
        ItemID.tcon_pattern_rod,
        ItemID.tcon_pattern_rod2,
        ItemID.tcon_pattern_binding,
        ItemID.tcon_pattern_binding2,
        ItemID.tcon_pattern_guard,
        ItemID.tcon_pattern_largeplate
    ];

    private static readonly mask: {[id: number]: number} = (() => {
        const obj = {};
        PatternChest.patterns.forEach((pattern, i) => {
            obj[pattern] = 1 << i;
        });
        return obj;
    })();

    static getIndex(id: number): number {
        if(id in PatternChest.mask){
            let i = 0;
            while(PatternChest.mask[id] >> i & ~1){
                i++;
            }
            return i;
        }
        return -1;
    }

    private static readonly window = (() => {

        const elementSet: UI.UIElementSet = {
            buttonExit: {type: "closeButton", x: 907, y: 18, bitmap: "classic_close_button", bitmap2: "classic_close_button_down", scale: 5}
        };

        const window = new UI.Window({
            location: {x: 200, y: 20, width: 600, height: 300},
            drawing: [
                {type: "background", color: Color.TRANSPARENT},
                {type: "frame", x: 0, y: 0, width: 1000, height: 500, bitmap: "classic_frame_bg_light", scale: 6},
                {type: "text", x: 50, y: 60, text: "Pattern Chest", font: {size: 40}},
            ],
            elements: elementSet
        });

        let i = 0;
        for(let id in PatternChest.mask){
            elementSet["slot" + id] = {
                type: "slot",
                x: 50 + (i % 9) * 100,
                y: 100 + (i / 9 | 0) * 100,
                size: 100,
                visual: true,
                isDarkenAtZero: false,
                source: {id: 0, count: 0, data: 0},
                clicker: {
                    onClick: (container, tile) => {
                        if(tile.downFlag(id)){
                            window.getElements().get("slot" + id).onBindingUpdated("source", {id: 0, count: 0, data: 0});
                            Player.addItemToInventory(parseInt(id), 1, 0);
                        }
                    }
                }
            }
            i++;
        }

        window.setBlockingBackground(true);

        window.setEventListener({
            onOpen: win => {
                const elements = win.getElements();
                const container = win.getContainer();
                const tile = container.getParent();
                for(let id in PatternChest.mask){
                    elements.get("slot" + id).onBindingUpdated("source", {id: tile.isExist(id) ? parseInt(id) : 0, count: 0, data: 0});
                }
            }
        });

        return window;

    })();

    defaultValues = {
        mask: 0
    };

    init(): void {
        delete this.liquidStorage;
    }

    isExist(id: number | string): boolean {
        return !!(this.data.mask & PatternChest.mask[id]);
    }

    getList(): number[] {
        const array: number[] = [];
        for(let i = 0; i < PatternChest.patterns.length; i++){
            this.data.mask >> i & 1 && array.push(i);
        }
        array.sort((a, b) => a - b);
        return array;
    }

    upFlag(id: number | string): boolean {
        if(this.isExist(id)){
            return false;
        }
        this.data.mask |= PatternChest.mask[id];
        return true;
    }

    downFlag(id: number | string): boolean {
        if(this.isExist(id)){
            this.data.mask &= ~PatternChest.mask[id];
            return true;
        }
        return false;
    }

    click(id: number, count: number, data: number): boolean {
        if(id in PatternChest.mask){
            if(Entity.getSneaking(player)){
                let inv: ItemInstance;
                for(let i = 0; i < 36; i++){
                    inv = Player.getInventorySlot(i);
                    if(inv.id in PatternChest.mask && this.upFlag(inv.id)){
                        if(--inv.count <= 0){
                            inv.id = inv.data = 0;
                        }
                        Player.setInventorySlot(i, inv.id, inv.count, inv.data);
                    }
                }
                return true;
            }
            this.upFlag(id) ? Player.decreaseCarriedItem() : Game.tipMessage("already has this pattern inside");
            return true;
        }
        return false;
    }

    getGuiScreen(): UI.Window {
        return PatternChest.window;
    }

    destroyBlock(): void {
        let extra: ItemExtraData;
        if(this.data.mask){
            extra = new ItemExtraData();
            extra.putInt("mask", this.data.mask);
        }
        World.drop(this.x + 0.5, this.y, this.z + 0.5, this.blockID, 1, World.getBlock(this.x, this.y, this.z).data, extra);
    }

}


createBlock("tcon_patternchest", [{name: "Pattern Chest", texture: [["itemframe_background", 0]]}]);
Recipes2.addShapedWith2x2("block:tcon_patternchest", "a:b", {a: "item:tcon_pattern_blank", b: "chest"});
Block.setShape(BlockID.tcon_patternchest, 0, 0, 0, 1, 14/16, 1);
Block.registerDropFunction(BlockID.tcon_patternchest, () => []);

Block.registerPlaceFunction(BlockID.tcon_patternchest, (coords, item, block) => {
    const c = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
    World.setBlock(c.x, c.y, c.z, item.id, item.data);
    const tile = World.addTileEntity(c.x, c.y, c.z);
    if(item.extra){
        tile.data.mask = item.extra.getInt("mask");
    }
});

TileEntity.registerPrototype(BlockID.tcon_patternchest, new PatternChest());