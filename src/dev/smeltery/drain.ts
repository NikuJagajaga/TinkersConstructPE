createBlock("tcon_drain", [{name: "Seared Drain", texture: [0, 0, 1, 0, 0, 0]}]);
registerRotationModel("tcon_drain", [0, 0, 1, 0, 0, 0]);
Recipes2.addShaped(BlockID.tcon_drain, "a_a:a_a:a_a", {a: ItemID.tcon_brick});


class SearedDrain extends TileBase {

    controller: TileEntity;

    setController(tile: TileEntity): void {
        this.controller = tile;
    }

    init(): void {
        TileRenderer.mapAtCoords(this.x, this.y, this.z, this.blockID, this.data.meta);
    }

    destroy(): void {
        BlockRenderer.unmapAtCoords(this.x, this.y, this.z);
    }

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

}


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




TileEntity.registerPrototype(BlockID.tcon_drain, new SearedDrain());
TileRenderer.setRotationPlaceFunction(BlockID.tcon_drain);
StorageInterface.createInterface(BlockID.tcon_drain, new DrainInterface());