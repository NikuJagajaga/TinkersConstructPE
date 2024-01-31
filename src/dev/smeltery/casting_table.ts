createBlock("tcon_itemcast", [{name: "Casting Table", texture: [0, 1, 2]}]);
Recipes2.addShaped(BlockID.tcon_itemcast, "aaa:a_a:a_a", {a: ItemID.tcon_brick});

BlockModel.register(BlockID.tcon_itemcast, model => {
    model.addBox( 0/16, 15/16,  0/16, 15/16, 16/16,  1/16, BlockID.tcon_itemcast, 0);
    model.addBox(15/16, 15/16,  0/16, 16/16, 16/16, 15/16, BlockID.tcon_itemcast, 0);
    model.addBox( 1/16, 15/16, 15/16, 16/16, 16/16, 16/16, BlockID.tcon_itemcast, 0);
    model.addBox( 0/16, 15/16,  1/16,  1/16, 16/16, 16/16, BlockID.tcon_itemcast, 0);
    model.addBox( 0/16, 10/16,  0/16, 16/16, 15/16, 16/16, BlockID.tcon_itemcast, 0);
    model.addBox( 0/16,  0/16,  0/16,  5/16, 10/16,  5/16, BlockID.tcon_itemcast, 0);
    model.addBox( 0/16,  0/16, 11/16,  5/16, 10/16, 16/16, BlockID.tcon_itemcast, 0);
    model.addBox(11/16,  0/16,  0/16, 16/16, 10/16,  5/16, BlockID.tcon_itemcast, 0);
    model.addBox(11/16,  0/16, 11/16, 16/16, 10/16, 16/16, BlockID.tcon_itemcast, 0);
    return model;
});


class CastingTable extends TileWithLiquidModel {

    animInput: Animation.Item;
    animOutput: Animation.Item;

    override defaultValues = {
        progress: 0
    };

    override putDefaultNetworkData(): void {
        const input = this.container.getSlot("slotInput");
        const output = this.container.getSlot("slotOutput");
        this.networkData.putInt("inputId", input.id);
        this.networkData.putInt("inputData", input.data);
        this.networkData.putInt("outputId", output.id);
        this.networkData.putInt("outputData", output.data);
    }

    override clientLoad(): void {
        this.setupAnimPosScale();
        super.clientLoad();
        this.setupAnimItem();
    }

    @ClientSide
    setupAnimPosScale(): void {
        this.animPos = {x: 0.5, y: 60/64, z: 0.5};
        this.animScale = {x: 14/16, y: 1/16, z: 14/16};
    }

    @ClientSide
    setupAnimItem(): void {

        this.animInput = new Animation.Item(this.x + 9/16, this.y + 61/64, this.z + 9/16);
        this.animInput.load();
        this.animInput.setSkylightMode();

        this.animOutput = new Animation.Item(this.x + 9/16, this.y + 61/64, this.z + 9/16);
        this.animOutput.load();
        this.animOutput.setSkylightMode();

        this.updateAnimItem();
        this.networkData.addOnDataChangedListener((data: SyncedNetworkData, isExternal: boolean) => {
            this.updateAnimItem();
        });

    }

    override clientUnload(): void {
        super.clientUnload();
        this.animInput?.destroy();
        this.animOutput?.destroy();
    }

    override setupContainer(): void {
        this.updateLiquidLimits();
    }

    @ClientSide
    updateAnimItem(): void {
        const inputId = this.networkData.getInt("inputId");
        const inputData = this.networkData.getInt("inputData");
        const outputId = this.networkData.getInt("outputId");
        const outputData = this.networkData.getInt("outputData");
        const empty = {id: 0, count: 0, data: 0};
        this.animInput?.describeItem(inputId === 0 ? empty : {id: Network.serverToLocalId(inputId), count: 1, data: inputData, size: 14/16, rotation: [Math.PI/2, 0, 0]});
        this.animOutput?.describeItem(outputId === 0 ? empty : {id: Network.serverToLocalId(outputId), count: 1, data: outputData, size: 14/16, rotation: [Math.PI/2, 0, 0]});
    }

    updateLiquidLimits(): void {
        this.liquidStorage.liquidLimits = CastingRecipe.getTableLimits(this.container.getSlot("slotInput").id);
    }

    isValidCast(id: number): boolean {
        return ItemRegistry.isItem(id);
    }

    getRecipe(stored: string): ICastingRecipe {
        return CastingRecipe.getTableRecipe(this.container.getSlot("slotInput").id, stored);
    }

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, playerUid: number): boolean {

        if(this.liquidStorage.getLiquidStored()){
            return true;
        }

        const player = new PlayerEntity(playerUid);
        const input = this.container.getSlot("slotInput");
        const output = this.container.getSlot("slotOutput");

        if(output.id !== 0){
            output.dropAt(this.blockSource, this.x + 0.5, this.y + 1, this.z + 0.5);
        }
        else if(input.id !== 0){
            const result = CastingRecipe.getSandMoldingRecipe(item.id);
            if(input.id === ItemID.tcon_sandcast_blank && result){
                input.setSlot(result, 1, 0);
                output.setSlot(item.id, 1, item.data);
                player.decreaseCarriedItem();
            }
            else{
                input.dropAt(this.blockSource, this.x + 0.5, this.y + 1, this.z + 0.5);
            }
        }
        else if(this.isValidCast(item.id) && !item.extra){
            input.setSlot(item.id, 1, item.data);
            player.decreaseCarriedItem();
        }
        else{
            return true;
        }

        this.networkData.putInt("inputId", input.id);
        this.networkData.putInt("inputData", input.data);
        this.networkData.putInt("outputId", output.id);
        this.networkData.putInt("outputData", output.data);
        this.networkData.sendChanges();

        this.container.sendChanges();
        this.updateLiquidLimits();
        this.preventClick();
        return true;

    }

    override onTick(): void {

        super.onTick();

        const stored = this.liquidStorage.getLiquidStored();
        const slotInput = this.container.getSlot("slotInput");
        const slotOutput = this.container.getSlot("slotOutput");

        if(stored && this.liquidStorage.isFull(stored)){
            if(++this.data.progress < CastingRecipe.calcCooldownTime(stored, this.liquidStorage.getAmount(stored))){
                if((World.getThreadTime() & 15) === 0){
                    this.sendPacket("spawnParticle", {});
                }
            }
            else{
                const result = this.getRecipe(stored);
                if(result){
                    slotOutput.setSlot(result.id, 1, result.data);
                    result.consume && slotInput.clear();
                    this.sendPacket("spawnParticle", {});
                }
                this.data.progress = 0;
                this.liquidStorage.setAmount(stored, 0);
                for(let key in this.liquidStorage.liquidAmounts){
                    delete this.liquidStorage.liquidAmounts[key];
                }
                this.networkData.putInt("inputId", slotInput.id);
                this.networkData.putInt("inputData", slotInput.data);
                this.networkData.putInt("outputId", slotOutput.id);
                this.networkData.putInt("outputData", slotOutput.data);
                this.networkData.sendChanges();
            }
        }

        StorageInterface.checkHoppers(this);
        this.container.sendChanges();
        
    }

    @NetworkEvent(Side.Client)
    spawnParticle(data: {}): void {
        for(let i = 0; i < 4; i++){
            Particles.addParticle(EParticleType.SMOKE, this.x + Math.random(), this.y + 1, this.z + Math.random(), 0, 0, 0);
        }
    }

}




TileEntity.registerPrototype(BlockID.tcon_itemcast, new CastingTable());

StorageInterface.createInterface(BlockID.tcon_itemcast, {

    liquidUnitRatio: 0.001,

    slots: {
        slotOutput: {output: true}
    },

    canReceiveLiquid(liquid: string, side: number): boolean {
        const input = this.container.getSlot("slotInput");
        const output = this.container.getSlot("slotOutput");
        const stored = this.tileEntity.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForTable(input.id, liquid) && output.isEmpty();
    }

});