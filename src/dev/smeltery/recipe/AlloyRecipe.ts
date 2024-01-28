interface IAlloyRecipe {
    inputs: LiquidInstance[],
    result: LiquidInstance
};

class AlloyRecipe {

    private static data: IAlloyRecipe[] = [];

    static addRecipe(result: LiquidInstance, ...inputs: LiquidInstance[]): void {
        let inputAmount = 0;
        for(let input of inputs){
            inputAmount += input.amount;
        }
        if(result.amount > inputAmount){
            alert(translate("[TConstuct]: Invalid alloy recipe -> %s", result.liquid));
            return;
        }
        this.data.push({inputs: inputs.map(input => ({liquid: input.liquid, amount: input.amount})), result: result});
    }

    static getRecipes(liquidAmounts: {[key: string]: number}): IAlloyRecipe[] {
        return this.data.filter(recipe => recipe.inputs.every(input => (liquidAmounts[input.liquid] || 0) >= input.amount));
    }

    static getAllRecipeForRV(): RecipePattern[] {
        return this.data.map(recipe => ({
            inputLiq: recipe.inputs,
            outputLiq: [recipe.result]
        }));
    }

}


AlloyRecipe.addRecipe({liquid: "molten_obsidian", amount: 36}, {liquid: "water", amount: 125}, {liquid: "lava", amount: 125});
AlloyRecipe.addRecipe({liquid: "molten_clay", amount: 144}, {liquid: "water", amount: 250}, {liquid: "molten_stone", amount: 72}, {liquid: "molten_dirt", amount: 144});
AlloyRecipe.addRecipe({liquid: "molten_pigiron", amount: 144}, {liquid: "molten_iron", amount: 144}, {liquid: "blood", amount: 40}, {liquid: "molten_clay", amount: 72});
AlloyRecipe.addRecipe({liquid: "molten_knightslime", amount: 72}, {liquid: "molten_iron", amount: 72}, {liquid: "purpleslime", amount: 125}, {liquid: "molten_stone", amount: 144});
AlloyRecipe.addRecipe({liquid: "molten_manyullyn", amount: 2}, {liquid: "molten_cobalt", amount: 2}, {liquid: "molten_ardite", amount: 2});
AlloyRecipe.addRecipe({liquid: "molten_bronze", amount: 4}, {liquid: "molten_copper", amount: 3}, {liquid: "molten_tin", amount: 1});
AlloyRecipe.addRecipe({liquid: "molten_alubrass", amount: 4}, {liquid: "molten_copper", amount: 1}, {liquid: "molten_aluminum", amount: 3});
AlloyRecipe.addRecipe({liquid: "molten_electrum", amount: 2}, {liquid: "molten_gold", amount: 1}, {liquid: "molten_silver", amount: 1});