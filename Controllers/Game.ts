import GameModel from "../Models/GameModel";

export const saveNewGame = async (
    idGame: string,
    idAuthor: string,
    nameAuthor: string,
    guildId: string | null,
    channelId: string,
    isFinish: boolean,
    numberPlayer: number,
) => {
    const newGame = new GameModel({ idGame, idAuthor, nameAuthor, guildId, channelId, isFinish, numberPlayer });
    await newGame.save();
}