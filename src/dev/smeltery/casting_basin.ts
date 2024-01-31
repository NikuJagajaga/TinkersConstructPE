createBlock("tcon_blockcast", [{name: "Casting Basin", texture: [0, 1, 2]}]);
Recipes2.addShaped(BlockID.tcon_blockcast, "a_a:a_a:aaa", {a: ItemID.tcon_brick});

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

    @ClientSide
    override setupAnimPosScale(): void {
        this.animPos = {x: 0.5, y: 5/16, z: 0.5};
        this.animScale = {x: 12/16, y: 11/16, z: 12/16};
    }

    @ClientSide
    override setupAnimItem(): void {

        this.animInput = new Animation.Item(this.x + 0.5, this.y + 10/16, this.z + 0.5);
        this.animInput.load();
        this.animInput.setSkylightMode();

        this.animOutput = new Animation.Item(this.x + 0.5, this.y + 10/16, this.z + 0.5);
        this.animOutput.load();
        this.animOutput.setSkylightMode();

        this.updateAnimItem();
        this.networkData.addOnDataChangedListener((data: SyncedNetworkData, isExternal: boolean) => {
            this.updateAnimItem();
        });
        
    }

    @ClientSide
    override updateAnimItem(): void {
        const inputId = this.networkData.getInt("inputId");
        const inputData = this.networkData.getInt("inputData");
        const outputId = this.networkData.getInt("outputId");
        const outputData = this.networkData.getInt("outputData");
        const empty = {id: 0, count: 0, data: 0};
        this.animInput?.describeItem(inputId === 0 ? empty : {id: Network.serverToLocalId(inputId), count: 1, data: inputData, size: 12/16 - 0.01});
        this.animOutput?.describeItem(outputId === 0 ? empty : {id: Network.serverToLocalId(outputId), count: 1, data: outputData, size: 12/16 - 0.01});
    }

    override updateLiquidLimits(): void {
        this.liquidStorage.liquidLimits = CastingRecipe.getBasinLimits(this.container.getSlot("slotInput").id);
    }

    override isValidCast(id: number): boolean {
        return ItemRegistry.isBlock(id);
    }

    override getRecipe(stored: string): ICastingRecipe {
        return CastingRecipe.getBasinRecipe(this.container.getSlot("slotInput").id, stored);
    }

}


TileEntity.registerPrototype(BlockID.tcon_blockcast, new CastingBasin());

StorageInterface.createInterface(BlockID.tcon_blockcast, {

    liquidUnitRatio: 0.001,

    slots: {
        slotOutput: {output: true}
    },

    canReceiveLiquid(liquid: string, side: number): boolean {
        const input = this.container.getSlot("slotInput");
        const output = this.container.getSlot("slotOutput");
        const stored = this.tileEntity.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForBasin(input.id, liquid) && output.isEmpty();
    }

});