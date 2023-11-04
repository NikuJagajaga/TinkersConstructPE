createBlock("tcon_drain", [{name: "Seared Drain", texture: [0, 0, 1, 0, 0, 0]}]);
TileRenderer.setStandardModelWithRotation(BlockID.tcon_drain, 2, [0, 0, 1, 0, 0, 0].map(meta => ["tcon_drain", meta]));
TileRenderer.setRotationFunction(BlockID.tcon_drain);
Recipes2.addShaped(BlockID.tcon_drain, "a_a:a_a:a_a", {a: ItemID.tcon_brick});


class SearedDrain extends TconTileEntity {

    controller: SmelteryControler;

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {



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