const TraitShulking = new class extends TconTrait {

    constructor(){
        super("shulking", "Shulking", "#aaccff");
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.addEffect(victim, EPotionEffect.LEVITATION, 0, (level >> 1) + 10);
        return 0;
    }
    
}
