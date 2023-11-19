abstract class CraftingWindow {

    static blocks: {block: Tile, window: CraftingWindow}[] = [];

    container: UI.Container;
    window: UI.StandardWindow;
    sleepTime: number;

    constructor(window: UI.StandardWindow, fps: number = 20){

        this.window = window;
        this.container = new UI.Container();

        this.window.getWindow("content").setEventListener({
            onOpen: window => {
                this.onOpen(window);
            },
            onClose: window => {
                this.onClose(window);
            }
        });

        this.sleepTime = 1000 / fps | 0;

    }

    setTargetBlock(id: number, data: number = -1): void {
        CraftingWindow.blocks.push({block: {id: id, data: data}, window: this});
    }

    open(): void {
        this.container.openAs(this.window);
    }

    abstract onUpdate(elements: java.util.HashMap<string, UI.Element>): void;

    private onOpen(window: UI.Window): void {

        Threading.initThread("CraftingWindow", () => {

            const elements = window.getElements();

            while(window.isOpened()){
                this.onUpdate(elements);
                Thread.sleep(this.sleepTime);
            }

        });

    }

    private onClose(window: UI.Window): void {
        const pos = Player.getPosition();
        this.container.dropAt(pos.x, pos.y, pos.z);
    }

}


Callback.addCallback("ItemUseLocal", (coords, item, block, player) => {

    if(Entity.getSneaking(player)) return;

    let block2: Tile;

    for(let i = 0; i < CraftingWindow.blocks.length; i++){
        block2 = CraftingWindow.blocks[i].block;
        if(block.id === block2.id && (block2.data === -1 || block.data === block2.data)){
            CraftingWindow.blocks[i].window.open();
            return;
        }
    }

});