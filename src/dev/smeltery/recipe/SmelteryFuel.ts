interface ISmelteryFuel {
    amount: number;
    duration: number;
    temp: number;
}

class SmelteryFuel {

    private static data: {[liquid: string]: ISmelteryFuel} = {};

    static addFuel(liquid: string, amount: number, duration: number, temp: number): void {
        if(temp < 300){
            return;
        }
        this.data[liquid] = {amount: amount, duration: duration, temp: temp - 300};
    }

    static getFuel(liquid: string): ISmelteryFuel {
        return this.data[liquid];
    }

}


SmelteryFuel.addFuel("lava", 50, 100, 1000);