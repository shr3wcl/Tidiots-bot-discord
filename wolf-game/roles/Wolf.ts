import Player from "./Player";
import { User } from "discord.js";

class Wolf extends Player {
    private idKill: string;

    constructor(user: User, id: string) {
        super(user, id, 'wolf', false);
        this.idKill = '';
    }

    kill(idKill: string) {
        this.idKill = idKill;
    }

    getTargetKill(): string {
        return this.idKill;
    }
}

export default Wolf;