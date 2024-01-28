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

    static getLocalizedLevelName(level: number): string {
        return translate(this.getLevelName(level));
    }

    static getLevelupMessage(level: number): string {
        switch(level){
            case 1: return "You begin to feel comfortable handling the %s.";
            case 2: return "You are now accustomed to the weight of the %s.";
            case 3: return "You have become adept at handling the %s.";
            case 4: return "You are now an expert at using the %s!";
            case 5: return "You have mastered the %s!";
            case 6: return "You have grandmastered the %s!";
            case 7: return "You feel like you could fulfill mighty deeds with your %s!";
            case 8: return "You and your %s are living legends!";
            case 9: return "No god could stand in the way of you and your %s!";
            case 10: return "Your %s is pure awesome.";
        }
        return "Your %s has reached level %s.";
    }

    static getLocalizedLevelupMessage(level: number, name: string) {
        return translate(this.getLevelupMessage(level), name, level);
    }

}