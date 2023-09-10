import Player from "./Player";
import { User } from "discord.js";

class Seer extends Player {
    private idCheck: string;

    constructor(user: User, id: string) {
        super(user, id, 'seer', true);
        this.idCheck = '';
    }

    setCheckRoles(idC: string): Boolean {
        if (idC != this.idCheck) {
            this.idCheck = idC
            return true;
        }
        return false;
    }
}

export default Seer;