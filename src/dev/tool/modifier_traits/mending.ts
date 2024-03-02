const TraitMending = new class extends TconTrait {

    constructor(){
        super("mending", "Mending", "#43ab32");
    }

    override onTick(stack: TconToolStack, player: number, level: number): void {
        if(World.getThreadTime() % 150 === 0){
            stack.durability -= level;
            stack.applyToHand(player);
        }
    }
    
}
