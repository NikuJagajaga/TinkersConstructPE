interface ForgeLayout {
    title: string;
    background: string;
    intro: string;
    slots: {x: number, y: number, bitmap: string}[];
    forgeOnly?: boolean;
}


class ToolForgeHandler {

    private static layouts: ForgeLayout[] = [];
    private static recipes: {result: string, pattern: EPartType[]}[] = [];

    static addLayout(layout: ForgeLayout): void {
        this.layouts.push(layout);
    }

    static getLayoutList(isForge: boolean): ForgeLayout[] {
        return this.layouts.filter(layout => isForge || !layout.forgeOnly);
    }

    static addRecipe(resultType: string, pattern: EPartType[]): void {
        this.recipes.push({result: resultType, pattern: pattern});
    }

    static getRecipes(isForge: boolean): typeof this.recipes {
        return this.recipes.filter(recipe => isForge || recipe.pattern.length <= 3);
    }

    static createForgeBlock(namedID: string, block: AnyID): number {

        const id = createBlock(namedID, [{name: "Tool Forge", texture: [["tcon_toolforge", 0]]}]);

        Item.addCreativeGroup("tcon_toolforge", translate("Tool Forge"), [id]);
        Recipes2.addShaped(id, "aaa:bcb:b_b", {a: BlockID.tcon_stone, b: block, c: BlockID.tcon_toolstation});

        BlockModel.register(id, (model, index) => {
            const block2 = getIDData(block);
            model.addBox( 0/16, 15/16,  0/16,  16/16, 16/16, 16/16, "tcon_toolforge", 0);
            model.addBox( 0/16, 12/16,  0/16,  16/16, 15/16, 16/16, block2.id, block2.data);
            model.addBox( 0/16,  0/16,  0/16,   4/16, 12/16,  4/16, block2.id, block2.data);
            model.addBox(12/16,  0/16,  0/16,  16/16, 12/16,  4/16, block2.id, block2.data);
            model.addBox(12/16,  0/16, 12/16,  16/16, 12/16, 16/16, block2.id, block2.data);
            model.addBox( 0/16,  0/16, 12/16,   4/16, 12/16, 16/16, block2.id, block2.data);
            return model;
        });

        return id;

    }

}


ToolForgeHandler.addLayout({
    title: "Repair & Modify",
    background: "tcon.icon.repair",
    intro: "",
    slots: [
        {x: 0, y: 0, bitmap: "tcon.slot.tool"},
        {x: -18, y: 20, bitmap: "tcon.slot.lapis"},
        {x: -22, y: -5, bitmap: "tcon.slot.dust"},
        {x: 0, y: -23, bitmap: "tcon.slot.ingot"},
        {x: 22, y: -5, bitmap: "tcon.slot.diamond"},
        {x: 18, y: 20, bitmap: "tcon.slot.quartz"}
    ]
});
