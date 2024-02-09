class ModShulking extends TinkersModifier {

    constructor(){
        super("shulking", "Shulking", 50, false);
        this.texIndex = 14;
        this.setRecipe(["chorus_fruit_popped"]);
    }

    override onAttack(item: ItemInstance, victim: number, player: number, level: number): number {
        Entity.addEffect(victim, EPotionEffect.LEVITATION, 0, (level >> 1) + 10);
        return 0;
    }
    
}
