createBlock("tcon_faucet", [
    {name: "Seared Faucet"},
    {name: "faucet", isTech: true},
    {name: "faucet", isTech: true},
    {name: "faucet", isTech: true}
]);

Recipes2.addShaped(BlockID.tcon_faucet, "a_a:_a_", {a: ItemID.tcon_brick});

Block.registerPlaceFunction("tcon_faucet", (coords: Callback.ItemUseCoordinates, item: ItemInstance, block: Tile) => {
    if(coords.side < 2){
        return;
    }
    const c = World.canTileBeReplaced(block.id, block.data) ? coords : coords.relative;
    World.setBlock(c.x, c.y, c.z, item.id, coords.side - 2 ^ 1);
})

BlockModel.register(BlockID.tcon_faucet, (model, index) => {
    const addBox = (x1: number, y1: number, z1: number, x2: number, y2: number, z2: number): void => {
        switch(index){
            case 0: model.addBox(x1 / 16, y1 / 16, z1 / 16, x2 / 16, y2 / 16, z2 / 16, "tcon_faucet", 0); break;
            case 1: model.addBox(x1 / 16, y1 / 16, (16-z2) / 16, x2 / 16, y2 / 16, (16-z1) / 16, "tcon_faucet", 0); break;
            case 2: model.addBox(z1 / 16, y1 / 16, x1 / 16, z2 / 16, y2 / 16, x2 / 16, "tcon_faucet", 0); break;
            case 3: model.addBox((16-z2) / 16, y1 / 16, x1 / 16, (16-z1) / 16, y2 / 16, x2 / 16, "tcon_faucet", 0); break;
        }
        /*
        if(index & 1){
            z1 = 16 - z2;
            z2 = 16 - z1;
        }
        if(index >> 1){
            [x1, z1] = [z1, x1];
            [x2, z2] = [z2, x2];
        }
        model.addBox(x1 / 16, y1 / 16, z1 / 16, x2 / 16, y2 / 16, z2 / 16, "tcon_faucet", 0);
        */
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


class SearedFaucet extends TileBase {

    render: any;
    anim: any;

    defaultValues = {
        meta: 0
    };

    init(): void {
        this.data.meta = World.getBlock(this.x, this.y, this.z).data + 2;
        this.render = new Render();
        this.anim = new Animation.Base(this.x + 0.5, this.y - 1, this.z + 0.5);
        this.anim.describe({render: this.render.getID(), skin: "model/tcon_liquids.png"});
        this.anim.load();
        delete this.liquidStorage;
    }

    destroy(): void {
        this.anim && this.anim.destroy();
    }

    click(): boolean {

        const threadName = "tcon_faucet_" + this.x + ":" + this.y + ":" + this.z;
        const thread = Threading.getThread(threadName);
        if(thread && thread.isAlive()){
            return true;
        }

        const tileSend = StorageInterface.getNearestLiquidStorages(this, this.data.meta)[this.data.meta];
        const tileReceive = StorageInterface.getNearestLiquidStorages(this, 0)[0];
        if(!tileSend || !tileReceive){
            return true;
        }

        const iSend = tileSend.interface || tileSend.liquidStorage;
        const iReceive = tileReceive.interface || tileReceive.liquidStorage;
        if(!iSend || !iReceive){
            return true;
        }

        const liqSend = iSend.getLiquidStored();
        if(!liqSend){
            return true;
        }

        const dir = StorageInterface.directionsBySide[this.data.meta];
        const liquidY = MoltenLiquid.getY(liqSend);
        this.render.setPart("head", [
            {
                type: "box",
                uv: {x: 0, y: liquidY},
                coords: {x: dir.x * 5, y: 0, z: -dir.z * 5},
                size: {x: dir.x ? 6 : 4, y: 4, z: dir.z ? 6 : 4}
            },
            {
                type: "box",
                uv: {x: 0, y: liquidY},
                coords: {x: dir.x, y: 3, z: -dir.z},
                size: {x: dir.x ? 2 : 4, y: 10, z: dir.z ? 2 : 4}
            }
        ], MoltenLiquid.getTexScale());
        this.anim.refresh();

        Threading.initThread(threadName, () => {
            try{
                let add: number;
                let surplus: number;
                while(this.isLoaded){
                    if(!tileSend || !tileSend.isLoaded || !tileReceive || !tileReceive.isLoaded){
                        break;
                    }
                    if(!tileReceive.interface || tileReceive.interface.canReceiveLiquid(liqSend)){
                        add = iSend.getLiquid(liqSend, MatValue.INGOT / 1000);
                        surplus = iReceive.addLiquid(liqSend, add);
                        if(surplus > 0){
                            iSend.addLiquid(liqSend, surplus);
                        }
                        if(add === 0 || add === surplus){
                            break;
                        }
                    }
                    else{
                        break;
                    }
                    Thread.sleep(1000);
                }
                this.render.setPart("head", [], MoltenLiquid.getTexScale());
                this.anim.refresh();
            }
            catch(e){
                alert("FaucetEror: " + e);
            }
        });

        return true;

    }

}


TileEntity.registerPrototype(BlockID.tcon_faucet, new SearedFaucet());