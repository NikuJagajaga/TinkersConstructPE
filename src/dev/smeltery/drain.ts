createBlock("tcon_drain", [{name: "Seared Drain", texture: [0, 0, 1, 0, 0, 0]}]);
TileRenderer.setStandardModelWithRotation(BlockID.tcon_drain, 2, [0, 0, 1, 0, 0, 0].map(meta => ["tcon_drain", meta]));
TileRenderer.setRotationFunction(BlockID.tcon_drain);
Recipes2.addShaped(BlockID.tcon_drain, "a_a:a_a:a_a", {a: ItemID.tcon_brick});


class SearedDrain extends TconTileEntity {

    controller: SmelteryControler;

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {



        return false;

    }

    /*

    click(id: number, count: number, data: number): boolean {
        if(this.controller && this.controller.isLoaded){
            let liquid = LiquidRegistry.getItemLiquid(id, data);
            if(MoltenLiquid.isExist(liquid)){
                const total = this.controller.totalLiquidAmount();
                const capacity = this.controller.getLiquidCapacity();
                if(total + 1000 <= capacity){
                    const empty = LiquidRegistry.getEmptyItem(id, data);
                    this.interface.addLiquid(liquid, 1, true);
                    Player.decreaseCarriedItem();
                    Player.addItemToInventory(empty.id, 1, empty.data);
                }
                return true;
            }
            liquid = this.interface.getLiquidStored();
            const full = LiquidRegistry.getFullItem(id, data, liquid);
            if(full && this.controller.liquidStorage.getAmount(liquid) >= 1000){
                this.interface.getLiquid(liquid, 1, true);
                Player.decreaseCarriedItem();
                Player.addItemToInventory(full.id, 1, full.data);
                return true;
            }
        }
        return false;
    }

    */

}



/*
class DrainInterface extends TileBase {
    getSmelteryInterface(): any {
        const tile = this.tileEntity.controller;
        return tile && tile.isLoaded ? tile.interface : null;
    }
    addLiquid(liquid: string, amount: number, onlyFullAmount: boolean): number {
        const inteface = this.getSmelteryInterface();
        return inteface ? inteface.addLiquid(liquid, amount, onlyFullAmount) : amount;
    }
    getLiquid(liquid: string, amount: number, onlyFullAmount: boolean): number {
        const inteface = this.getSmelteryInterface();
        return inteface ? inteface.getLiquid(liquid, amount, onlyFullAmount) : 0;
    }
    getLiquidStored(storage: string, side: number): string {
        const inteface = this.getSmelteryInterface();
        return inteface ? inteface.getLiquidStored(storage, side) : null;
    }
}
*/



TileEntity.registerPrototype(BlockID.tcon_drain, new SearedDrain());

StorageInterface.createInterface(BlockID.tcon_drain, {
    liquidUnitRatio: 0.001,
    getInputTank(side): ILiquidStorage {
        return null;
    },
    getOutputTank(side): ILiquidStorage {
        return null;
    }
});