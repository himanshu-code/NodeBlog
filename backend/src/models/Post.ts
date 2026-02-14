import mongoose, { Document, Schema } from "mongoose";
export interface IPost extends Document {
    title: string;
    content: string;
    author: mongoose.Types.ObjectId;
    likes: mongoose.Types.ObjectId[];
}

const postSchema = new Schema<IPost>({
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

export default mongoose.model<IPost>("Post", postSchema);
