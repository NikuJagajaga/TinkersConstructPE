createBlock("tcon_drain", [{name: "Seared Drain", texture: [0, 0, 1, 0, 0, 0]}]);
TileRenderer.setStandardModelWithRotation(BlockID.tcon_drain, 2, [0, 0, 1, 0, 0, 0].map(meta => ["tcon_drain", meta]));
TileRenderer.setRotationFunction(BlockID.tcon_drain);
Recipes2.addShaped(BlockID.tcon_drain, "a_a:a_a:a_a", {a: ItemID.tcon_brick});


class SearedDrain extends TconTileEntity {

    controller?: SmelteryControler;

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, playerUid: number): boolean {
        
        if(Entity.getSneaking(playerUid) && !this.controller) return true;

        const empty = LiquidItemRegistry.getEmptyItem(item.id, item.data);

        if(empty){
            const player = new PlayerEntity(playerUid);
            const soundName = MoltenLiquid.getTemp(empty.liquid) < 50 ? "bucket.empty_water" : "bucket.empty_lava";
            if(this.controller.totalLiquidAmount() + empty.amount <= this.controller.getLiquidCapacity()){
                this.controller.addLiquid(empty.liquid, empty.amount);
                item.count--;
                player.setCarriedItem(item);
                player.addItemToInventory(empty.id, 1, empty.data);
                this.region.playSound(coords, soundName);
                this.preventClick();
                return true;
            }
            if(item.count === 1 && empty.storage){
                item.data += this.controller.addLiquid(empty.liquid, empty.amount);
                player.setCarriedItem(item);
                this.region.playSound(coords, soundName);
                this.preventClick();
                return true;
            }
        }

        return false;

    }

}


TileEntity.registerPrototype(BlockID.tcon_drain, new SearedDrain());

StorageInterface.createInterface(BlockID.tcon_drain, {
    liquidUnitRatio: 0.001,
    getInputTank(side): ILiquidStorage {
        return this.tileEntity.controller || null;
    },
    getOutputTank(side): ILiquidStorage {
        return this.tileEntity.controller || null;
    }
});