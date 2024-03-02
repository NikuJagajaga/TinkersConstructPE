const TraitWeb = new class extends TconTrait {

    constructor(){
        super("web", "Web", "#ffffff");
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.addEffect(victim, EPotionEffect.MOVEMENT_SLOWDOWN, 1, level * 20);
        return 0;
    }
    
}
