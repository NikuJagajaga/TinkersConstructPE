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


class CastingTable extends TileBase {

    render: any;
    anim: any;
    animInput: any;
    animOutput: any;

    defaultValues = {
        progress: 0
    };

    init(): void {
        this.animInput = createAnimItem(this.x + 9/16, this.y + 31/32, this.z + 9/16);
        this.animOutput = createAnimItem(this.x + 9/16, this.y + 31/32, this.z + 9/16);
        this.setAnimItem();
        this.setLiquidLimit();
        MoltenLiquid.initAnim(this, 0.5, 15/16, 0.5, 14/16, 1/16, 14/16, true);
    }

    destroy(): void {
        this.anim && this.anim.destroy();
        this.animInput && this.animInput.destroy();
        this.animOutput && this.animOutput.destroy();
    }

    setAnimItem(): void {
        const input = this.container.getSlot("slotInput");
        const output = this.container.getSlot("slotOutput");
        this.animInput.describeItem(input.id === 0 ? {id: 0, count: 0, data: 0} : {id: input.id, count: 1, data: input.data, size: 14/16, rotation: [Math.PI/2, 0, 0]});
        this.animOutput.describeItem(output.id === 0 ? {id: 0, count: 0, data: 0} : {id: output.id, count: 1, data: output.data, size: 14/16, rotation: [Math.PI/2, 0, 0]});
    }

    setLiquidLimit(): void {
        this.liquidStorage.liquidLimits = CastingRecipe.getTableLimits(this.container.getSlot("slotInput").id);
    }

    isValidCast(id: number): boolean {
        return isItemID(id);
    }

    click(id: number, count: number, data: number): boolean {
        if(this.liquidStorage.getLiquidStored()){
            return false;
        }
        label: {
            if(this.container.getSlot("slotOutput").id !== 0){
                this.container.dropSlot("slotOutput", this.x + 0.5, this.y + 1, this.z + 0.5);
                break label;
            }
            if(this.container.getSlot("slotInput").id !== 0){
                this.container.dropSlot("slotInput", this.x + 0.5, this.y + 1, this.z + 0.5);
                break label;
            }
            if(this.isValidCast(id) && !Player.getCarriedItem().extra){
                this.container.setSlot("slotInput", id, 1, data);
                Player.decreaseCarriedItem();
                break label;
            }
            return false;
        }
        //this.setAnimItem();
        this.setLiquidLimit();
        return true;
    }

    spawnParticle(id: number): void {
        for(let i = 0; i < 4; i++){
            Particles.addParticle(id, this.x + Math.random(), this.y + 1, this.z + Math.random(), 0, 0, 0);
        }
    }

    getRecipe(stored: string): ICastingRecipe {
        return CastingRecipe.getTableRecipe(this.container.getSlot("slotInput").id, stored);
    }

    tick(): void {
        const stored = this.liquidStorage.getLiquidStored();
        if(stored && this.liquidStorage.isFull(stored)){
            if(++this.data.progress < CastingRecipe.calcCooldownTime(stored, this.liquidStorage.getAmount(stored))){
                (World.getThreadTime() & 15) === 0 && this.spawnParticle(Native.ParticleType.smoke);
            }
            else{
                const result = this.getRecipe(stored);
                if(result){
                    this.container.setSlot("slotOutput", result.id, 1, result.data);
                    result.consume && this.container.clearSlot("slotInput");
                    this.spawnParticle(Native.ParticleType.flame);
                }
                this.data.progress = 0;
                this.liquidStorage.setAmount(stored, 0);
                for(let key in this.liquidStorage.liquidAmounts){
                    delete this.liquidStorage.liquidAmounts[key];
                }
            }
        }
        this.setAnimItem();
        StorageInterface.checkHoppers(this);
    }

}


class CastingTableInterface extends FluidTileInterface {

    slots = {
        slotOutput: {output: true}
    };

    canReceiveLiquid(liquid: string, side: number): boolean {
        const stored = this.liquidStorage.getLiquidStored();
        return (!stored || stored === liquid) && CastingRecipe.isValidLiquidForTable(this.container.getSlot("slotInput").id, liquid);
    }

}


TileEntity.registerPrototype(BlockID.tcon_itemcast, new CastingTable());
StorageInterface.createInterface(BlockID.tcon_itemcast, new CastingTableInterface());