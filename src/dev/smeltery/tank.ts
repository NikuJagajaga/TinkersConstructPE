createBlock("tcon_tank", [
    {name: "Seared Tank", texture: [["tcon_stone", 6], ["tcon_stone", 6], 0]},
    {name: "Seared Glass", texture: [["tcon_seared_glass", 0], ["tcon_seared_glass", 0], 1]},
    {name: "Seared Window", texture: [["tcon_seared_glass", 0], ["tcon_seared_glass", 0], 2]}
]);

Item.addCreativeGroup("tcon_tank", "Seared Tanks", [BlockID.tcon_tank]);
Recipes2.addShaped({id: BlockID.tcon_tank, data: 0}, "aaa:aba:aaa", {a: ItemID.tcon_brick, b: VanillaBlockID.glass});
Recipes2.addShaped({id: BlockID.tcon_tank, data: 1}, "aba:aba:aba", {a: ItemID.tcon_brick, b: VanillaBlockID.glass});
Recipes2.addShaped({id: BlockID.tcon_tank, data: 2}, "aba:bbb:aba", {a: ItemID.tcon_brick, b: VanillaBlockID.glass});

BlockModel.register(BlockID.tcon_tank, (model, index) => {
    model.addBox( 0/16,  0/16,  0/16, 16/16, 16/16, 16/16, BlockID.tcon_tank, index);
    index === 0 && model.addBox( 2/16, 16/16,  2/16, 14/16, 18/16, 14/16, BlockID.tcon_tank, 0);
    return model;
}, 3);


Block.registerDropFunction("tcon_tank", () => []);
Item.registerNameOverrideFunction(BlockID.tcon_tank, (item, name) => item.extra ? name + "\n§7" + LiquidRegistry.getLiquidName(item.extra.getString("stored")) + ": " + (item.extra.getInt("amount")) + " mB" : name);


Block.registerPlaceFunction(BlockID.tcon_tank, (coords, item, block) => {
    const c = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
    World.setBlock(c.x, c.y, c.z, item.id, item.data);
    const tile = World.addTileEntity(c.x, c.y, c.z);
    item.extra && tile.liquidStorage.addLiquid(item.extra.getString("stored"), item.extra.getInt("amount"));
});


class SearedTank extends TileBase {

    render: any;
    anim: any;

    init(): void {
        this.liquidStorage.setLimit(null, 4000);
        MoltenLiquid.initAnim(this, 0.5, 0, 0.5, 31/32, 31/32, 31/32);
    }

    destroy(): void {
        this.anim && this.anim.destroy();
    }

    click(id: number, count: number, data: number): boolean {
        const stored = this.liquidStorage.getLiquidStored();
        const amount = this.liquidStorage.getAmount(stored);
        const liquid = LiquidRegistry.getItemLiquid(id, data);
        if(MoltenLiquid.isExist(liquid)){
            if(!stored || stored === liquid && amount + 1000 <= this.liquidStorage.getLimit(stored)){
                const empty = LiquidRegistry.getEmptyItem(id, data);
                this.liquidStorage.addLiquid(liquid, 1000);
                Player.decreaseCarriedItem();
                Player.addItemToInventory(empty.id, 1, empty.data);
            }
            return true;
        }
        const full = LiquidRegistry.getFullItem(id, data, stored);
        if(full && amount >= 1000){
            this.liquidStorage.getLiquid(stored, 1000);
            Player.decreaseCarriedItem();
            Player.addItemToInventory(full.id, 1, full.data);
            return true;
        }
        return false;
    }

    consumeFuel(): {duration: number, temp: number} {
        const liquid = this.liquidStorage.getLiquidStored();
        const amount = this.liquidStorage.getAmount(liquid);
        const fuelData = SmelteryFuel.getFuel(liquid);
        if(fuelData && amount >= fuelData.amount){
            this.liquidStorage.getLiquid(liquid, fuelData.amount);
            return {duration: fuelData.duration, temp: fuelData.temp};
        }
        return null;
    }

    destroyBlock(): void {
        const liquid = this.liquidStorage.getLiquidStored();
        let extra: ItemExtraData;
        if(liquid){
            extra = new ItemExtraData();
            extra.putString("stored", liquid);
            extra.putInt("amount", this.liquidStorage.getAmount(liquid));
        }
        World.drop(this.x + 0.5, this.y, this.z + 0.5, this.blockID, 1, World.getBlock(this.x, this.y, this.z).data, extra);
    }

}


abstract class FluidTileInterface extends TileBase {
    addLiquid(liquid: string, amount: number, onlyFullAmount: boolean): number {
        const limit = this.liquidStorage.getLimit(liquid);
        const stored = this.liquidStorage.getAmount(liquid);
        const result = Math.round(stored + amount * 1000);
        const left = result - Math.min(limit, result);
        if(!onlyFullAmount || left <= 0){
            this.liquidStorage.setAmount(liquid, result - left);
            return Math.max(left / 1000, 0);
        }
        return amount;
    }
    getLiquid(liquid: string, amount: number, onlyFullAmount: boolean): number {
        const amountMilli = Math.round(amount * 1000);
        let stored = this.liquidStorage.getAmount(liquid);
        if(!this.liquidStorage.getLiquid_flag && this.tileEntity && stored < amountMilli){
            this.liquidStorage.getLiquid_flag = true;
            this.tileEntity.requireMoreLiquid(liquid, amountMilli - stored);
            this.liquidStorage.getLiquid_flag = false;
            stored = this.liquidStorage.getAmount(liquid);
        }
        const got = Math.min(stored, amountMilli);
        if(!onlyFullAmount || got >= amountMilli){
            this.liquidStorage.setAmount(liquid, stored - got);
            return got / 1000;
        }
        return 0;
    }
    abstract canReceiveLiquid(liquid: string, side: number): boolean;
}


class TankInterface extends FluidTileInterface {
    canReceiveLiquid(liquid: string, side: number): boolean {
        const stored = this.liquidStorage.getLiquidStored();
        return !stored || stored === liquid;
    }
}




TileEntity.registerPrototype(BlockID.tcon_tank, new SearedTank());
StorageInterface.createInterface(BlockID.tcon_tank, new TankInterface());