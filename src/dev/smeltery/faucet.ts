createBlock("tcon_faucet", [
    {name: "Seared Faucet"},
    {name: "Seared Faucet", isTech: true},
    {name: "Seared Faucet", isTech: true},
    {name: "Seared Faucet", isTech: true}
]);

Recipes2.addShaped(BlockID.tcon_faucet, "a_a:_a_", {a: ItemID.tcon_brick});

Block.registerPlaceFunction("tcon_faucet", (coords, item, block, player, blockSource) => {
    if(coords.side < 2){
        return;
    }
    const region = new WorldRegion(blockSource);
    const place = BlockRegistry.getPlacePosition(coords, block, blockSource);
    region.setBlock(place, item.id, (coords.side - 2) ^ 1);
    region.addTileEntity(place);
})

BlockModel.register(BlockID.tcon_faucet, (model, index) => {
    const addBox = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void => {
        switch(index){
            case 0: model.addBox(x1 / 16, y1 / 16, z1 / 16, x2 / 16, y2 / 16, z2 / 16, "tcon_faucet", 0); break;
            case 1: model.addBox(x1 / 16, y1 / 16, (16-z2) / 16, x2 / 16, y2 / 16, (16-z1) / 16, "tcon_faucet", 0); break;
            case 2: model.addBox(z1 / 16, y1 / 16, x1 / 16, z2 / 16, y2 / 16, x2 / 16, "tcon_faucet", 0); break;
            case 3: model.addBox((16-z2) / 16, y1 / 16, x1 / 16, (16-z1) / 16, y2 / 16, x2 / 16, "tcon_faucet", 0); break;
        }
    }
    addBox( 4,  4,  0,  12,  6,  6);
    addBox( 4,  6,  0,   6, 10,  6);
    addBox(10,  6,  0,  12, 10,  6);
    return model;
}, 4);

Block.setShape(BlockID.tcon_faucet,  4/16,  4/16,  0/16, 12/16, 10/16,  6/16, 0);
Block.setShape(BlockID.tcon_faucet,  4/16,  4/16, 10/16, 12/16, 10/16, 16/16, 1);
Block.setShape(BlockID.tcon_faucet,  0/16,  4/16,  4/16,  6/16, 10/16, 12/16, 2);
Block.setShape(BlockID.tcon_faucet, 10/16,  4/16,  4/16, 16/16, 10/16, 12/16, 3);


class SearedFaucet extends TconTileEntity {

    render: Render;
    anim: Animation.Base;

    override defaultValues = {
        isActive: true,
        timer: 0,
        signal: 0
    };

    override putDefaultNetworkData(): void {
        this.networkData.putString("liquid", "");
    }

    override clientLoad(): void {

        this.render = new Render();
        this.anim = new Animation.Base(this.x + 0.5, this.y - 1, this.z + 0.5);
        this.anim.describe({render: this.render.getId(), skin: MoltenLiquid.PATH});
        this.anim.load();
        this.anim.setSkylightMode();

        this.renderLiquidModel();
        this.networkData.addOnDataChangedListener((data: SyncedNetworkData, isExternal: boolean) => {
            this.renderLiquidModel();
        });

    }

    override clientUnload(): void {
        this.anim?.destroy();
    }

    override onItemUse(coords: Callback.ItemUseCoordinates, item: ItemStack, player: number): boolean {
        if(Entity.getSneaking(player)) return true;
        this.data.isActive = this.turnOn();
        this.preventClick();
        return true;
    }

    override onRedstoneUpdate(signal: number): void {
        if(this.data.signal < signal){
            this.data.isActive = this.turnOn();
        }
        this.data.signal = signal;
    }

    @ClientSide
    renderLiquidModel(): void {

        const parts: Render.PartElement[] = [];
        const liquid = this.networkData.getString("liquid") + "";

        if(liquid !== ""){
            const dir = StorageInterface.directionsBySide[this.networkData.getInt("blockData") + 2];
            const liquidY = MoltenLiquid.getY(liquid);
            parts.push(
                {
                    uv: {x: 0, y: liquidY},
                    coords: {x: dir.x * 5, y: 0, z: -dir.z * 5},
                    size: {x: dir.x ? 6 : 4, y: 4, z: dir.z ? 6 : 4}
                },
                {
                    uv: {x: 0, y: liquidY},
                    coords: {x: dir.x, y: 3, z: -dir.z},
                    size: {x: dir.x ? 2 : 4, y: 10, z: dir.z ? 2 : 4}
                }
            );
        }

        this.render.setPart("head", parts, MoltenLiquid.getTexScale());
        this.anim.refresh();

    }

    turnOn(): boolean {

        const blockData = this.networkData.getInt("blockData");

        const iSend = StorageInterface.getNeighbourLiquidStorage(this.blockSource, this, blockData + 2);
        const iReceive = StorageInterface.getNeighbourLiquidStorage(this.blockSource, this, 0);
        const sideSend = (blockData + 2) ^ 1;
        const sideReceive = 1;
        const tankSend = iSend?.getOutputTank(sideSend);
        const tankReceive = iReceive?.getInputTank(sideReceive);

        if(!tankSend || !tankReceive){
            this.networkData.putString("liquid", "");
            this.networkData.sendChanges();
            return false;
        }

        const liquid = tankSend.getLiquidStored();
        let amount = 0;

        if (liquid && iSend.canTransportLiquid(liquid, sideSend) && iReceive.canReceiveLiquid(liquid, sideReceive) && !tankReceive.isFull(liquid)) {
            amount = Math.min(tankSend.getAmount(liquid) * iSend.liquidUnitRatio, MatValue.INGOT / 1000);
            amount = iReceive.receiveLiquid(tankReceive, liquid, amount);
            iSend.extractLiquid(tankSend, liquid, amount);
        }

        if(amount > 0){
            this.networkData.putString("liquid", liquid);
            this.networkData.sendChanges();
            return true;
        }

        this.networkData.putString("liquid", "");
        this.networkData.sendChanges();
        return false;

    }

    override onTick(): void {

        if(this.data.isActive){

            if(++this.data.timer >= 20){
                this.data.isActive = this.turnOn();
                this.data.timer = 0;
            }

        }
        else{
            this.data.timer = 0;
        }
        
    }

}


TileEntity.registerPrototype(BlockID.tcon_faucet, new SearedFaucet());