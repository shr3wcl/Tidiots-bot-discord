import { User, Client } from "discord.js";
import BlogModel from "../Models/GameModel";
export interface PlayerObject {
    user: User,
    id: string
}

export interface ListGameObject {
    idChannel: string,
    idGame: string
}

export interface WolfObject {
    command: (bot: Client) => void,
}