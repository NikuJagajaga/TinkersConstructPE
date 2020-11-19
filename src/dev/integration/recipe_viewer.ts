var RV;
ModAPI.addAPICallback("RecipeViewer", (api: any) => {

    RV = api.Core;

    interface RecipePattern {
        input: ItemInstance[];
        output: ItemInstance[];
        [key: string]: any;
    }


    const setLiquidScale = (scale: UI.Element, text: UI.Element, liquid: LiquidInstance): void => {
        scale.setBinding("texture", LiquidRegistry.getLiquidUITexture(liquid.liquid, 108, 234));
        scale.setBinding("value", Math.min(1, liquid.amount / MatValue.BLOCK));
        text.setBinding("text", LiquidRegistry.getLiquidName(liquid.liquid) + "\n" + liquid.amount + " mB");
    };


    Callback.addCallback("PostLoaded", () => {


        RV.registerRecipeType("tcon_partbuilder", {
            title: "Part Build",
            contents: {
                icon: BlockID.tcon_partbuilder,
                drawing: [
                    {type: "bitmap", x: 476, y: 104, bitmap: "tcon.arrow", scale: 8}
                ],
                elements: {
                    input0: {x: 180, y: 100, size: 128},
                    input1: {x: 308, y: 100, size: 128},
                    output0: {x: 692, y: 100, size: 128},
                },
                moveItems: {x: 840, y: 180, slots: ["slot0", "slot1"]}
            },
            recipeList: PatternRegistry.getAllRecipeForRV()
        });


        RV.registerRecipeType("tcon_melting", {
            title: "Melting",
            contents: {
                icon: BlockID.tcon_smeltery,
                description: "melting",
                drawing: [
                    {type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6},
                    {type: "bitmap", x: 614, y: 50, bitmap: "tcon.rv.smeltery", scale: 6},
                    {type: "bitmap", x: 452, y: 176, bitmap: "tcon.rv.fire_tank", scale: 6}
                ],
                elements: {
                    input0: {x: 182, y: 176, bitmap: "_default_slot_empty", size: 108},
                    scaleLiquid: {type: "scale", x: 710, y: 50, width: 108, height: 234, direction: 1},
                    textTemp: {type: "text", x: 500, y: 50, font: {size: 50, alignment: 1}},
                    textLiquid: {type: "text", x: 614, y: 380, font: {color: Color.WHITE, size: 40, shadow: 0.5}, multiline: true}
                }
            },
            recipeList: MeltingRecipe.getAllRecipeForRV(),
            onOpen: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void => {
                setLiquidScale(elements.get("scaleLiquid"), elements.get("textLiquid"), recipe.outputLiq);
                elements.get("textTemp").setBinding("text", recipe.temp + "°C");
            }
        });


        RV.registerRecipeType("tcon_itemcast", {
            title: "Item Casting",
            contents: {
                icon: BlockID.tcon_itemcast,
                drawing: [
                    {type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6},
                    {type: "bitmap", x: 386, y: 122, bitmap: "tcon.rv.faucet", scale: 6},
                    {type: "bitmap", x: 404, y: 284, bitmap: "tcon.rv.table", scale: 6},
                    {type: "bitmap", x: 530, y: 182, bitmap: "tcon.arrow", scale: 6}
                ],
                elements: {
                    input0: {x: 404, y: 188, bitmap: "_default_slot_empty", size: 96},
                    output0: {x: 704, y: 176, size: 108},
                    scaleLiquid: {type: "scale", x: 182, y: 50, width: 108, height: 234, direction: 1},
                    scaleFlow: {type: "scale", x: 434, y: 122, width: 36, height: 66, value: 1},
                    textLiquid: {type: "text", x: 86, y: 380, font: {color: Color.WHITE, size: 40, shadow: 0.5}, multiline: true},
                    textTime: {type: "text", x: 596, y: 100, font: {size: 50, alignment: 1}},
                    textConsume: {type: "text", x: 758, y: 300, font: {color: Color.RED, size: 40, alignment: 1}}
                }
            },
            recipeList: CastingRecipe.getAllRecipeForRV("table"),
            onOpen: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void => {
                setLiquidScale(elements.get("scaleLiquid"), elements.get("textLiquid"), recipe.inputLiq);
                elements.get("scaleFlow").setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq.liquid, 36, 66));
                elements.get("textTime").setBinding("text", (CastingRecipe.calcCooldownTime(recipe.inputLiq.liquid, recipe.inputLiq.amount) / 20).toFixed(1) + " s");
                elements.get("textConsume").setBinding("text", recipe.consume ? "Consumes cast!" : "");
            }
        });


        RV.registerRecipeType("tcon_blockcast", {
            title: "Block Casting",
            contents: {
                icon: BlockID.tcon_blockcast,
                drawing: [
                    {type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6},
                    {type: "bitmap", x: 386, y: 122, bitmap: "tcon.rv.faucet", scale: 6},
                    {type: "bitmap", x: 404, y: 284, bitmap: "tcon.rv.basin", scale: 6},
                    {type: "bitmap", x: 530, y: 182, bitmap: "tcon.arrow", scale: 6}
                ],
                elements: {
                    input0: {x: 404, y: 188, bitmap: "_default_slot_empty", size: 96},
                    output0: {x: 704, y: 176, size: 108},
                    scaleLiquid: {type: "scale", x: 182, y: 50, width: 108, height: 234, direction: 1},
                    scaleFlow: {type: "scale", x: 434, y: 122, width: 36, height: 66, value: 1},
                    textLiquid: {type: "text", x: 86, y: 380, font: {color: Color.WHITE, size: 40, shadow: 0.5}, multiline: true},
                    textTime: {type: "text", x: 596, y: 100, font: {size: 50, alignment: 1}},
                    textConsume: {type: "text", x: 758, y: 300, font: {color: Color.RED, size: 40, alignment: 1}}
                }
            },
            recipeList: CastingRecipe.getAllRecipeForRV("basin"),
            onOpen: (elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void => {
                setLiquidScale(elements.get("scaleLiquid"), elements.get("textLiquid"), recipe.inputLiq);
                elements.get("scaleFlow").setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq.liquid, 36, 66));
                elements.get("textTime").setBinding("text", (CastingRecipe.calcCooldownTime(recipe.inputLiq.liquid, recipe.inputLiq.amount) / 20).toFixed(1) + " s");
                elements.get("textConsume").setBinding("text", recipe.consume ? "Consumes cast!" : "");
            }
        });


    });

});