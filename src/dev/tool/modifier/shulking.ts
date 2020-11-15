class ModShulking extends TinkersModifier {

    constructor(){
        super("shulking", "Shulking", 14, [VanillaItemID.chorus_fruit_popped], 50, false);
    }

    onAttack(item: ItemInstance, victim: number, level: number): number {
        Entity.addEffect(victim, Native.PotionEffect.levitation, 0, (level >> 1) + 10);
        return 0;
    }
    
}