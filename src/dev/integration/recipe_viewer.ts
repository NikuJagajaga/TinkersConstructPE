let RV: RecipeViewerAPI;

ModAPI.addAPICallback("RecipeViewer", (api: RecipeViewerAPI) => {

    RV = api;

    api.RecipeTypeRegistry.register("tcon_partbuilder", new class extends api.RecipeType {

        constructor(){
            const centerY = 80;
            super(translate("Part Building"), BlockID.tcon_partbuilder0, {
                drawing: [
                    {type: "bitmap", x: 500 - 132 / 2, y: centerY - 90 / 2, bitmap: "tcon.arrow", scale: 6}
                ],
                elements: {
                    input0: {x: 500 - 66 - 48 - 108 * 2, y: centerY - 108 / 2, size: 108},
                    input1: {x: 500 - 66 - 48 - 108, y: centerY - 108 / 2, size: 108},
                    output0: {x: 500 + 66 + 48, y: centerY - 108 / 2, size: 108},
                    imagePattern: {type: "scale", x: 500 - 24, y: centerY + 50, width: 48, height: 48, value: 1}
                }
            });
            this.setGridView(3, 1, true);
        }

        getAllList(): RecipePattern[] {
            return PartRegistry.getAllPartBuildRecipeForRV();
        }

        onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
            elements.get("imagePattern").setBinding("texture", recipe.pattern ? "tcon.pattern." + recipe.pattern : "_default_slot_empty");
        }

    });


    api.RecipeTypeRegistry.register("tcon_melting", new class extends api.RecipeType {

        constructor(){
            super(translate("Melting"), BlockID.tcon_smeltery, {
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
            this.setDescription(translate("Melt"));
            this.setTankLimit(MatValue.BLOCK);
        }

        getAllList(): RecipePattern[] {
            return MeltingRecipe.getAllRecipeForRV();
        }

        onOpen(elements: java.util.HashMap<string, UI.Element>, recipe: RecipePattern): void {
            elements.get("textTemp").setBinding("text", translate("%s°C", recipe.temp));
        }

    });

    api.RecipeTypeRegistry.register("tcon_alloying", new class extends api.RecipeType {

        constructor(){
            super(translate("Alloying"), BlockID.tcon_smeltery, {
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
            this.setDescription(translate("Alloy"));
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

    });


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
            elements.get("textTime").setBinding("text", translate("%s s", (CastingRecipe.calcCooldownTime(recipe.inputLiq[0].liquid, recipe.inputLiq[0].amount) / 20).toFixed(1)));
            elements.get("textConsume").setBinding("text", recipe.consume ? translate("Consumes cast") : "");
        }

    }

    api.RecipeTypeRegistry.register("tcon_itemcast", new CastingRV(translate("Item Casting"), BlockID.tcon_itemcast, "tcon.rv.table", "table"));
    api.RecipeTypeRegistry.register("tcon_blockcast", new CastingRV(translate("Block Casting"), BlockID.tcon_blockcast, "tcon.rv.basin", "basin"));


});