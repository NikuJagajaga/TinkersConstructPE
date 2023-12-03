createBlock("tcon_graveyard_soil", [{name: "Graveyard Soil"}], "dirt");
createBlock("tcon_consecrated_soil", [{name: "Consecrated Soil"}], "dirt");
Recipes2.addShapeless(BlockID.tcon_graveyard_soil, ["dirt", "rotten_flesh", "bone_meal"]);
Recipes.addFurnace(BlockID.tcon_graveyard_soil, BlockID.tcon_consecrated_soil);


class ModSmite extends TinkersModifier {

    private static readonly targets = {
        [EEntityType.SKELETON]: true,
        [EEntityType.STRAY]: true,
        [EEntityType.WHITHER_SKELETON]: true,
        [EEntityType.ZOMBIE]: true,
        [EEntityType.DROWNED]: true,
        [EEntityType.HUSK]: true,
        [EEntityType.PIG_ZOMBIE]: true,
        [EEntityType.ZOMBIE_VILLAGER]: true,
        [EEntityType.ZOMBIE_VILLAGE_V2]: true,
        [EEntityType.PHANTOM]: true,
        [EEntityType.WHITHER]: true,
        [EEntityType.SKELETON_HORSE]: true,
        [EEntityType.ZOMBIE_HORSE]: true
    };

    constructor(){
        super("smite", "Smite", 8, [BlockID.tcon_consecrated_soil], 24, true);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        return ModSmite.targets[Entity.getType(victim)] ? 7 / this.max * level : 0;
    }

}