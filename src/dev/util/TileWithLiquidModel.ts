abstract class TileWithLiquidModel extends TconTileEntity {

    anim: Animation.Base;
    render: Render;

    @ClientSide animPos: Vector;
    @ClientSide animScale: Vector;
    @ClientSide animHeight: number;

    override putDefaultNetworkData(): void {
        this.networkData.putString("liquidStored", "");
        this.networkData.putFloat("liquidRelativeAmount", 0);
    }

    clientLoad(): void {
        this.render = new Render();
        this.anim = new Animation.Base(this.x + this.animPos.x, this.y + this.animPos.y - 1.5, this.z + this.animPos.z);
        this.anim.describe({render: this.render.getId(), skin: "model/tcon_liquids.png"});
        this.anim.load();
        this.anim.setSkylightMode();
        const amount = this.networkData.getFloat("liquidRelativeAmount");
        this.animHeight = 0;
        if(amount > 0){
            this.animHeight = amount;
            this.render.setPart("head", [{
                uv: {x: 0, y: MoltenLiquid.getY(this.networkData.getString("liquidStored"))},
                coords: {x: 0, y: -this.animHeight * 16 * this.animScale.y / 2, z: 0},
                size: {x: 16 * this.animScale.x, y: 16 * this.animScale.y * this.animHeight, z: 16 * this.animScale.z}
            }], MoltenLiquid.getTexScale());
            this.anim.refresh();
        }
    }

    clientUnload(): void {
        this.anim?.destroy();
    }

    clientTick(): void {
        const amount = this.networkData.getFloat("liquidRelativeAmount");
        const diff = amount - this.animHeight;
        const parts: Render.PartElement[] = [];
        let needRefresh = false;
        if(amount > 0){
            this.animHeight += diff * 0.2;
            this.animHeight = Math.round(this.animHeight * 100) / 100;
            if(Math.abs(diff) > 0.01){
                parts.push({
                    uv: {x: 0, y: MoltenLiquid.getY(this.networkData.getString("liquidStored"))},
                    coords: {x: 0, y: -this.animHeight * 16 * this.animScale.y / 2, z: 0},
                    size: {x: 16 * this.animScale.x, y: 16 * this.animScale.y * this.animHeight, z: 16 * this.animScale.z}
                });
                needRefresh = true;
            }
        }
        else if(this.animHeight !== 0){
            this.animHeight = 0;
            needRefresh = true;
        }
        if(needRefresh){
            this.render.setPart("head", parts, MoltenLiquid.getTexScale());
            this.anim.refresh();
        }
    }

    onTick(): void {
        const stored = this.liquidStorage.getLiquidStored() ?? "";
        const amount = this.liquidStorage.getRelativeAmount(stored);
        if(stored != this.networkData.getString("liquidStored") || amount !== this.networkData.getFloat("liquidRelativeAmount")){
            this.networkData.putString("liquidStored", stored);
            this.networkData.putFloat("liquidRelativeAmount", amount);
            this.networkData.sendChanges();
        }
    }

}