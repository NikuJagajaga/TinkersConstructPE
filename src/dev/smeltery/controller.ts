createBlock("tcon_smeltery", [{name: "Smeltery Controller", texture: [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 0], ["tcon_stone", 3], ["tcon_stone", 3]]}]);
TileRenderer.setStandardModelWithRotation(BlockID.tcon_smeltery, 2, [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 0], ["tcon_stone", 3], ["tcon_stone", 3]]);
TileRenderer.registerModelWithRotation(BlockID.tcon_smeltery, 2, [["tcon_stone", 3], ["tcon_stone", 3], ["tcon_stone", 3], ["tcon_smeltery", 1], ["tcon_stone", 3], ["tcon_stone", 3]]);
TileRenderer.setRotationFunction(BlockID.tcon_smeltery);
Recipes2.addShaped(BlockID.tcon_smeltery, "aaa:a_a:aaa", {a: ItemID.tcon_brick});


class SmelteryHandler {

    private static readonly blocks = {
        [BlockID.tcon_stone]: true,
        [BlockID.tcon_seared_glass]: true,
        [BlockID.tcon_drain]: true,
        [BlockID.tcon_tank]: true,
        [BlockID.tcon_smeltery]: true
    };

    private static elements: UI.ElementSet = {
            line: {type: "image", x: 93 * SCALE, y: 11 * SCALE, z: 1, bitmap: "tcon.smeltery_line", scale: SCALE},
            slot0: {type: "slot", x: 24 * SCALE, y: 10 * SCALE, size: 18 * SCALE/*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/},
            slot1: {type: "slot", x: 24 * SCALE, y: 28 * SCALE, size: 18 * SCALE/*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/},
            slot2: {type: "slot", x: 24 * SCALE, y: 46 * SCALE, size: 18 * SCALE/*, isValid: (id, count, data) => MeltingRecipe.isExist(id, data)*/},
            gauge0: {type: "scale", x: 21 * SCALE, y: 11 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
            gauge1: {type: "scale", x: 21 * SCALE, y: 29 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
            gauge2: {type: "scale", x: 21 * SCALE, y: 47 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
            //scaleLava: {type: "scale", x: 161 * SCALE, y: 11 * SCALE, width: 12 * SCALE, height: 52 * SCALE, bitmap: "_liquid_lava_texture_0", direction: 1},
            buttonSelect: {type: "button", x: 130 * SCALE, y: 70 * SCALE, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: SCALE, clicker: {
                onClick: (_, container: ItemContainer) => {
                    container.sendEvent("", {});
                    //tile.data.select++;
                    //tile.data.select %= Object.keys(tile.liquidStorage.liquidAmounts).length;
                }
            }},
            buttonDump: {type: "button", x: 92 * SCALE, y: 70 * SCALE, bitmap: "_craft_button_up", bitmap2: "_craft_button_down", scale: SCALE / 2, clicker: {
                onClick: (_, container: ItemContainer) => {
                    container.sendEvent("", {});
                    //const liquids = tile.liquidStorage.liquidAmounts;
                    //delete liquids[Object.keys(liquids)[tile.data.select]];
                    //tile.data.select %= Object.keys(liquids).length;
                }
            }},
            iconSelect: {type: "image", x: 131.6 * SCALE, y: 71.6 * SCALE, z: 1, bitmap: "mod_browser_update_icon", scale: SCALE * 0.8},
            textDump: {type: "text", x: 104 * SCALE, y: 68 * SCALE, z: 1, text: "Dump", font: {size: 30, color: Color.WHITE, shadow: 0.5, alignment: 1}},
            textLiquid: {type: "text", x: 150 * SCALE, y: 50 * SCALE, font: {size: 30, color: Color.WHITE, shadow: 0.5}, multiline: true}
        };

    private static window = new UI.StandardWindow({
        standard: {
            header: {text: {text: "Smeltery"}},
            inventory: {standard: true},
            background: {standard: true}
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
        return this.blocks[id] || false;
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


class SmelteryControler extends TconTileEntity implements ILiquidStorage {

    render: Render;
    anim: Animation.Base;

    area: {from: Vector, to: Vector};

    tanks: SearedTank[] = [];

    override defaultValues = {
        select: 0,
        temp: 0,
        fuel: 0,
        heat0: 0,
        heat1: 0,
        heat2: 0,
        isActive: false
    };

    getLiquidStored(): string {
        return "";
    }
    getLimit(liquid: string): number {
        return 0;
    }
    getAmount(liquid: string): number {
        return 0;
    }
    getLiquid(liquid: string, amount: number): number {
        return 0;
    }
    addLiquid(liquid: string, amount: number): number {
        return 0;
    }
    isFull(liquid?: string): boolean {
        return false;
    }
    isEmpty(liquid?: string): boolean {
        return false;
    }

    override getScreenByName(screenName: string, container: ItemContainer): UI.IWindow {
        return SmelteryHandler.getWindow();
    }

    putDefaultNetworkData(): void {
        this.networkData.putBoolean("active", false);
    }

    setActive(): void {
        if (this.networkData.getBoolean("active") !== this.data.isActive) {
            this.networkData.putBoolean("active", this.data.isActive);
            this.networkData.sendChanges();
        }
    }

    @ClientSide
    renderModel(): void {
        if(this.networkData.getBoolean("active")){
            TileRenderer.mapAtCoords(this.x, this.y, this.z, Network.serverToLocalId(this.networkData.getInt("blockId")), this.networkData.getInt("blockData"));
        }
        else{
            BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
        }
    }

    override clientLoad(): void {

        this.render = new Render();
        this.anim = new Animation.Base(this.x, this.y, this.z);
        this.anim.describe({render: this.render.getId(), skin: "model/tcon_liquids.png"});
        this.anim.load();
        this.anim.setSkylightMode();

        this.renderModel();
        this.networkData.addOnDataChangedListener((data: SyncedNetworkData, isExternal: boolean) => {
            this.renderModel();
        });

    }

    override clientUnload(): void {
        this.anim?.destroy();
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    }

    override onInit(): void {

        super.onInit();

        this.area = {
            from: {x: 0, y: 0, z: 0},
            to: {x: 0, y: 0, z: 0}
        };

        this.data.isActive = this.checkStructure();
        
    }

    searchWall(coords: Vector, axis: "x" | "z", dir: -1 | 1): number {
        const pos: Vector = {...coords};
        let i: number;
        let block: number;
        for(i = 0; i < 16; i++){
            pos[axis] += dir;
            block = this.region.getBlockId(pos);
            if(block === 0) continue;
            return SmelteryHandler.isValidBlock(block) ? (i + 1) * dir : 0;
        }
        return 0;
    }

    checkStructure(): boolean {
        const facing = this.networkData.getInt("blockData") - 2;
        const backPos: Vector = {x: this.x, y: this.y, z: this.z};
        backPos[facing >> 1 ? "x" : "z"] += facing & 1 ? -1 : 1;
        if(this.region.getBlockId(backPos) !== 0){
            return false;
        }
        const x1 = this.searchWall(backPos, "x", -1);
        const x2 = this.searchWall(backPos, "x", 1);
        const z1 = this.searchWall(backPos, "z", -1);
        const z2 = this.searchWall(backPos, "z", 1);
        if(x1 === 0 || x2 === 0 || z1 === 0 || z2 === 0){
            Game.message("xz: " + [x1, x2, z1, z2].join(","));
            return false;
        }
        const from = {x: backPos.x + x1, z: backPos.z + z1};
        const to = {x: backPos.x + x2, z: backPos.z + z2};
        //Floor Check
        let x: number;
        let z: number;
        for(x = from.x + 1; x <= to.x - 1; x++){
        for(z = from.z + 1; z <= to.z - 1; z++){
            if(this.region.getBlockId(x, this.y - 1, z) !== BlockID.tcon_stone){
                return false;
            }
        }
        }
        //Wall Check
        const tanks: SearedTank[] = [];
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
            block = this.region.getBlockId(x, y, z);
            if(from.x < x && x < to.x && from.z < z && z < to.z){
                if(block !== 0){
                    break loop;
                }
                continue;
            }
            if(!SmelteryHandler.isValidBlock(block)){
                break loop;
            }
            tile = this.region.getTileEntity(x, y, z);
            if(tile){
                switch(tile.blockID){
                    case BlockID.tcon_tank: tanks.push(tile as SearedTank); break;
                    case BlockID.tcon_drain: tile.controller = this; break;
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

    consumeFuel(tank: SearedTank): {duration: number, temp: number} {
        const liquid = tank.liquidStorage?.getLiquidStored();
        const amount = tank.liquidStorage?.getAmount(liquid) || 0;
        const fuelData = SmelteryFuel.getFuel(liquid);
        if(fuelData && amount >= fuelData.amount){
            this.liquidStorage.getLiquid(liquid, fuelData.amount);
            return {duration: fuelData.duration, temp: fuelData.temp};
        }
        return null;
    }

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {

        this.data.isActive = this.checkStructure();

        if(this.data.isActive){
            this.region.setBlock(this.area.from, VanillaBlockID.wool, 0);
            this.region.setBlock(this.area.to, VanillaBlockID.wool, 1);
        }
        else{
            Game.message("invalid");
        }

        return false;

    }

    override onTick(): void {
        
    }

    @NetworkEvent(Side.Client)
    spawnParticle(data: {}): void {
        //270, 90, 180, 0 degree
        const blockData = this.networkData.getInt("blockData");
        const cos = [0, 0, -1, 1][blockData];
        const sin = [-1, 1, 0, 0][blockData];
        const x = 0.52;
        const z = Math.random() * 0.6 - 0.3;
        const coords: Vector = {
            x: this.x + 0.5 + x * cos - z * sin,
            y: this.y + 0.5 + (Math.random() * 6) / 16,
            z: this.z + 0.5 + x * sin + z * cos
        };
        Particles.addParticle(EParticleType.SMOKE, coords.x, coords.y, coords.z, 0, 0, 0);
        Particles.addParticle(EParticleType.FLAME, coords.x, coords.y, coords.z, 0, 0, 0);
    }

}


TileEntity.registerPrototype(BlockID.tcon_smeltery, new SmelteryControler());

StorageInterface.createInterface(BlockID.tcon_smeltery, {
    liquidUnitRatio: 0.001,
    canReceiveLiquid(liquid: string, side: number): boolean {
        return true;
    },
    getInputTank(): ILiquidStorage {
        return this.tileEntity.liquidStorage;
    },
    getOutputTank(): ILiquidStorage {
        return this.tileEntity.liquidStorage;
    }
});