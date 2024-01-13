abstract class CraftingWindow {

    static blocks: {block: Tile, window: CraftingWindow}[] = [];

    name: string;
    window: UI.StandardWindow;
    containerByEntity: {[ent: number]: ItemContainer};

    constructor(windowName: string, window: UI.StandardWindow){

        this.name = windowName;
        this.window = window;
        this.containerByEntity = {};

        const windows = this.window.getAllWindows();
        const it = windows.iterator();
        while(it.hasNext()){
            it.next().setAsGameOverlay(true);
        }
        this.window.setCloseOnBackPressed(true);

        ItemContainer.registerScreenFactory(this.name, () => this.window);

        if(Cfg.SlotsLikeVanilla){
            VanillaSlots.registerForWindow(window);
        }

    }

    setupContainer(container: ItemContainer): void {

        container.setParent(this);
        container.setClientContainerTypeName(this.name);

        container.addServerOpenListener((con: ItemContainer, client: NetworkClient) => {
            this.onOpen(con);
            this.onUpdate(con);
        });

        container.addServerCloseListener((con: ItemContainer, client: NetworkClient) => {
            this.onClose(con);
            const actor = new PlayerActor(client.getPlayerUid());
            let slot: ItemContainerSlot;
            for(let key in con.slots){
                slot = con.slots[key];
                if(!slot.isEmpty()){
                    actor.addItemToInventory(slot.id, slot.count, slot.data, slot.extra, true);
                    slot.clear();
                }
            }
            con.sendChanges();
        });

        container.setGlobalAddTransferPolicy((con, slotName, id, amount, data, extra, player) => {
            if(this.isValidAddTransfer(con, slotName, id, amount, data, extra, player)){
                runOnMainThread(() => this.onUpdate(con));
                return amount;
            }
            return 0;
        });

        container.setGlobalGetTransferPolicy((con, slotName, id, amount, data, extra, player) => {
            if(this.isValidGetTransfer(con, slotName, id, amount, data, extra, player)){
                runOnMainThread(() => this.onUpdate(con));
                return amount;
            }
            return 0;
        });

        this.addServerEvents(container);

        if(Cfg.SlotsLikeVanilla){
            VanillaSlots.registerServerEventsForContainer(container);
        }

    }

    getContainerFor(player: number): ItemContainer {
        let container = this.containerByEntity[player];
        if(!container){
            container = new ItemContainer();
            this.setupContainer(container);
            this.containerByEntity[player] = container;
        }
        return container;
    }

    abstract addServerEvents(container: ItemContainer): void;

    isValidAddTransfer(container: ItemContainer, slotName: string, id: number, amount: number, data: number, extra: ItemExtraData, player: number): boolean {
        return true;
    }

    isValidGetTransfer(container: ItemContainer, slotName: string, id: number, amount: number, data: number, extra: ItemExtraData, player: number): boolean {
        return true;
    }

    openFor(player: number): void {
        const client = Network.getClientForPlayer(player);
        if(!client){
            return;
        }
        const container = this.getContainerFor(player);
        container.openFor(client, "main");
    }

    onOpen(container: ItemContainer): void {

    }

    onClose(container: ItemContainer): void {

    }

    abstract onUpdate(container: ItemContainer): void;

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
