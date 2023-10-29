abstract class TconTileEntity extends TileEntityBase {

    data: this["defaultValues"];

    onInit(): void {
        this.networkData.putInt("blockId", this.blockID);
        this.networkData.putInt("blockData", this.blockSource.getBlockData(this.x, this.y, this.z));
        this.putDefaultNetworkData();
        this.networkData.sendChanges();
        this.setupContainer();
    }

    putDefaultNetworkData(): void {}
    setupContainer(): void {}

    setUiScale(name: string, numerator: number, denominator: number): void {
        this.container.setScale(name, denominator ? numerator / denominator : 0);
    }

    getScreenByName(screenName: string, container: ItemContainer): UI.IWindow {
        return null;
    }

}
