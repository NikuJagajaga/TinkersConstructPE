createBlock("tcon_blockcast", [{name: "Casting Basin", texture: [0, 1, 2]}]);
Recipes2.addShaped(BlockID.tcon_blockcast, "aaa:a_a:a_a", {a: ItemID.tcon_brick});

BlockModel.register(BlockID.tcon_blockcast, model => {
    const addBox = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number, rotation?: boolean): void => {
        model.addBox(x1/16, y1/16, z1/16, x2/16, y2/16, z2/16, BlockID.tcon_blockcast, 0);
        if(rotation){
            model.addBox((16-z2)/16, y1/16, x1/16, (16-z1)/16, y2/16, x2/16, BlockID.tcon_blockcast, 0);
            model.addBox((16-x2)/16, y1/16, (16-z2)/16, (16-x1)/16, y2/16, (16-z1)/16, BlockID.tcon_blockcast, 0);
            model.addBox(z1/16, y1/16, (16-x2)/16, z2/16, y2/16, (16-x1)/16, BlockID.tcon_blockcast, 0);
        }
    };
    addBox( 0, 13,  0,   2, 16, 14, true);
    addBox( 0,  5,  0,   7, 13,  2, true);
    addBox( 9,  5,  0,  14, 13,  2, true);
    addBox( 0,  2,  0,  16,  5, 16);
    addBox( 0,  0,  0,   5,  2,  5, true);
    return model;
});


class CastingBasin extends CastingTable {

    init(): void {
        this.animInput = createAnimItem(this.x + 0.5, this.y + 10/16, this.z + 0.5);
        this.animOutput = createAnimItem(this.x + 0.5, this.y + 10/16, this.z + 0.5);
        this.setAnimItem();
        this.setLiquidLimit();
        MoltenLiquid.initAnim(this, 0.5, 5/16, 0.5, 12/16, 11/16, 12/16);
    }

    setAnimItem(): void {
        const input = this.container.getSlot("slotInput");
        const output = this.container.getSlot("slotOutput");
        this.animInput.describeItem(input.id === 0 ? {id: 0, count: 0, data: 0} : {id: input.id, count: 1, data: input.data, size: 12/16 - 0.01});
        this.animOutput.describeItem(output.id === 0 ? {id: 0, count: 0, data: 0} : {id: output.id, count: 1, data: output.data, size: 12/16 - 0.01});
    }

    setLiquidLimit(): void {
        this.liquidStorage.liquidLimits = CastingRecipe.getBasinLimits(this.container.getSlot("slotInput").id);
    }

    isValidCast(id: number): boolean {
        return isBlockID(id);
    }

    getRecipe(stored: string): ICastingRecipe {
        return CastingRecipe.getBasinRecipe(this.container.getSlot("slotInput").id, stored);
    }

}


class CastingBasinInterface extends FluidTileInterface {
    canReceiveLiquid(liquid: string, side: number): boolean {
        const stored = this.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForBasin(this.container.getSlot("slotInput").id, liquid);
    }
}


TileEntity.registerPrototype(BlockID.tcon_blockcast, new CastingBasin());
StorageInterface.createInterface(BlockID.tcon_blockcast, new CastingBasinInterface());