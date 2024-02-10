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
        [BlockID.tcon_tank_fuel]: true,
        [BlockID.tcon_gauge_fuel]: true,
        [BlockID.tcon_tank_ingot]: true,
        [BlockID.tcon_gauge_ingot]: true,
        [BlockID.tcon_smeltery]: true
    };

    private static elements: UI.ElementSet = {
        imageOvl: {type: "image", x: 93 * SCALE, y: 11 * SCALE, z: 1001, bitmap: "tcon.smeltery_ovl", scale: SCALE},
        slot0: {type: "slot", x: 24 * SCALE, y: 10 * SCALE, size: 18 * SCALE},
        slot1: {type: "slot", x: 24 * SCALE, y: 28 * SCALE, size: 18 * SCALE},
        slot2: {type: "slot", x: 24 * SCALE, y: 46 * SCALE, size: 18 * SCALE},
        gauge0: {type: "scale", x: 21 * SCALE, y: 11 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
        gauge1: {type: "scale", x: 21 * SCALE, y: 29 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
        gauge2: {type: "scale", x: 21 * SCALE, y: 47 * SCALE, bitmap: "tcon.heat_gauge_0", scale: SCALE, direction: 1},
        textFuel: {type: "text", x: 67 * SCALE, y: 50 * SCALE, font: {size: 30, color: Color.WHITE, shadow: 0.5, align: UI.Font.ALIGN_CENTER}},
        textLiquid: {type: "text", x: 92 * SCALE, y: 65 * SCALE, z: 1002, font: {size: 30, color: Color.WHITE, shadow: 0.5}, multiline: true},
        buttonDump: {type: "button", x: 92 * SCALE, y: 80 * SCALE, z: 1002, bitmap: "_craft_button_up", bitmap2: "_craft_button_down", scale: SCALE / 2, clicker: {
            onClick: (_, container: ItemContainer) => {
                container.sendEvent("dumpLiquid", {});
            }
        }},
        buttonSelect: {type: "button", x: 130 * SCALE, y: 80 * SCALE, z: 1002, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: SCALE, clicker: {
            onClick: (_, container: ItemContainer) => {
                container.sendEvent("selectLiquid", {});
            }
        }},
        textDump: {type: "text", x: 104 * SCALE, y: 78 * SCALE, z: 1003, text: translate("Dump"), font: {size: 30, color: Color.WHITE, shadow: 0.5, alignment: 1}},
        iconSelect: {type: "image", x: 131.6 * SCALE, y: 81.6 * SCALE, z: 1003, bitmap: "mod_browser_update_icon", scale: SCALE * 0.8},
        btnR: {type: "button", x: 698, y: 13, bitmap: "classic_button_up", bitmap2: "classic_button_down", scale: 2, clicker: {onClick: () => RV?.RecipeTypeRegistry.openRecipePage(["tcon_melting", "tcon_alloying"])}},
        textR: {type: "text", x: 698 + 14, y: 13 - 6, z: 1, text: "R", font: {color: Color.WHITE, size: 20, shadow: 0.5, align: UI.Font.ALIGN_CENTER}}
    };

    private static window: UI.StandardWindow;
    public static liquidCount = 0;

    static setup(): void {

        let i = 0;
        let z = 1000;

        for(let key in LiquidRegistry.liquids){
            this.elements["liquid" + i] = {
                type: "scale",
                x: 93 * SCALE,
                y: 11 * SCALE,
                z: z--,
                width: 52 * SCALE,
                height: 52 * SCALE,
                //bitmap: LiquidRegistry.getLiquidUITexture(key, 18 * SCALE, 18 * SCALE),
                direction: 1,
                pixelate: false
            };
            i++;
        }

        this.liquidCount = i;

        this.window = new UI.StandardWindow({
            standard: {
                header: {text: {text: translate("Smeltery")}, height: 60},
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

        if(Cfg.SlotsLikeVanilla){
            VanillaSlots.registerForWindow(this.window);
        }

    }

    static getWindow(): UI.StandardWindow {
        return this.window;
    }

    static getHeatFactor(): number {
        return 8;
    }

    static isValidBlock(id: number): boolean {
        return this.blocks[id] || false;
    }

}


Callback.addCallback("PostLoaded", () => {
    SmelteryHandler.setup();
});


class SmelteryControler extends TconTileEntity implements ILiquidStorage {

    render: Render;
    anim: Animation.Base;

    area: {from: Vector, to: Vector};

    tanksPos: Vector[] = [];

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
        return this.getLiquidArray()[0]?.liquid || null;
    }
    getLimit(liquid: string): number {
        const capacity = this.getLiquidCapacity();
        const otherTotal = this.totalLiquidAmount() - this.getAmount(liquid);
        return capacity - otherTotal;
    }
    getAmount(liquid: string): number {
        return Math.round(this.liquidStorage.getAmount(liquid));
    }
    getRelativeAmount(liquid: string): number {
        const capacity = this.getLiquidCapacity();
        return capacity > 0 ? this.getAmount(liquid) / capacity : 0;
    }
    getLiquid(liquid: string, amount: number): number {
        const got = Math.min(this.getAmount(liquid), amount);
        this.liquidStorage.liquidAmounts[liquid] -= got;
        if(this.liquidStorage.liquidAmounts[liquid] < 1){
            delete this.liquidStorage.liquidAmounts[liquid];
        }
        return got;
    }
    addLiquid(liquid: string, amount: number): number {
        const freespace = this.getLiquidCapacity() - this.totalLiquidAmount();
        const add = Math.min(freespace, amount);
        this.liquidStorage.liquidAmounts[liquid] ??= 0;
        this.liquidStorage.liquidAmounts[liquid] += add;
        return add;
    }
    isFull(liquid?: string): boolean {
        return this.totalLiquidAmount() > this.getLiquidCapacity();
    }
    isEmpty(liquid?: string): boolean {
        return this.totalLiquidAmount() < 1;
    }

    override getScreenByName(screenName: string, container: ItemContainer): UI.IWindow {
        return SmelteryHandler.getWindow();
    }

    override putDefaultNetworkData(): void {
        this.networkData.putBoolean("active", false);
    }

    override setupContainer(): void {
        this.container.setGlobalAddTransferPolicy((container, slotName, id, count, data, extra, player) => {
            if((slotName === "slot0" || slotName === "slot1" || slotName === "slot2") && MeltingRecipe.isExist(id, data)){
                let amount = 0;
                for(let i = 0; i < 3; i++){
                    amount += container.getSlot("slot" + i).count;
                }
                return Math.max(0, Math.min(count, container.parent.getItemCapacity() - amount));
            }
            return 0;
        });
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
        this.anim.describe({render: this.render.getId(), skin: MoltenLiquid.PATH});
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

        if(Cfg.SlotsLikeVanilla){
            VanillaSlots.registerServerEventsForContainer(this.container);
        }
        
    }

    searchWall(coords: Vector, axis: "x" | "z", dir: -1 | 1): number {
        const pos: Vector = {...coords};
        let i = 0;
        let block = 0;
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
            return false;
        }
        const from = {x: backPos.x + x1, z: backPos.z + z1};
        const to = {x: backPos.x + x2, z: backPos.z + z2};
        //Floor Check
        let x = 0;
        let z = 0;
        for(x = from.x + 1; x <= to.x - 1; x++){
        for(z = from.z + 1; z <= to.z - 1; z++){
            if(this.region.getBlockId(x, this.y - 1, z) !== BlockID.tcon_stone){
                return false;
            }
        }
        }
        //Wall Check
        const tanks: Vector[] = [];
        let y = 0;
        let block = 0;
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
                    case BlockID.tcon_tank_fuel:
                    case BlockID.tcon_gauge_fuel:
                    case BlockID.tcon_tank_ingot:
                    case BlockID.tcon_gauge_ingot:
                        tanks.push({x: x, y: y, z: z});
                        break;
                    case BlockID.tcon_drain:
                        tile.controller = this;
                        break;
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
        this.area = {
            from: {x: from.x, y: this.y - 1, z: from.z},
            to: {x: to.x, y: y - 1, z: to.z}
        };
        this.tanksPos = tanks;
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
            if(liquids[key] < 1){
                delete liquids[key];
                continue;
            }
            amount += liquids[key];
        }
        return amount;
    }

    getLiquidArray(): LiquidInstance[] {
        const liquids = this.liquidStorage.liquidAmounts;
        const array: LiquidInstance[] = [];
        for(let key in liquids){
            if(liquids[key] > 0){
                array.push({liquid: key, amount: liquids[key]});
            }
        }
        if(array.length > 0){
            for(let i = 0; i < this.data.select; i++){
                array.push(array.shift());
            }
        }
        return array;
    }

    consumeFuel(): {duration: number, temp: number} {
        let iTank: TileEntityInterface;
        let tank: ILiquidStorage;
        let stored = "";
        let amount = 0;
        let fuelData: ISmelteryFuel;
        for(const pos of this.tanksPos){
            iTank = StorageInterface.getLiquidStorage(this.blockSource, pos.x, pos.y, pos.z);
            tank = iTank?.getOutputTank(-1);
            if(tank){
                stored = tank.getLiquidStored();
                amount = tank.getAmount(stored);
                fuelData = SmelteryFuel.getFuel(stored);
                if(fuelData && amount >= fuelData.amount){
                    tank.getLiquid(stored, fuelData.amount);
                    return {duration: fuelData.duration, temp: fuelData.temp};
                }
            }
        }
        return null;
    }

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {

        this.data.isActive = this.checkStructure();

        if(this.data.isActive){
            return false;
        }

        BlockEngine.sendMessage(Network.getClientForPlayer(player), "Invalid block inside the structure");
        return true;

    }

    @NetworkEvent(Side.Client)
    setAnim(data: {capacity: number, liqArray: LiquidInstance[], area: {from: Vector, to: Vector}, isActive: boolean}): void {
        if(!this.render || !this.anim){
            return;
        }
        const parts = [];
        const sizeX = data.area.to.x - data.area.from.x - 1;
        const sizeY = data.area.to.y - data.area.from.y;
        const sizeZ = data.area.to.z - data.area.from.z - 1;
        const texScale = MoltenLiquid.getTexScale();
        if(data.isActive){
            let height = 0;
            let max = 0;
            let y = 0;
            for(const {liquid, amount} of data.liqArray){
                height = amount / data.capacity * sizeY;
                max = Math.max(sizeX, sizeZ, height);
                parts.push({
                    type: "box",
                    uv: {x: 0, y: MoltenLiquid.getY(liquid) * max},
                    coords: {x: 0, y: y - height * 16 / 2, z: 0},
                    size: {x: sizeX * 16, y: height * 16, z: sizeZ * 16}
                });
                y -= height * 16;
            }
            texScale.width *= max;
            texScale.height *= max;
        }
        if(isFinite(texScale.width) && isFinite(texScale.height)){
            this.render.setPart("head", parts, texScale);
        }
        this.anim.setPos(
            (data.area.from.x + data.area.to.x) / 2 + 0.5,
            (data.area.from.y + data.area.to.y) / 2 - (sizeY + 1) * 0.5,
            (data.area.from.z + data.area.to.z) / 2 + 0.5
        );
        this.anim.refresh();
    }

    interactWithEntitiesInside(): void {
        const entities: number[] = [];
        for(const ent of this.region.listEntitiesInAABB(this.area.from, this.area.to)){
            if(MeltingRecipe.getEntRecipe(ent)){
                entities.push(ent);
            }
        }
        const liquidCapacity = this.getLiquidCapacity();
        let result: LiquidInstance;
        for(const ent of entities){
            result = MeltingRecipe.getEntRecipe(ent);
            if(this.totalLiquidAmount() + result.amount <= liquidCapacity){
                this.liquidStorage.addLiquid(result.liquid, result.amount);
            }
            Entity.damageEntity(ent, 2);
        }
    }

    override onTick(): void {

        const tick = World.getThreadTime();
        const liqArray = this.getLiquidArray();
        const totalAmount = this.totalLiquidAmount();
        const capacity = this.getItemCapacity();
        const liquidCapacity = this.getLiquidCapacity();
        let canSmelt = true;

        if((tick & 63) === 0){
            this.data.isActive = this.checkStructure();
            this.setActive();
            this.sendPacket("setAnim", {capacity: liquidCapacity, liqArray: liqArray, area: this.area, isActive: this.data.isActive});
            if(this.data.isActive){
                this.sendPacket("spawnParticle", {});
            }
        }

        if(this.data.isActive){

            if(Cfg.checkInsideSmeltery && tick % 20 === 0){
                this.interactWithEntitiesInside();
            }
    
            if((tick & 3) === 0){
                for(const recipe of AlloyRecipe.getRecipes(this.liquidStorage.liquidAmounts)){
                    for(const input of recipe.inputs){
                        this.getLiquid(input.liquid, input.amount);
                    }
                    this.addLiquid(recipe.result.liquid, recipe.result.amount);
                }
            }
    
            if(this.data.fuel <= 0){
                const fuelData = this.consumeFuel();
                if(fuelData){
                    this.data.fuel = fuelData.duration;
                    this.data.temp = fuelData.temp;
                }
                if(this.data.fuel <= 0){
                    canSmelt = false;
                }
            }

        }
        else{
            canSmelt = false;
        }

        const modes: (0 | 1 | 2 | 3)[] = [0, 0, 0];
        const values: number[] = [0, 0, 0];

        if(canSmelt){
            
            const slots: ItemContainerSlot[] = [
                this.container.getSlot("slot0"),
                this.container.getSlot("slot1"),
                this.container.getSlot("slot2")
            ];

            const smeltCount = slots.reduce((sum, slot) => sum + slot.count, 0);
            let recipe: IMeltingRecipe;
            let time = 0;
            let count = 0;
            let consume = false;

            if(smeltCount > capacity){
                for(let i = 0; i < 3; i++){
                    modes[i] = 2;
                    values[i] = 1;
                }
            }
            else{
                for(let i = 0; i < 3; i++){
                    recipe = MeltingRecipe.getRecipe(slots[i].id, slots[i].data);
                    if(recipe && i < capacity){
                        time = Math.max(5, recipe.temp) * SmelteryHandler.getHeatFactor();
                        this.data["heat" + i] += this.data.temp / 100;
                        consume = true;
                        if(this.data["heat" + i] >= time){
                            count = slots[i].count;
                            while(totalAmount + recipe.amount * count > liquidCapacity){
                                count--;
                            }
                            if(count > 0){
                                slots[i].count -= count;
                                slots[i].markDirty();
                                slots[i].validate();
                                this.liquidStorage.addLiquid(recipe.liquid, recipe.amount * count);
                                this.data["heat" + i] = 0;
                            }
                            else{
                                modes[i] = 2;
                                values[i] = 1;
                            }
                        }
                        else{
                            values[i] = this.data["heat" + i] / time;
                        }
                    }
                    else{
                        this.data["heat" + i] = 0;
                        if(slots[i].id !== 0){
                            modes[i] = 3;
                            values[i] = 1;
                        }
                    }
                }
            }

            if(consume){
                this.data.fuel--;
            }

        }

        for(let i = 0; i < 3; i++){
            this.container.setScale("gauge" + i, values[i]);
        }

        for(let i = 0; i < SmelteryHandler.liquidCount; i++){
            if(i < liqArray.length){
                this.container.setScale("liquid" + i, 1);
            }
        }
        
        this.container.sendEvent("changeScales", {mode0: modes[0], mode1: modes[1], mode2: modes[2]});
        this.container.sendEvent("updateLiquidScales", {capacity: liquidCapacity, liqArray: liqArray});
        this.container.setText("textFuel", "fuel: " + this.data.fuel);
        this.container.setText("textLiquid", liqArray.length > 0 ? LiquidRegistry.getLiquidName(liqArray[0].liquid) + "\n" + liqArray[0].amount.toFixed() + " mB" : "");
        this.container.sendChanges();
        
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

    @ContainerEvent(Side.Client)
    changeScales(container: ItemContainer, window: UI.IWindow, content: any, data: {mode0: number, mode1: number, mode2: number}): void {
        if(window?.isOpened()){
            const elements = window.getElements();
            elements.get("gauge0").setBinding("texture", "tcon.heat_gauge_" + data.mode0);
            elements.get("gauge1").setBinding("texture", "tcon.heat_gauge_" + data.mode1);
            elements.get("gauge2").setBinding("texture", "tcon.heat_gauge_" + data.mode2);
        }
    }

    @ContainerEvent(Side.Client)
    updateLiquidScales(container: ItemContainer, window: UI.IWindow, content: any, data: {capacity: number, liqArray: LiquidInstance[]}): void {
        if(!window?.isOpened()){
            return;
        }
        const elements = window.getElements();
        let elem: UI.Element;
        let y = (11 + 52) * SCALE;
        for(let i = 0; i < SmelteryHandler.liquidCount; i++){
            elem = elements.get("liquid" + i);
            if(!elem) continue;
            if(i < data.liqArray.length){
                y -= data.liqArray[i].amount / data.capacity * 52 * SCALE;
                elem.setPosition(elem.x, y);
                elem.setBinding("texture", LiquidRegistry.getLiquidUITexture(data.liqArray[i].liquid, 18 * SCALE, 18 * SCALE));
            }
            else{
                elem.setPosition(elem.x, 2000);
            }
        }
    }

    @ContainerEvent(Side.Server)
    selectLiquid(): void {
        this.data.select = (this.data.select + 1) % this.getLiquidArray().length;
    }

    @ContainerEvent(Side.Server)
    dumpLiquid(): void {
        const stored = this.getLiquidStored();
        this.getLiquid(stored, this.getAmount(stored));
        this.data.select %= this.getLiquidArray().length;
    }

}


TileEntity.registerPrototype(BlockID.tcon_smeltery, new SmelteryControler());

StorageInterface.createInterface(BlockID.tcon_smeltery, {
    liquidUnitRatio: 0.001,
    canReceiveLiquid(liquid: string, side: number): boolean {
        return true;
    },
    getInputTank(): ILiquidStorage {
        return this.tileEntity;
    },
    getOutputTank(): ILiquidStorage {
        return this.tileEntity;
    }
});