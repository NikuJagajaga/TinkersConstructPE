var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
LIBRARY({
    name: "EnhancedRecipes",
    version: 6,
    shared: false,
    api: "CoreEngine"
});
try {
    IMPORT("BlockEngine", "IDConverter");
}
catch (e) {
}
var Recipes2;
(function (Recipes2) {
    var getIDData = function (stringId) {
        if (IDConverter) {
            return IDConverter.getIDData(stringId);
        }
        return { id: VanillaItemID[stringId] || VanillaBlockID[stringId], data: 0 };
    };
    var ItemInstanceClass = /** @class */ (function () {
        function ItemInstanceClass(arg, defData) {
            var _a, _b, _c;
            var pair;
            switch (typeof arg) {
                case "number":
                    this.id = arg;
                    this.count = 1;
                    this.data = defData;
                    break;
                case "string":
                    pair = getIDData(arg);
                    this.id = pair.id;
                    this.count = 1;
                    this.data = pair.data;
                    break;
                default:
                    if (typeof arg.id === "string") {
                        pair = getIDData(arg.id);
                        this.id = pair.id;
                        this.data = (_a = arg.data) !== null && _a !== void 0 ? _a : pair.data;
                    }
                    else {
                        this.id = arg.id;
                        this.data = (_b = arg.data) !== null && _b !== void 0 ? _b : defData;
                    }
                    this.count = (_c = arg.count) !== null && _c !== void 0 ? _c : 1;
            }
        }
        return ItemInstanceClass;
    }());
    var SourceItem = /** @class */ (function (_super) {
        __extends(SourceItem, _super);
        function SourceItem(arg) {
            return _super.call(this, arg, -1) || this;
        }
        return SourceItem;
    }(ItemInstanceClass));
    Recipes2.SourceItem = SourceItem;
    var ResultItem = /** @class */ (function (_super) {
        __extends(ResultItem, _super);
        function ResultItem(arg) {
            return _super.call(this, arg, 0) || this;
        }
        return ResultItem;
    }(ItemInstanceClass));
    Recipes2.ResultItem = ResultItem;
    function addShaped(result, mask, sources, onCrafting) {
        var array = [];
        var source;
        for (var char in sources) {
            source = new SourceItem(sources[char]);
            array.push(char, source.id, source.data);
        }
        Recipes.addShaped(new ResultItem(result), typeof mask === "string" ? mask.split(":") : mask, array, onCrafting);
    }
    Recipes2.addShaped = addShaped;
    function addShapeless(result, sources, onCrafting) {
        var array = [];
        var source;
        var n = 0;
        for (var i = 0; i < sources.length; i++) {
            source = new SourceItem(sources[i]);
            for (n = 0; n < source.count; n++) {
                array.push({ id: source.id, data: source.data });
            }
        }
        Recipes.addShapeless(new ResultItem(result), array, onCrafting);
    }
    Recipes2.addShapeless = addShapeless;
    function deleteRecipe(result) {
        Recipes.deleteRecipe(new ResultItem(result));
    }
    Recipes2.deleteRecipe = deleteRecipe;
    function addFurnace(source, result, prefix) {
        var sourceItem = new SourceItem(source);
        var resultItem = new ResultItem(result);
        Recipes.addFurnace(sourceItem.id, sourceItem.data, resultItem.id, resultItem.data, prefix);
    }
    Recipes2.addFurnace = addFurnace;
    function removeFurnaceRecipe(source) {
        var sourceItem = new SourceItem(source);
        Recipes.removeFurnaceRecipe(sourceItem.id, sourceItem.data);
    }
    Recipes2.removeFurnaceRecipe = removeFurnaceRecipe;
    function addFurnaceFuel(fuel, time) {
        var sourceItem = new SourceItem(fuel);
        Recipes.addFurnaceFuel(sourceItem.id, sourceItem.data, time);
    }
    Recipes2.addFurnaceFuel = addFurnaceFuel;
    function removeFurnaceFuel(fuel) {
        var sourceItem = new SourceItem(fuel);
        Recipes.removeFurnaceFuel(sourceItem.id, sourceItem.data);
    }
    Recipes2.removeFurnaceFuel = removeFurnaceFuel;
    function getFurnaceRecipeResult(source, prefix) {
        var sourceItem = new SourceItem(source);
        return Recipes.getFurnaceRecipeResult(sourceItem.id, sourceItem.data, prefix);
    }
    Recipes2.getFurnaceRecipeResult = getFurnaceRecipeResult;
    function getFuelBurnDuration(fuel) {
        var sourceItem = new SourceItem(fuel);
        return Recipes.getFuelBurnDuration(sourceItem.id, sourceItem.data);
    }
    Recipes2.getFuelBurnDuration = getFuelBurnDuration;
})(Recipes2 || (Recipes2 = {}));
EXPORT("Recipes2", Recipes2);
