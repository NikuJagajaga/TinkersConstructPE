createBlock("tcon_graveyard_soil", [{name: "Graveyard Soil"}], "dirt");
createBlock("tcon_consecrated_soil", [{name: "Consecrated Soil"}], "dirt");
Recipes2.addShapeless(BlockID.tcon_graveyard_soil, ["dirt", "rotten_flesh", "bone_meal"]);
Recipes.addFurnace(BlockID.tcon_graveyard_soil, BlockID.tcon_consecrated_soil);


class ModSmite extends TinkersModifier {

    constructor(){
        super("smite", "Smite", 8, [BlockID.tcon_consecrated_soil], 24, true);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return EntityHelper.isUndead(victim) ? 7 / this.max * level : 0;
    }

}