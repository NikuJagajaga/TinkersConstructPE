const TraitJagged = new class extends TconTrait {

    constructor(){
        super("jagged", "Jagged", "#7edebc");
    }

    override onAttack(stack: TconToolStack, victim: number, player: number, baseDamage: number, damage: number, level: number): number {
        return damage + Math.log((stack.stats.durability - stack.durability) / 72 + 1) * 2;
    }

}
