class CraftingWindow2 {

    window: UI.StandardWindow;
    private container: ItemContainer;

    constructor(window: UI.StandardWindow){

        this.window = window;
        this.container = new ItemContainer();

        const windows = this.window.getAllWindows();
        const it = windows.iterator();
        while(it.hasNext()){
            it.next().setAsGameOverlay(true);
        }

        this.container.setParent(this);

		if (!this.container.getClientContainerTypeName()) {
			//this.setupContainer(container);
		}

		this.container.addServerCloseListener((container: ItemContainer, client: NetworkClient) => {
			const player = client.getPlayerUid();
			const {x, y, z} = Entity.getPosition(player);
			container.dropAt(BlockSource.getDefaultForActor(player), x, y, z);
		});

		this.container.addServerOpenListener((container: ItemContainer, client: NetworkClient) => {

		});
		

    }

    openFor(player: number): void {
        const client = Network.getClientForPlayer(player);
		if(!client){
			return;
		}
        this.container.openFor(client, "crop_analyser.ui");
    }

    private onUpdate(): void {

    }

}






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


Callback.addCallback("ItemUseLocal", (coords, item, touchBlock, player) => {

    if(Entity.getSneaking(player)) return;

    for(let {block, window} of CraftingWindow.blocks){
        if(block.id === touchBlock.id && (block.data === -1 || block.data === touchBlock.data)){
            window.open();
            Game.prevent();
            return;
        }
    }

});