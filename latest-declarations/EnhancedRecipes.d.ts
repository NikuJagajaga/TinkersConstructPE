declare namespace Recipes2 {
    type VanillaID = keyof typeof VanillaBlockID | keyof typeof VanillaItemID;
    type argItem = number | VanillaID | {id: number | VanillaID, count?: number, data?: number};
    function addShaped(result: argItem, mask: string | string[], sources: {[c: string]: argItem}, onCrafting?: Recipes.CraftingFunction): void;
    function addShapeless(result: argItem, sources: argItem[], onCrafting?: Recipes.CraftingFunction): void;
    function deleteRecipe(result: argItem): void;
    function addFurnace(source: argItem, result: argItem, prefix?: string): void;
    function removeFurnaceRecipe(source: argItem): void;
    function addFurnaceFuel(fuel: argItem, time: number): void;
    function removeFurnaceFuel(fuel: argItem): void;
    function getFurnaceRecipeResult(source: argItem, prefix?: string): ItemInstance;
    function getFuelBurnDuration(fuel: argItem): number;
}