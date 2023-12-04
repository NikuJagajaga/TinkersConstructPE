class ModWeb extends TinkersModifier {

    constructor(){
        super("web", "Web", 15, ["web"], 1, true);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.addEffect(victim, EPotionEffect.MOVEMENT_SLOWDOWN, 1, level * 20);
        return 0;
    }
    
}