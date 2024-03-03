const TraitEcological = new class extends TconTrait {

    constructor(){
        super("ecological", "Ecological", "#8e661b");
    }

    override onTick(stack: TconToolStack, player: number, level: number): void {
        if((Math.random() * 800 | 0) === 0){
            stack.durability--;
            stack.applyToHand(player);
        }
    }

}
