abstract class CraftingWindow {

    static blocks: {block: Tile, window: CraftingWindow}[] = [];

    name: string;
    window: UI.StandardWindow;
    container: ItemContainer;

    constructor(windowName: string, window: UI.StandardWindow){

        this.name = windowName;
        this.window = window;
        this.container = new ItemContainer();

        const windows = this.window.getAllWindows();
        const it = windows.iterator();
        while(it.hasNext()){
            it.next().setAsGameOverlay(true);
        }
        this.window.setCloseOnBackPressed(true);

        this.container.setParent(this);
        this.container.setClientContainerTypeName(this.name);

        this.container.addServerOpenListener((container: ItemContainer, client: NetworkClient) => {
            this.onOpen();
        });

        this.container.addServerCloseListener((container: ItemContainer, client: NetworkClient) => {
            this.onClose();
            const player = client.getPlayerUid();
            const {x, y, z} = Entity.getPosition(player);
            container.dropAt(BlockSource.getDefaultForActor(player), x, y, z);
        });

        this.container.setGlobalAddTransferPolicy((container, slotName, id, amount, data, extra, player) => {
            if(this.isValidAddTransfer(slotName, id, amount, data, extra, player)){
                runOnMainThread(() => this.onUpdate());
                return amount;
            }
            return 0;
        });

        this.container.setGlobalGetTransferPolicy((container, slotName, id, amount, data, extra, player) => {
            if(this.isValidGetTransfer(slotName, id, amount, data, extra, player)){
                runOnMainThread(() => this.onUpdate());
                return amount;
            }
            return 0;
        });

        ItemContainer.registerScreenFactory(this.name, (container, name) => this.window);

    }

    isValidAddTransfer(slotName: string, id: number, amount: number, data: number, extra: ItemExtraData, player: number): boolean {
        return true;
    }

    isValidGetTransfer(slotName: string, id: number, amount: number, data: number, extra: ItemExtraData, player: number): boolean {
        return true;
    }

    openFor(player: number): void {
        const client = Network.getClientForPlayer(player);
        if(!client){
            return;
        }
        this.container.openFor(client, this.name);
    }

    onOpen(): void {
        this.onUpdate();
    }

    abstract onUpdate(): void;

    onClose(): void {

    }

    addTargetBlock(block: AnyID): void {
        CraftingWindow.blocks.push({block: getIDData(block, -1), window: this});
    }

}


Callback.addCallback("ItemUse", (coords, item, touchBlock, isExternal, player) => {

    if(Entity.getSneaking(player)) return;

    for(let {block, window} of CraftingWindow.blocks){
        if(block.id === touchBlock.id && (block.data === -1 || block.data === touchBlock.data)){
            window.openFor(player);
            Game.prevent();
            return;
        }
    }

});
