abstract class TconTileEntity extends TileEntityBase {

    override data: this["defaultValues"];

    override onInit(): void {
        this.networkData.putInt("blockId", this.blockID);
        this.networkData.putInt("blockData", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.putDefaultNetworkData();
        this.networkData.sendChanges();
        this.setupContainer();
    }

    putDefaultNetworkData(): void {}
    setupContainer(): void {}

    override getScreenByName(screenName: string, container: ItemContainer): UI.IWindow {
        return null;
    }

}
