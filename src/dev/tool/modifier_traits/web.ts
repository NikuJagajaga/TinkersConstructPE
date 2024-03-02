class TraitWeb extends TconTrait {

    constructor(parent: TconModifier){
        super("web", "Web", parent);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.addEffect(victim, EPotionEffect.MOVEMENT_SLOWDOWN, 1, level * 20);
        return 0;
    }
    
}
