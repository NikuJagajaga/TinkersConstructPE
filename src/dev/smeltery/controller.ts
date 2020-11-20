createBlock("tcon_smeltery", [{name: "Smeltery Controller", texture: [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 0], ["tcon_stone", 3], ["tcon_stone", 3]]}]);
registerRotationModel("tcon_smeltery",
    [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], 0, ["tcon_stone", 3], ["tcon_stone", 3]],
    [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], 1, ["tcon_stone", 3], ["tcon_stone", 3]]
);
Recipes2.addShaped(BlockID.tcon_smeltery, "aaa:a_a:aaa", {a: ItemID.tcon_brick});


class SmelteryHandler {

    private static blocks = {
        [BlockID.tcon_stone]: true,
        [BlockID.tcon_seared_glass]: true,
        [BlockID.tcon_drain]: true,
        [BlockID.tcon_tank]: true,
        [BlockID.tcon_smeltery]: true
    };

    private static elements: UI.UIElementSet = {
            line: {type: "image", x: 93 * SCALE, y: 11 * SCALE, z: 1, bitmap: "tcon.smeltery_line", scale: SCALE},
            slot0: {type: "slot", x: 24 * SCALE, y: 10 * SCALE, size: 18 * SCALE/*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/},
            slot1: {type: "slot", x: 24 * SCALE, y: 28 * SCALE, size: 18 * SCALE/*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/},
            slot2: {type: "slot", x: 24 * SCALE, y: 46 * SCALE, size: 18 * SCALE/*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/},
            gauge0: {type: "scale", x: 21 * SCALE, y: 11 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
            gauge1: {type: "scale", x: 21 * SCALE, y: 29 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
            gauge2: {type: "scale", x: 21 * SCALE, y: 47 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
            //scaleLava: {type: "scale", x: 161 * SCALE, y: 11 * SCALE, width: 12 * SCALE, height: 52 * SCALE, bitmap: "_liquid_lava_texture_0", direction: 1},
            buttonSelect: {type: "button", x: 130 * SCALE, y: 70 * SCALE, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: SCALE, clicker: {
                onClick: (container, tile) => {
                    tile.data.select++;
                    tile.data.select %= Object.keys(tile.liquidStorage.liquidAmounts).length;
                }
            }},
            buttonDump: {type: "button", x: 92 * SCALE, y: 70 * SCALE, bitmap: "_craft_button_up", bitmap2: "_craft_button_down", scale: SCALE / 2, clicker: {
                onClick: (container, tile) => {
                    const liquids = tile.liquidStorage.liquidAmounts;
                    delete liquids[Object.keys(liquids)[tile.data.select]];
                    tile.data.select %= Object.keys(liquids).length;
                }
            }},
            iconSelect: {type: "image", x: 131.6 * SCALE, y: 71.6 * SCALE, z: 1, bitmap: "mod_browser_update_icon", scale: SCALE * 0.8},
            textDump: {type: "text", x: 104 * SCALE, y: 68 * SCALE, z: 1, text: "Dump", font: {size: 30, color: Color.WHITE, shadow: 0.5, alignment: 1}},
            textLiquid: {type: "text", x: 150 * SCALE, y: 50 * SCALE, font: {size: 30, color: Color.WHITE, shadow: 0.5}, multiline: true}
        };

    private static window = new UI.StandardWindow({
        standart: {
            header: {text: {text: "Smeltery"}},
            inventory: {standart: true},
            background: {standart: true}
        },
        drawing: [
            {type: "frame", x: 20 * SCALE, y: 10 * SCALE, width: 18 * SCALE, height: 18 * SCALE, bitmap: "classic_slot", scale: SCALE},
            {type: "frame", x: 20 * SCALE, y: 28 * SCALE, width: 18 * SCALE, height: 18 * SCALE, bitmap: "classic_slot", scale: SCALE},
            {type: "frame", x: 20 * SCALE, y: 46 * SCALE, width: 18 * SCALE, height: 18 * SCALE, bitmap: "classic_slot", scale: SCALE},
            {type: "frame", x: 92 * SCALE, y: 10 * SCALE, width: 54 * SCALE, height: 54 * SCALE, bitmap: "classic_slot", scale: SCALE},
            //{type: "frame", x: 160 * SCALE, y: 10 * SCALE, width: 14 * SCALE, height: 54 * SCALE, bitmap: "classic_slot", scale: SCALE},
            {type: "bitmap", x: 56 * SCALE, y: 30 * SCALE, bitmap: "tcon.arrow", scale: SCALE}
        ],
        elements: SmelteryHandler.elements
    });

    static getWindow(): UI.StandardWindow {
        return this.window;
    }

    static getHeatFactor(): number {
        return 8;
    }

    static isValidBlock(id: number): boolean {
        return this.blocks[id];
    }

    static updateScale(): void {
        if(this.window.isOpened()){
            const container = this.window.getContainer();
            const tile = container.getParent();
            const liquids = tile.liquidStorage.liquidAmounts;
            const capacity = tile.getLiquidCapacity();
            const liqArray = tile.getLiquidArray();
            let key: string;
            let y = 11;
            for(let i = 0; i < liqArray.length; i++){
                key = "liquid-" + liqArray[i];
                this.elements[key] = this.elements[key] || {type: "scale", x: 93 * SCALE, y: 11 * SCALE, width: 52 * SCALE, height: 52 * SCALE, direction: 1, pixelate: true};
                this.elements[key].y = y * SCALE;
                tile.liquidStorage.updateUiScale(key, liqArray[i]);
                y -= liquids[liqArray[i]] / capacity * 52;
            }
            let split: string[];
            for(key in this.elements){
                split = key.split("-");
                if(split[0] === "liquid" && !liquids[split[1]]){
                    container.setScale(key, 0);
                }
            }
            container.setText("textLiquid", liqArray[0] ? LiquidRegistry.getLiquidName(liqArray[0]) + "\n" + liquids[liqArray[0]] + " mB" : "");
        }
    }

}


class SmelteryControler extends TileBase {

    render: any;
    anim: any;

    area: {from: Vector, to: Vector};

    tanks: TileEntity[] = [];

    defaultValues = {
        meta: 0,
        select: 0,
        temp: 0,
        fuel: 0,
        heat0: 0,
        heat1: 0,
        heat2: 0,
        isActive: false
    };

    getGuiScreen(): UI.StandardWindow {
        return SmelteryHandler.getWindow();
    }

    setModel(): void {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta + (this.data.isActive ? 4 : 0));
    }

    setActive(active: boolean): void {
        if(this.data.isActive !== active){
            this.data.isActive = active;
            this.setModel();
        }
    }

    init(): void {
        this.area = {
            from: {x: 0, y: 0, z: 0},
            to: {x: 0, y: 0, z: 0}
        };
        this.data.isActive = this.checkStructure();
        this.render = new Render();
        this.anim = new Animation.Base(this.x, this.y, this.z);
        this.anim.describe({render: this.render.getID(), skin: "model/tcon_liquids.png"});
        this.anim.load();
        this.anim.setSkylightMode();
        this.setModel();
        this.setAnim();
    }

    destroy(): void {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        this.anim && this.anim.destroy();
    }

    searchWall(coords: Vector, axis: "x" | "z", dir: -1 | 1): number {
        const pos = {x: coords.x, y: coords.y, z: coords.z};
        let i: number;
        let block: number;
        for(i = 0; i < 16; i++){
            pos[axis] += dir;
            block = World.getBlockID(pos.x, pos.y, pos.z);
            if(block === 0){
                continue;
            }
            return SmelteryHandler.isValidBlock(block) ? (i + 1) * dir : 0;
        }
        return 0;
    }

    checkStructure(): boolean {
        const pos: Vector = {x: this.x, y: this.y, z: this.z};
        pos[this.data.meta >> 1 ? "x" : "z"] += this.data.meta & 1 ? -1 : 1;
        if(World.getBlockID(pos.x, pos.y, pos.z) !== 0){
            return false;
        }
        const x1 = this.searchWall(pos, "x", -1);
        const x2 = this.searchWall(pos, "x", 1);
        const z1 = this.searchWall(pos, "z", -1);
        const z2 = this.searchWall(pos, "z", 1);
        if(x1 === 0 || x2 === 0 || z1 === 0 || z2 === 0){
            return false;
        }
        const from = {x: pos.x + x1, z: pos.z + z1};
        const to = {x: pos.x + x2, z: pos.z + z2};
        let x: number;
        let z: number;
        for(x = from.x + 1; x <= to.x - 1; x++){
        for(z = from.z + 1; z <= to.z - 1; z++){
            if(World.getBlockID(x, this.y - 1, z) !== BlockID.tcon_stone){
                return false;
            }
        }
        }
        const tanks: TileEntity[] = [];
        let y: number;
        let block: number;
        let tile: TileEntity;
        loop:
        for(y = this.y; y < 256; y++){
        for(x = from.x; x <= to.x; x++){
        for(z = from.z; z <= to.z; z++){
            if(x === from.x && z === from.z || x === to.x && z === from.z || x === from.x && z === to.z || x === to.x && z === to.z){
                continue;
            }
            block = World.getBlockID(x, y, z);
            if(from.x < x && x < to.x && from.z < z && z < to.z){
                if(block !== 0){
                    break loop;
                }
                continue;
            }
            if(!SmelteryHandler.isValidBlock(block)){
                break loop;
            }
            tile = World.getTileEntity(x, y, z);
            if(tile){
                switch(tile.blockID){
                    case BlockID.tcon_tank: tanks.push(tile); break;
                    case BlockID.tcon_drain: tile.setController(this); break;
                    case BlockID.tcon_smeltery:
                        if(tile.x !== this.x || tile.y !== this.y || tile.z !== this.z){
                            return false;
                        }
                        break;
                }
            }
        }
        }
        }
        if(y === this.y || tanks.length === 0){
            return false;
        }
        this.area.from.x = from.x;
        this.area.from.y = this.y - 1;
        this.area.from.z = from.z;
        this.area.to.x = to.x;
        this.area.to.y = y - 1;
        this.area.to.z = to.z;
        this.tanks = tanks;
        return true;
    }

    getItemCapacity(): number {
        return (this.area.to.x - this.area.from.x - 1) * (this.area.to.y - this.area.from.y) * (this.area.to.z - this.area.from.z - 1);
    }

    getLiquidCapacity(): number {
        return this.getItemCapacity() * MatValue.INGOT * 8;
    }

    totalLiquidAmount(): number {
        const liquids = this.liquidStorage.liquidAmounts;
        let amount = 0;
        for(let key in liquids){
            if(liquids[key] <= 0){
                delete liquids[key];
                continue;
            }
            amount += liquids[key];
        }
        return amount;
    }

    getLiquidArray(): string[] {
        const liquids = this.liquidStorage.liquidAmounts;
        const array = Object.keys(liquids).filter(liq => liquids[liq] > 0);
        for(let i = 0; i < this.data.select; i++){
            array.push(array.shift());
        }
        return array;
    }

    tick(): void {

        const tick = World.getThreadTime();

        const liquids = this.liquidStorage.liquidAmounts;
        const total = this.totalLiquidAmount();
        const capacity = this.getItemCapacity();
        const liquidCapacity = this.getLiquidCapacity();
        const isOpened = this.container.isOpened();

        SmelteryHandler.updateScale();
        this.liquidStorage.setLimit(null, Math.max(0, liquidCapacity));

        if((tick & 63) === 0){
            this.setActive(this.checkStructure());
            this.setAnim();
            this.data.isActive && this.spawnParticle();
        }

        if(!this.data.isActive){
            return;
        }

        if(Cfg.checkInsideSmeltery && tick % 20 === 0){
            this.interactWithEntitiesInside();
        }

        if((tick & 3) === 0){
            AlloyRecipe.alloyAlloys(liquids, this.liquidStorage);
        }

        if(this.data.fuel <= 0){
            let fuelData: {duration: number, temp: number};
            for(let i = 0; i < this.tanks.length; i++){
                if(this.tanks[i] && this.tanks[i].isLoaded && this.tanks[i].consumeFuel){
                    fuelData = this.tanks[i].consumeFuel();
                    if(fuelData){
                        this.data.fuel = fuelData.duration;
                        this.data.temp = fuelData.temp;
                        break;
                    }
                }
            }
            if(this.data.fuel <= 0){
                return;
            }
        }

        const slots: UI.Slot[] = [
            this.container.getSlot("slot0"),
            this.container.getSlot("slot1"),
            this.container.getSlot("slot2")
        ];

        const smeltCount = slots.reduce((sum, slot) => sum + slot.count, 0);
        let recipe: IMeltingRecipe;
        let time: number;
        let count: number;
        let value: number;
        let mode: number;
        let consume = false;

        if(smeltCount > capacity){
            if(isOpened){
                for(let i = 0; i < 3; i++){
                    this.container.setBinding("gauge" + i, "texture", "tcon.heat_gauge_2");
                    this.container.setScale("gauge" + i, 1);
                }
            }
            return;
        }

        for(let i = 0; i < 3; i++){
            recipe = MeltingRecipe.getRecipe(slots[i].id, slots[i].data);
            value = 0;
            mode = 0;
            if(recipe && i < capacity){
                time = Math.max(5, recipe.temp) * SmelteryHandler.getHeatFactor();
                this.data["heat" + i] += this.data.temp / 100;
                consume = true;
                if(this.data["heat" + i] >= time){
                    count = slots[i].count;
                    while(total + recipe.amount * count > liquidCapacity){
                        count--;
                    }
                    if(count > 0){
                        slots[i].count -= count;
                        this.container.validateSlot("slot" + i);
                        this.liquidStorage.addLiquid(recipe.liquid, recipe.amount * count);
                        this.data["heat" + i] = 0;
                    }
                    else{
                        mode = 2;
                        value = 1;
                    }
                }
                else{
                    value = this.data["heat" + i] / time;
                }
            }
            else{
                this.data["heat" + i] = 0;
                if(slots[i].id !== 0){
                    mode = 3;
                    value = 1;
                }
            }
            if(isOpened){
                this.container.setBinding("gauge" + i, "texture", "tcon.heat_gauge_" + mode);
                this.container.setScale("gauge" + i, value);
            }
        }

        if(consume){
            this.data.fuel--;
        }

    }

    interactWithEntitiesInside(): void {
        const allEnt = Entity.getAll();
        const entities: number[] = [];
        let pos: Vector;
        for(let i = 0; i < allEnt.length; i++){
            pos = Entity.getPosition(allEnt[i]);
            if(this.area.from.x <= pos.x && this.area.to.x >= pos.x && this.area.from.y <= pos.y && this.area.to.y >= pos.y && this.area.from.z <= pos.z && this.area.to.z >= pos.z){
                if(MeltingRecipe.getEntRecipe(allEnt[i])){
                    entities.push(allEnt[i]);
                }
            }
        }
        const liquidCapacity = this.getLiquidCapacity();
        entities.forEach(ent => {
            const result = MeltingRecipe.getEntRecipe(ent);
            if(this.totalLiquidAmount() + result.amount <= liquidCapacity){
                this.liquidStorage.addLiquid(result.liquid, result.amount);
            }
            Entity.damageEntity(ent, 2);
        });
        /*
        for(let i = 0; i < items.length; i++){

        }
        */
    }

    setAnim(): void {
        const boxes = [];
        const sizeX = this.area.to.x - this.area.from.x - 1;
        const sizeY = this.area.to.y - this.area.from.y;
        const sizeZ = this.area.to.z - this.area.from.z - 1;
        const texScale = MoltenLiquid.getTexScale();
        if(this.data.isActive){
            const liquids = this.liquidStorage.liquidAmounts;
            const liqArray = this.getLiquidArray();
            const capacity = this.getLiquidCapacity();
            let height: number;
            let max: number;
            let y = 0;
            for(let i = 0; i < liqArray.length; i++){
                height = liquids[liqArray[i]] / capacity * sizeY;
                max = Math.max(sizeX, sizeZ, height);
                boxes.push({
                    type: "box",
                    uv: {x: 0, y: MoltenLiquid.getY(liqArray[i]) * max},
                    coords: {x: 0, y: y - height * 16 / 2, z: 0},
                    size: {x: sizeX * 16, y: height * 16, z: sizeZ * 16}
                });
                y -= height * 16;
            }
            texScale.width *= max;
            texScale.height *= max;
        }
        this.render.setPart("head", boxes, texScale);
        this.anim.setPos(
            (this.area.from.x + this.area.to.x) / 2 + 0.5,
            (this.area.from.y + this.area.to.y) / 2 - (sizeY + 1) * 0.5,
            (this.area.from.z + this.area.to.z) / 2 + 0.5
        );
        this.anim.refresh();
    }

    spawnParticle(): void {
        //270, 90, 180, 0 degree
        const cos = [0, 0, -1, 1][this.data.meta];
        const sin = [-1, 1, 0, 0][this.data.meta];
        const x = 0.52;
        const z = Math.random() * 0.6 - 0.3;
        const coords = {
            x: this.x + 0.5 + x * cos - z * sin,
            y: this.y + 0.5 + (Math.random() * 6) / 16,
            z: this.z + 0.5 + x * sin + z * cos
        };
        Particles.addParticle(Native.ParticleType.smoke, coords.x, coords.y, coords.z, 0, 0, 0);
        Particles.addParticle(Native.ParticleType.flame, coords.x, coords.y, coords.z, 0, 0, 0);
    }

}


class SmelteryInterface extends FluidTileInterface {
    getLiquidStored(storage: string, side: number): string {
        return this.tileEntity.getLiquidArray()[0];
    }
    canReceiveLiquid(liquid: string, side: number): boolean {
        return true;
    }
}


TileEntity.registerPrototype(BlockID.tcon_smeltery, new SmelteryControler());
TileRenderer.setRotationPlaceFunction(BlockID.tcon_smeltery);
StorageInterface.createInterface(BlockID.tcon_smeltery, new SmelteryInterface());