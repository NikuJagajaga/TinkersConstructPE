class TankModelManager {

    private static textures: {[key: string]: string} = {
        water: "still_water",
        lava: "still_lava"
    };

    private static itemModels: {[key: string]: ItemModel[]} = {};

    static getItemModel(id: number, liquid: string, relativeAmount: number): ItemModel {

        const key = id + "-" + liquid;
        const level = Math.ceil(relativeAmount * 4) - 1;

        if(level < 0){
            return null;
        }

        if(!this.itemModels[key]){

            const itemModels = [
                ItemModel.newStandalone(),
                ItemModel.newStandalone(),
                ItemModel.newStandalone(),
                ItemModel.newStandalone()
            ];
    
            const models = [
                BlockRenderer.createModel(),
                BlockRenderer.createModel(),
                BlockRenderer.createModel(),
                BlockRenderer.createModel()
            ];

            try{
                for(let i = 0; i < 4; i++){
                    models[i].addBox(0, 0, 0, 1, 1, 1, id, 0);
                    models[i].addBox(1/32, 1/32, 1/32, 31/32, (i + 1) / 4 * 31 / 32, 31/32, this.textures[liquid] || "tcon_liquid_" + liquid, 0);
                    itemModels[i].setModel(models[i])
                                 .setModUiSpriteName(IDRegistry.getNameByID(id), 0);
                }
            }
            catch(e){
                return null;
            }

            this.itemModels[key] = itemModels;
            
        }

        return this.itemModels[key][level];

    }

}



Item.addCreativeGroup("tcon_tank", "Seared Tanks", [
    createBlock("tcon_tank_fuel", [{name: "Seared Fuel Tank", texture: [["tcon_tank_top", 0], ["tcon_tank_top", 0], 0]}]),
    createBlock("tcon_gauge_fuel", [{name: "Seared Fuel Gauge", texture: [["tcon_gauge_top", 0], ["tcon_gauge_top", 0], 0]}]),
    createBlock("tcon_tank_ingot", [{name: "Seared Ingot Tank", texture: [["tcon_tank_top", 0], ["tcon_tank_top", 0], 0]}]),
    createBlock("tcon_gauge_ingot", [{name: "Seared Ingot Gauge", texture: [["tcon_gauge_top", 0], ["tcon_gauge_top", 0], 0]}])
]);

Recipes2.addShaped(BlockID.tcon_tank_fuel, "aaa:aba:aaa", {a: ItemID.tcon_brick, b: "glass"});
Recipes2.addShaped(BlockID.tcon_gauge_fuel, "aba:bbb:aba", {a: ItemID.tcon_brick, b: "glass"});
Recipes2.addShaped(BlockID.tcon_tank_ingot, "aba:aba:aba", {a: ItemID.tcon_brick, b: "glass"});
Recipes2.addShaped(BlockID.tcon_gauge_ingot, "bab:aba:bab", {a: ItemID.tcon_brick, b: "glass"});


BlockModel.register(BlockID.tcon_tank_fuel, (model, index) => {
    model.addBox( 0/16,  0/16,  0/16, 16/16, 16/16, 16/16, BlockID.tcon_tank_fuel, 0);
    model.addBox( 2/16, 16/16,  2/16, 14/16, 18/16, 14/16, BlockID.tcon_tank_fuel, 0);
    return model;
});
BlockModel.register(BlockID.tcon_tank_ingot, (model, index) => {
    model.addBox( 0/16,  0/16,  0/16, 16/16, 16/16, 16/16, BlockID.tcon_tank_ingot, 0);
    model.addBox( 2/16, 16/16,  2/16, 14/16, 18/16, 14/16, BlockID.tcon_tank_ingot, 0);
    return model;
});


class SearedTank extends TileWithLiquidModel {

    private tankCapacity: number;
    animPos: Vector;
    animScale: Vector;

    constructor(tankCapacity: number){
        super();
        this.tankCapacity = tankCapacity;
    }

    override clientLoad(): void {
        this.animPos = {x: 0.5, y: 0, z: 0.5};
        this.animScale = {x: 31/32, y: 31/32, z: 31/32};
        super.clientLoad();
    }

    override setupContainer(): void {
        this.liquidStorage.setLimit(null, this.tankCapacity);
    }

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, playerUid: number): boolean {

        if(Entity.getSneaking(playerUid)) return true;

        const player = new PlayerEntity(playerUid);
        const stored = this.liquidStorage.getLiquidStored();
        const empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);
        let soundName = "";

        if(empty){
            soundName = MoltenLiquid.getTemp(empty.liquid) < 50 ? "bucket.empty_water" : "bucket.empty_lava";
            if(stored === empty.liquid || !stored){
                if(this.liquidStorage.getLimit(stored) - this.liquidStorage.getAmount(stored) >= empty.amount){
                    this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    item.count--;
                    player.setCarriedItem(item);
                    player.addItemToInventory(empty.id, 1, empty.data);
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
                if(item.count === 1 && empty.storage){
                    item.data += this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    player.setCarriedItem(item);
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
            }
        }

        if(stored){
            const full = LiquidItemRegistry.getFullItem(item.id, item.data, stored);
            soundName = MoltenLiquid.getTemp(stored) < 50 ? "bucket.fill_water" : "bucket.fill_lava";
            if(full){
                const amount = this.liquidStorage.getAmount(stored);
                if(full.amount <= amount){
                    this.liquidStorage.getLiquid(stored, full.amount);
                    if(item.count === 1){
                        player.setCarriedItem(full.id, 1, full.data);
                    }
                    else{
                        item.count--;
                        player.setCarriedItem(item);
                        player.addItemToInventory(full.id, 1, full.data);
                    }
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
                if(item.count === 1 && full.storage){
                    player.setCarriedItem(full.id, 1, full.amount - this.liquidStorage.getLiquid(stored, full.amount));
                    this.region.playSound(coords, soundName);
                    this.preventClick();
                    return true;
                }
            }
        }

        return false;

    }

    override destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
        const stored = this.liquidStorage.getLiquidStored();
        let extra: ItemExtraData;
        if(stored){
            extra = new ItemExtraData().putString("stored", stored)
                                       .putInt("amount", this.liquidStorage.getAmount(stored));
        }
        this.region.dropAtBlock(coords, this.blockID, 1, 0, extra);
    }

}


(() => {

    const fuelAmount = 4000;
    const ingotAmount = MatValue.INGOT * 32;

    const tankFuel = new SearedTank(fuelAmount);
    const tankIngot = new SearedTank(ingotAmount);

    const tankInterface: StorageDescriptor = {
        liquidUnitRatio: 0.001,
        canReceiveLiquid(liquid: string, side: number): boolean {
            const stored = this.tileEntity.liquidStorage.getLiquidStored();
            return !stored || stored === liquid;
        },
        getInputTank(): ILiquidStorage {
            return this.tileEntity.liquidStorage;
        },
        getOutputTank(): ILiquidStorage {
            return this.tileEntity.liquidStorage;
        }
    }

    const modelOverrideFuel: ItemModel.ModelOverrideFunction = item => {
        if(item.extra){
            return TankModelManager.getItemModel(item.id, item.extra.getString("stored"), item.extra.getInt("amount") / fuelAmount);
        }
        return null;
    }

    const modelOverrideIngot: ItemModel.ModelOverrideFunction = item => {
        if(item.extra){
            return TankModelManager.getItemModel(item.id, item.extra.getString("stored"), item.extra.getInt("amount") / ingotAmount);
        }
        return null;
    }

    const dropFunc = () => [];

    const nameFunc: Callback.ItemNameOverrideFunction = (item, name) => {
        if(item.extra){
            const liquid = LiquidRegistry.getLiquidName(item.extra.getString("stored"));
            const amount = item.extra.getInt("amount");
            return name + "\n§7" + liquid + ": " + amount + " mB";
        }
        return name;
    }

    const placeFunc: Block.PlaceFunction = (coords, item, block, player, blockSource) => {
        const region = new WorldRegion(blockSource);
        const place = BlockRegistry.getPlacePosition(coords, block, blockSource);
        region.setBlock(place, item.id, item.data);
        const tile = region.addTileEntity(place);
        if(item.extra){
            tile.liquidStorage.setAmount(item.extra.getString("stored"), item.extra.getInt("amount"));
        }
    }

    TileEntity.registerPrototype(BlockID.tcon_tank_fuel, tankFuel);
    TileEntity.registerPrototype(BlockID.tcon_gauge_fuel, tankFuel);
    TileEntity.registerPrototype(BlockID.tcon_tank_ingot, tankIngot);
    TileEntity.registerPrototype(BlockID.tcon_gauge_ingot, tankIngot);

    StorageInterface.createInterface(BlockID.tcon_tank_fuel, tankInterface);
    StorageInterface.createInterface(BlockID.tcon_gauge_fuel, tankInterface);
    StorageInterface.createInterface(BlockID.tcon_tank_ingot, tankInterface);
    StorageInterface.createInterface(BlockID.tcon_gauge_ingot, tankInterface);

    ItemModel.getFor(BlockID.tcon_tank_fuel, -1).setModelOverrideCallback(modelOverrideFuel);
    ItemModel.getFor(BlockID.tcon_gauge_fuel, -1).setModelOverrideCallback(modelOverrideFuel);
    ItemModel.getFor(BlockID.tcon_tank_ingot, -1).setModelOverrideCallback(modelOverrideIngot);
    ItemModel.getFor(BlockID.tcon_gauge_ingot, -1).setModelOverrideCallback(modelOverrideIngot);
    
    Block.registerDropFunction(BlockID.tcon_tank_fuel, dropFunc);
    Block.registerDropFunction(BlockID.tcon_gauge_fuel, dropFunc);
    Block.registerDropFunction(BlockID.tcon_tank_ingot, dropFunc);
    Block.registerDropFunction(BlockID.tcon_gauge_ingot, dropFunc);
    
    Item.registerNameOverrideFunction(BlockID.tcon_tank_fuel, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_gauge_fuel, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_tank_ingot, nameFunc);
    Item.registerNameOverrideFunction(BlockID.tcon_gauge_ingot, nameFunc);
    
    Block.registerPlaceFunction(BlockID.tcon_tank_fuel, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_gauge_fuel, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_tank_ingot, placeFunc);
    Block.registerPlaceFunction(BlockID.tcon_gauge_ingot, placeFunc);

})();
