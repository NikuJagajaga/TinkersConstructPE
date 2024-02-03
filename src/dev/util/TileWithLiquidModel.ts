abstract class TileWithLiquidModel extends TconTileEntity {

    anim: Animation.Base;
    render: Render;
    //mesh: RenderMesh;

    animPos: Vector;
    animScale: Vector;
    animHeight: number;

    override putDefaultNetworkData(): void {
        this.networkData.putString("liquidStored", "");
        this.networkData.putFloat("liquidRelativeAmount", 0);
    }

    override clientLoad(): void {
        this.render = new Render();
        this.anim = new Animation.Base(this.x + this.animPos.x, this.y + this.animPos.y - 1.5, this.z + this.animPos.z);
        this.anim.describe({render: this.render.getId(), skin: MoltenLiquid.PATH});
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

    override clientUnload(): void {
        this.anim?.destroy();
    }

    override clientTick(): void {
        const amount = this.networkData.getFloat("liquidRelativeAmount");
        const diff = amount - this.animHeight;
        if(amount > 0){
            if(diff !== 0){
                if(Math.abs(diff) > 0.01){
                    this.animHeight += diff * 0.2;
                }
                else{
                    this.animHeight = amount;
                }
                this.render.setPart("head", [{
                    uv: {x: 0, y: MoltenLiquid.getY(this.networkData.getString("liquidStored"))},
                    coords: {x: 0, y: -this.animHeight * 16 * this.animScale.y / 2, z: 0},
                    size: {x: 16 * this.animScale.x, y: 16 * this.animScale.y * this.animHeight, z: 16 * this.animScale.z}
                }], MoltenLiquid.getTexScale());
                this.anim.refresh();
            }
        }
        else if(this.animHeight !== 0){
            this.animHeight = 0;
            this.render.setPart("head", [], MoltenLiquid.getTexScale());
            this.anim.refresh();
        }
    }

    override onTick(): void {
        const stored = this.liquidStorage.getLiquidStored() ?? "";
        const amount = this.liquidStorage.getRelativeAmount(stored);
        if(stored != this.networkData.getString("liquidStored") || amount !== this.networkData.getFloat("liquidRelativeAmount")){
            this.networkData.putString("liquidStored", stored);
            this.networkData.putFloat("liquidRelativeAmount", amount);
            this.networkData.sendChanges();
        }
    }

}