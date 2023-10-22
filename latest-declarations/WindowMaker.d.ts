type Container = NativeTileEntity | UI.Container | ItemContainer;
type TouchEventType = "DOWN" | "UP" | "MOVE" | "CLICK" | "LONG_CLICK" | "CANCEL";
interface TouchEvent {
    x: number;
    y: number;
    localX: number;
    localY: number;
    type: TouchEventType;
    preparePosition: (win: UI.Window, rect: android.graphics.Rect) => void;
}
declare class WindowMaker {
    static readonly SCALE_RIGHT = 0;
    static readonly SCALE_UP = 1;
    static readonly SCALE_LEFT = 2;
    static readonly SCALE_DOWN = 3;
    static readonly CONTENT_SIZE: {
        width: number;
        height: number;
        ratio: number;
    };
    readonly width: number;
    readonly height: number;
    readonly scale: number;
    readonly posX: number;
    readonly ratio: number;
    readonly frame: string;
    z: number;
    readonly content: UI.WindowContent;
    readonly drawingMap: {
        [key: string]: UI.DrawingElements;
    };
    winOvl: UI.Window;
    winBase: UI.StandardWindow;
    withTooltip: boolean;
    constructor(title: string, width: number, height: number, frame?: string);
    enableTooltip(enable: boolean): this;
    private solveName;
    /**
     * @param io Specify the slot and tank to be used in the Recipe Viewer window by name.
     * @param drawings Specify the elements and drawing to be used in the Recipe Viewer window by name.
     *
     */
    getContentForRV(io: {
        input?: string[];
        output?: string[];
        inputLiq?: string[];
        outputLiq?: string[];
    }, other?: string[]): UI.WindowContent;
    protected adjustScale(elem: UI.DrawingElements | UI.Elements): void;
    getWidth(): number;
    getHeight(): number;
    /**
     *
     * @param name You can also name the drawing. If you are lazy, you can use an empty string.
     * @param drawing
     * @returns
     */
    addDrawing(name: string, drawing: UI.DrawingElements): this;
    /**
     *
     * @param name You can also name the element. If you are lazy, you can use an empty string.
     * @param elements
     * @returns
     */
    addElements(name: string, elements: UI.Elements): this;
    addSlot(name: string, x: number, y: number, size: number, bmpName?: string): this;
    addScale(name: string, x: number, y: number, bmpBack: string, bmpFront: string, direction?: 0 | 1 | 2 | 3, thickness?: number): this;
    addText(name: string, x: number, y: number, text: string, font?: number | UI.FontParams): this;
    addTextAsDrawing(name: string, x: number, y: number, text: string, font?: number | UI.FontParams): this;
    setClicker(name: string, clicker: UI.UIClickEvent): this;
    setValidItem(name: string, validFunc: (id: number, count: number, data: number, container: Container, item: ItemInstance) => boolean): this;
    makeWindow(): UI.StandardWindow;
    setTooltipFunc(elemName: string, tooltipFunc: (elem: UI.Element) => string): this;
    slotTooltip(slotElem: UI.Element): string;
    showTooltip(str: string, elem: UI.Element, eventX: number, eventY: number, eventType: TouchEventType): void;
}
