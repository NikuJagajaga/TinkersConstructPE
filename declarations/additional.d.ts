declare namespace Flags {
    function addFlag(flag: string): boolean;
}

interface ItemInstance2 {
    id: number;
    count?: number;
    data?: number;
}

interface ItemInstance3 {
    item: string;
    count?: number;
    data?: number;
}

declare namespace Recipes2 {
    function addShaped(result: number | ItemInstance2, mask: string, source: {[key: string]: number | ItemInstance2}, func?: (api?: any, field?: ItemInstance[]) => void): void;
    function addShapeless(result: number | ItemInstance2, source: (number | ItemInstance2)[], func?: (api?: any, field?: ItemInstance[]) => void): void;
    function addShapedWith2x2(result: string | ItemInstance3, mask: string, source: {[key: string]: string | ItemInstance3}, name?: string): void;
    function addShapelessWith2x2(result: string | ItemInstance3, source: (string | ItemInstance3)[], name?: string): void;
}

declare namespace ConnectedTexture {
    function setModel(id: number, data: number, texture: string, groupName?: string): void;
    function setModelForGlass(id: number, data: number, texture: string, groupName?: string): void;
}