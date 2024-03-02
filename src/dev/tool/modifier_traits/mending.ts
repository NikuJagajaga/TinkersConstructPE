class TraitMending extends TconTrait {

    constructor(parent: TconModifier){
        super("mending", "Mending", parent);
    }

    override onTick(stack: TconToolStack, player: number, level: number): void {
        if(World.getThreadTime() % 150 === 0){
            stack.durability -= level;
            stack.applyToHand(player);
        }
    }
    
}
