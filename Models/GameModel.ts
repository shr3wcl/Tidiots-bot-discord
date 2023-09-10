import * as mongoose from 'mongoose';

interface IGame extends mongoose.Document {
    idGame: String,
    idAuthor: String,
    nameAuthor: String,
    guildId?: String,
    channelId: String,
    isFinish: Boolean,
    numberPlayer?: Number
}

const GameSchema = new mongoose.Schema<IGame>({
    idGame: {
        type: String,
        required: true
    },

    idAuthor: {
        type: String,
        required: true,
    },

    nameAuthor: {
        type: String,
        required: true,
    },
    guildId: {
        type: String,
    },
    channelId: {
        type: String,
        required: true,
    },
    isFinish: {
        type: Boolean,
        required: true,
        default: false
    },
    numberPlayer: {
        type: Number,
    }

}, { timestamps: true });

export default mongoose.model<IGame>("Games", GameSchema);