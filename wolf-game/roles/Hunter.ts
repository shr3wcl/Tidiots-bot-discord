import Player from "./Player";
import { User } from "discord.js";

class Hunter extends Player {
    private idKill: string;

    constructor(user: User, id: string) {
        super(user, id, 'hunter', true);
        this.idKill = '';
    }

    revenge(idK: string): Boolean {
        if (this.getState()) {
            this.idKill = idK;
            return true;
        }
        return false;
    }
}

export default Hunter;