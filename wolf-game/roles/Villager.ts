import Player from './Player';
import { User } from 'discord.js';

class Villager extends Player{
    constructor(user: User, id: string) {
        super(user, id, 'villager', true);
    }
}

export default Villager; 