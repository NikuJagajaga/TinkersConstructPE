createBlock("tcon_tank", [
    {name: "Seared Tank", texture: [["tcon_stone", 6], ["tcon_stone", 6], 0]},
    {name: "Seared Glass", texture: [["tcon_seared_glass", 0], ["tcon_seared_glass", 0], 1]},
    {name: "Seared Window", texture: [["tcon_seared_glass", 0], ["tcon_seared_glass", 0], 2]}
]);

Item.addCreativeGroup("tcon_tank", "Seared Tanks", [BlockID.tcon_tank]);
Recipes2.addShaped({id: BlockID.tcon_tank, data: 0}, "aaa:aba:aaa", {a: ItemID.tcon_brick, b: "glass"});
Recipes2.addShaped({id: BlockID.tcon_tank, data: 1}, "aba:aba:aba", {a: ItemID.tcon_brick, b: "glass"});
Recipes2.addShaped({id: BlockID.tcon_tank, data: 2}, "aba:bbb:aba", {a: ItemID.tcon_brick, b: "glass"});

BlockModel.register(BlockID.tcon_tank, (model, index) => {
    model.addBox( 0/16,  0/16,  0/16, 16/16, 16/16, 16/16, BlockID.tcon_tank, index);
    index === 0 && model.addBox( 2/16, 16/16,  2/16, 14/16, 18/16, 14/16, BlockID.tcon_tank, 0);
    return model;
}, 3);


Block.registerDropFunction("tcon_tank", () => []);

Item.registerNameOverrideFunction(BlockID.tcon_tank, (item, name) => {
    if(item.extra){
        const liquid = LiquidRegistry.getLiquidName(item.extra.getString("stored"));
        const amount = item.extra.getInt("amount");
        return name + "\n§7" + liquid + ": " + amount + " mB";
    }
    return name;
});


Block.registerPlaceFunction(BlockID.tcon_tank, (coords, item, block, player, blockSource) => {
    const region = new WorldRegion(blockSource);
    const place = BlockRegistry.getPlacePosition(coords, block, blockSource);
    region.setBlock(place, item.id, item.data);
    const tile = region.addTileEntity(place);
    if(item.extra){
        tile.liquidStorage.setAmount(item.extra.getString("stored"), item.extra.getInt("amount"));
    }
});


class SearedTank extends TileWithLiquidModel {

    @ClientSide animPos: Vector;
    @ClientSide animScale: Vector;

    override clientLoad(): void {
        this.animPos = {x: 0.5, y: 0, z: 0.5};
        this.animScale = {x: 31/32, y: 31/32, z: 31/32};
        super.clientLoad();
    }

    override setupContainer(): void {
        this.liquidStorage.setLimit(null, 4000);
    }

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, playerUid: number): boolean {

        if(Entity.getSneaking(playerUid)) return true;

        const player = new PlayerEntity(playerUid);
        const stored = this.liquidStorage.getLiquidStored();
        const empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);

        if(empty){
            if(stored === empty.liquid || !stored){
                if(this.liquidStorage.getLimit(stored) - this.liquidStorage.getAmount(stored) >= empty.amount){
                    this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    item.count--;
                    player.setCarriedItem(item);
                    player.addItemToInventory(empty.id, 1, empty.data);
                    this.preventClick();
                    return true;
                }
                if(item.count === 1 && empty.storage){
                    item.data += this.liquidStorage.addLiquid(empty.liquid, empty.amount);
                    player.setCarriedItem(item);
                    this.preventClick();
                    return true;
                }
            }
        }

        if(stored){
            const full = LiquidItemRegistry.getFullItem(item.id, item.data, stored);
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
                    this.preventClick();
                    return true;
                }
                if(item.count === 1 && full.storage){
                    player.setCarriedItem(full.id, 1, full.amount - this.liquidStorage.getLiquid(stored, full.amount));
                    this.preventClick();
                    return true;
                }
            }
        }

        return false;

    }

    override destroyBlock(coords: Callback.ItemUseCoordinates, player: number): void {
        const region = WorldRegion.getForActor(player);
        const stored = this.liquidStorage.getLiquidStored();
        let extra: ItemExtraData;
        if(stored){
            extra = new ItemExtraData();
            extra.putString("stored", stored);
            extra.putInt("amount", this.liquidStorage.getAmount(stored));
        }
        region.dropItem(this.x + 0.5, this.y, this.z + 0.5, this.blockID, 1, this.networkData.getInt("blockData"), extra);
    }

}


TileEntity.registerPrototype(BlockID.tcon_tank, new SearedTank());

StorageInterface.createInterface(BlockID.tcon_tank, {
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
});
