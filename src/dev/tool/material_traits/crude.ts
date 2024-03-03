const TraitCrude = new class extends TconTrait {

    override leveled: boolean = true;

    constructor(){
        super("crude", "Crude", "#696969");
    }

    override onAttack(stack: TconToolStack, victim: number, player: number, baseDamage: number, damage: number, level: number): number {
        for(let i = 0; i <= 3; i++){
            if(Entity.getArmorSlot(victim, i)?.id){
                return damage;
            }
        }
        return damage + baseDamage * 0.05 * level;
    }

}
