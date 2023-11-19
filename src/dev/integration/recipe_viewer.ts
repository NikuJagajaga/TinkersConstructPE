var RV;

ModAPI.addAPICallback("RecipeViewer", (api: {Core: any, RecipeType: typeof RecipeType, RecipeTypeRegistry: RecipeTypeRegistry}) => {

    RV = api.Core;

    //UI.TextureSource.put("tcon.rv.table", FileTools.ReadImage(__dir__ + "res/terrain-atlas/smeltery/tcon_itemcast_2.png"));
    //UI.TextureSource.put("tcon.rv.basin", FileTools.ReadImage(__dir__ + "res/terrain-atlas/smeltery/tcon_blockcast_2.png"));

/*
    class PartBuilderRV extends api.RecipeType {

        constructor(){
            super("Part Build", BlockID.tcon_partbuilder, {
                drawing: [
                    {type: "bitmap", x: 476, y: 104, bitmap: "tcon.arrow", scale: 8}
                ],
                elements: {
                    input0: {x: 180, y: 100, size: 128},
                    input1: {x: 308, y: 100, size: 128},
                    output0: {x: 692, y: 100, size: 128}
                }
            });
        }

        getAllList(): RecipePattern[] {
            return PatternRegistry.getAllRecipeForRV();
        }

    }

    api.RecipeTypeRegistry.register("tcon_partbuilder", new PartBuilderRV());
*/

    class MeltingRV extends api.RecipeType {

        constructor(){
            super("Melting", BlockID.tcon_smeltery, {
                drawing: [
                    {type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6},
                    {type: "bitmap", x: 452, y: 176, bitmap: "tcon.rv.fire_tank", scale: 6},
                    {type: "bitmap", x: 614, y: 50, bitmap: "tcon.rv.smeltery", scale: 6}
                ],
                elements: {
                    input0: {x: 182, y: 176, bitmap: "_default_slot_empty", size: 108},
                    outputLiq0: {x: 710, y: 50, width: 108, height: 234},
                    textTemp: {type: "text", x: 500, y: 50, font: {size: 50, alignment: UI.Font.ALIGN_CENTER}}
                }
            });
            this.setDescription("Melt");
            this.setTankLimit(MatValue.BLOCK);
        }

        getAllList(): RecipePattern[] {
            return MeltingRecipe.getAllRecipeForRV();
        }

        onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
            elements.get("textTemp").setBinding("text", recipe.temp + "°C");
        }

    }

    api.RecipeTypeRegistry.register("tcon_melting", new MeltingRV());


    class AlloyingRV extends api.RecipeType {

        constructor(){
            super("Alloying", BlockID.tcon_smeltery, {
                drawing: [
                    {type: "bitmap", x: 50, y: 50, bitmap: "tcon.rv.smeltery_wide", scale: 6},
                    {type: "bitmap", x: 488, y: 150, bitmap: "tcon.arrow", scale: 6},
                    {type: "bitmap", x: 650, y: 50, bitmap: "tcon.rv.smeltery", scale: 6}
                ],
                elements: {
                    inputLiq0: {x: 0, y: 1000, width: 108, height: 234},
                    inputLiq1: {x: 0, y: 1000, width: 108, height: 234},
                    inputLiq2: {x: 0, y: 1000, width: 108, height: 234},
                    inputLiq3: {x: 0, y: 1000, width: 108, height: 234},
                    inputLiq4: {x: 0, y: 1000, width: 108, height: 234},
                    inputLiq5: {x: 0, y: 1000, width: 108, height: 234},
                    inputLiq6: {x: 0, y: 1000, width: 108, height: 234},
                    inputLiq7: {x: 0, y: 1000, width: 108, height: 234},
                    outputLiq0: {x: 746, y: 50, width: 108, height: 234}
                }
            });
            this.setDescription("Alloy");
        }

        getAllList(): RecipePattern[] {
            return AlloyRecipe.getAllRecipeForRV();
        }

        onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
            if(recipe.inputLiq && recipe.outputLiq){
                const len = recipe.inputLiq.length;
                const width = 216 / len;
                let elem: UI.Element;
                for(let i = 0; i < 8; i++){
                    elem = elements.get("inputLiq" + i);
                    if(i < len){
                        elem.setPosition(146 + i * width, 50);
                        elem.setSize(width, 234);
                    }
                    else{
                        elem.setPosition(0, 1000);
                    }
                }
                this.setTankLimit(Math.max(...recipe.inputLiq.map(rec => rec.amount), recipe.outputLiq[0].amount));
            }
        }

    }

    api.RecipeTypeRegistry.register("tcon_alloying", new AlloyingRV());


    class CastingRV extends api.RecipeType {

        private readonly castType: "table" | "basin";

        constructor(name: string, icon: number, tileBitmap: string, castType: "table" | "basin"){
            const content: RecipeContents = {
                drawing: [
                    {type: "bitmap", x: 86, y: 50, bitmap: "tcon.rv.smeltery", scale: 6},
                    {type: "bitmap", x: 386, y: 122, bitmap: "tcon.rv.faucet", scale: 6},
                    {type: "bitmap", x: 530, y: 182, bitmap: "tcon.arrow", scale: 6}
                ],
                elements: {
                    input0: {x: 404, y: 188, bitmap: "_default_slot_empty", size: 96},
                    output0: {x: 704, y: 176, size: 108},
                    inputLiq0: {x: 182, y: 50, width: 108, height: 234},
                    scaleFlow: {type: "scale", x: 434, y: 122, width: 36, height: 66, value: 1},
                    textTime: {type: "text", x: 596, y: 100, font: {size: 50, alignment: UI.Font.ALIGN_CENTER}},
                    textConsume: {type: "text", x: 758, y: 300, font: {color: Color.RED, size: 40, alignment: UI.Font.ALIGN_CENTER}}
                }
            }
            content.drawing.push({type: "bitmap", x: 404, y: 284, bitmap: tileBitmap, scale: 6});
            super(name, icon, content);
            this.castType = castType;
            this.setTankLimit(MatValue.BLOCK);
        }

        getAllList(): RecipePattern[] {
            return CastingRecipe.getAllRecipeForRV(this.castType);
        }

        onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
            elements.get("scaleFlow").setBinding("texture", LiquidRegistry.getLiquidUITexture(recipe.inputLiq[0].liquid, 36, 66));
            elements.get("textTime").setBinding("text", (CastingRecipe.calcCooldownTime(recipe.inputLiq[0].liquid, recipe.inputLiq[0].amount) / 20).toFixed(1) + " s");
            elements.get("textConsume").setBinding("text", recipe.consume ? "Consumes cast!" : "");
        }

    }

    api.RecipeTypeRegistry.register("tcon_itemcast", new CastingRV("Item Casting", BlockID.tcon_itemcast, "tcon.rv.table", "table"));
    api.RecipeTypeRegistry.register("tcon_blockcast", new CastingRV("Block Casting", BlockID.tcon_blockcast, "tcon.rv.basin", "basin"));


});