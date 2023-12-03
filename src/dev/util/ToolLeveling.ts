interface ToolLevelInfo {
    level: number;
    currentXp: number;
    next: number;
}


class ToolLeveling {

    static getLevelInfo(xp: number, is3x3: boolean): ToolLevelInfo {
        let level = 0;
        let total = 0;
        let next = Cfg.toolLeveling.baseXp;
        if(is3x3){
            next *= 9;
        }
        while(total + next <= xp){
            level++;
            total += next;
            next *= Cfg.toolLeveling.multiplier;
        }
        return {level: level, currentXp: xp - total, next: next};
    }

    static getLevel(xp: number, is3x3: boolean): number {
        return this.getLevelInfo(xp, is3x3).level;
    }

    static getLevelName(level: number): string {
        switch(level){
            case 0: return "Clumsy";
            case 1: return "Comfortable";
            case 2: return "Accustomed";
            case 3: return "Adept";
            case 4: return "Expert";
            case 5: return "Master";
            case 6: return "Grandmaster";
            case 7: return "Heroic";
            case 8: return "Legendary";
            case 9: return "Godlike";
        }
        if(level < 19) return "Awesome";
        if(level < 42) return "MoxieGrrl";
        if(level < 66) return "boni";
        if(level < 99) return "Jadedcat";
        return "Hacker";
    }

    static getLevelupMessage(level: number, name: string): string {
        let msg = "";
        switch(level){
            case 1: msg = `You begin to feel comfortable handling the ${name}`; break;
            case 2: msg = `You are now accustomed to the weight of the ${name}`; break;
            case 3: msg = `You have become adept at handling the ${name}`; break;
            case 4: msg = `You are now an expert at using the ${name} !`; break;
            case 5: msg = `You have mastered the ${name}!`; break;
            case 6: msg = `You have grandmastered the ${name}!`; break;
            case 7: msg = `You feel like you could fulfill mighty deeds with your ${name}!`; break;
            case 8: msg = `You and your ${name} are living legends!`; break;
            case 9: msg = `No god could stand in the way of you and your ${name}!`; break;
            case 10: msg = `Your ${name} is pure awesome.`; break;
            default: msg = `Your ${name} has reached level ${level}`; break;
        }
        return msg;
    }

}