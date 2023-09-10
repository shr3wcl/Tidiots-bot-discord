import Player from "./Player";
import { User } from "discord.js";

class Witch extends Player {
    private resurrection: 1 | 0 = 1;
    private poison: 1 | 0 = 1;
    private idSlain: string | null;
    private idSaved: string | null;

    constructor(user: User, id: string) {
        super(user, id, 'witch', true);
        this.resurrection = 1;
        this.poison = 1;
    }

    checkRes(): Number{
        return this.resurrection;
    }

    checkPoison(): Number{
        return this.poison;
    }

    resurrect(idS: string): string {
        if (this.resurrection == 1) {
            this.resurrection = 0;
            this.idSaved = idS;
            return "";
        }
        return "";
    }

    empoison(idS: string): string{
        if (this.poison == 1) {
            this.poison = 0;
            this.idSlain = idS;
            return "";
        }
        return "";
    }

    reset() {
        this.idSaved = null;
        this.idSlain = null;
    }
}

export default Witch;