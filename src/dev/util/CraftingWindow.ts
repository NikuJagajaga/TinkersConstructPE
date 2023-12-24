abstract class CraftingWindow {

    static blocks: {block: Tile, window: CraftingWindow}[] = [];

    container: UI.Container;
    window: UI.StandardWindow;
    sleepTime: number;

    constructor(window: UI.StandardWindow, fps: number = 20){

        const windows = window.getAllWindows();
        const it = windows.iterator();
        while(it.hasNext()){
            it.next().setAsGameOverlay(true);
        }

        this.window = window;
        this.container = new UI.Container();

        this.window.getWindow("content").setEventListener({
            onOpen: win => {
                this.onOpen(win);
            },
            onClose: win => {
                this.onClose(win);
            }
        });

        this.sleepTime = 1000 / fps | 0;

    }

    addTargetBlock(block: AnyID): void {
        CraftingWindow.blocks.push({block: getIDData(block, -1), window: this});
    }

    open(): void {
        this.container.openAs(this.window);
    }

    abstract onUpdate(elements: java.util.HashMap<string, UI.Element>): void;

    onOpen(window: UI.Window): void {

        Threading.initThread("CraftingWindow", () => {

            const elements = window.getElements();

            while(window.isOpened()){
                try{
                    this.onUpdate(elements);
                }
                catch(e){
                    alert("onUpdate: " + e);
                }
                Thread.sleep(this.sleepTime);
            }

        });

    }

    onClose(window: UI.Window): void {
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
            Game.prevent();
            return;
        }
    }

});