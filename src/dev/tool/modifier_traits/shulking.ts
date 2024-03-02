class TraitShulking extends TconTrait {

    constructor(parent: TconModifier){
        super("shulking", "Shulking", parent);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.addEffect(victim, EPotionEffect.LEVITATION, 0, (level >> 1) + 10);
        return 0;
    }
    
}
