import { User } from "discord.js";

class Player {
    private state: boolean;
    private user: User;
    private id: string;
    private isGood: boolean;
    private role: string;

    constructor(user: User, id: string, role: string, good: boolean) {
        this.state = true;
        this.user = user;
        this.id = id;
        this.isGood = good;
        this.role = role;
    }

    getName(): string {
        return this.user.tag;
    }

    getUser(): User {
        return this.user;
    }

    setUser(user: User) {
        this.user = user;
    }

    getId(): string {
        return this.id;
    }

    setID(id: string) {
        this.id = id;
    }

    setState(state: boolean) {
        this.state = state;
    }

    getState(): boolean {
        return this.state;
    }

    getRole(): string {
        return this.role;
    }

    setRole(role: string) {
        this.role = role;
    }

    setIsGood(good: boolean) {
        this.isGood = good;
    }

    getIsGood(): boolean {
        return this.isGood;
    }

    vote(id: string) {
        if (this.state === true) {
            return id;
        }
    }
}

export default Player;
