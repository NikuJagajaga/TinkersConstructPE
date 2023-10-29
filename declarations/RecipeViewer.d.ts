/// <reference path="core-engine.d.ts" />
declare type ItemType = "block" | "item";
declare interface ItemInfo {
    id: number;
    data: number;
    name: string;
    type: ItemType;
}
declare interface LiquidInstance {
    liquid: string,
    amount: number;
}
declare interface RecipePattern {
    input?: ItemInstance[],
    output?: ItemInstance[],
    inputLiq?: LiquidInstance[],
    outputLiq?: LiquidInstance[],
    [key: string]: any;
}
declare interface OldRecipeContents {
    icon: Tile | number;
    description?: string;
    params?: UI.BindingsSet;
    drawing?: UI.DrawingSet;
    elements: {[key: string]: Partial<UI.UIElement>};
}
declare interface OldRecipeTypeProperty {
    title?: string;
    contents: OldRecipeContents;
    recipeList?: RecipePattern[];
    getList?: (id: number, data: number, isUsage: boolean) => RecipePattern[];
    getAllList?: () => RecipePattern[];
    onOpen?: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern) => void;
}
declare interface RecipeTE {
    type: "grid" | "line" | "not_shape";
    recipe: string[] | string[][];
    ingredients: {[key: string]: ItemInstance};
    result: ItemInstance;
}
/** @deprecated */
declare interface RecipeViewerOld {
    registerRecipeType(key: string, obj: OldRecipeTypeProperty): void;
    getIOFromTEWorkbench(recipe: RecipeTE, cols: number): RecipePattern;
    registerTEWorkbenchRecipeType(sid: string, contents: OldRecipeContents, recipes: RecipeTE[]): void;
    removeDuplicate(item1: ItemInfo, index: number, array: ItemInfo[]): boolean;
    getName(id: number, data?: number): string;
    addList(id: number, data: number, type?: ItemType): void;
    addListByData(id: number, data: number, type?: ItemType): void;
    openRecipePage(key: string, container: UI.Container): void;
    putButtonOnNativeGui(screen: string, key: string): void;
}
declare interface RecipeContents {
    params?: UI.BindingsSet,
    drawing?: UI.DrawingSet,
    elements: {[key: string]: Partial<UI.Elements>};
}
declare abstract class RecipeType {
    constructor(name: string, icon: number | Tile, content: RecipeContents);
    setDescription(text: string): this;
    setTankLimit(limit: number): this;
    abstract getAllList(): RecipePattern[];
    getList(id: number, data: number, isUsage: boolean): RecipePattern[];
    onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void;
    slotTooltip(name: string, item: ItemInstance, tips: {
        [key: string]: any;
    }): string;
    tankTooltip(name: string, liquid: LiquidInstance, tips: {
        [key: string]: any;
    }): string;
}
declare interface RecipeTypeRegistry {
    register(key: string, recipeType: RecipeType): void;
    openRecipePage(key: string | string[]): void;
}
declare interface ItemList {
    get(): ItemInfo[];
    getItemType(id: number): ItemType;
    addToList(id: number, data: number, type?: ItemType): void;
    addToListByData(id: number, data: number | number[], type?: ItemType): void;
    addVanillaItems(): void;
    addModItems(): void;
    getName(id: number, data?: number): string;
    setup(): void;
}
declare interface RecipeViewerAPI {
    Core: RecipeViewerOld;
    ItemList: ItemList;
    RecipeType: typeof RecipeType;
    RecipeTypeRegistry: RecipeTypeRegistry;
}
declare namespace ModAPI {
    function addAPICallback(apiName: "RecipeViewer", func: (api: RecipeViewerAPI) => void): void;
}
