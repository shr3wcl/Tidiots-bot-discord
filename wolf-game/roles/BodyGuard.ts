import Player from './Player';
import { User } from 'discord.js';

class BodyGuard extends Player {
    private idProtect: string;
    constructor(user: User, id: string) {
        super(user, id, 'bodyguard', true);
        this.idProtect = "";
    }

    protect(idP: string) {
        this.idProtect = idP;
    }

    getProtect(): string {
        return this.idProtect;
    }
}

export default BodyGuard; 