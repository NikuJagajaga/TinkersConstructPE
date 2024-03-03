const TraitWritable = new class extends TconTrait {

    override leveled: boolean = true;

    constructor(){
        super("writable", "Writable", "#ffffff");
    }

    getBonusSlots(level: number): number {
        return level;
    }

}
