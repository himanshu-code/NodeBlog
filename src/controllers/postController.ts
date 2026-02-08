import { Request, Response } from "express";
import Post, { IPost } from "../models/Post";
import { AuthRequest } from "../middleware/authMiddleware";
import mongoose from "mongoose";

export const createPost = async (req: AuthRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        const post: IPost = await Post.create({ title, content, author: req.user._id });
        return res.status(201).json(post);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to create post" });
    }
}

export const getPosts = async (req: Request, res: Response) => {
    try {
        const posts = await Post.find().populate("author", "name email").sort({ createdAt: -1 });
        return res.status(200).json(posts);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get posts" });
    }
}

export const getPostById = async (req: Request, res: Response) => {
    try {
        const post = await Post.findById(req.params.id).populate("author", "name email");
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        return res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to get post" });
    }
}

export const updatePost = async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        if (post?.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }
        post.title = req.body.title || post.title;
        post.content = req.body.content || post.content;
        await post.save();
        return res.status(200).json(post);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to update post" });
    }
}

export const deletePost = async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if (post?.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized" });
        }

        await post.deleteOne();
        return res.status(200).json({ message: "Post deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to delete post" });
    }
}

export const toggleLikePost = async (req: AuthRequest, res: Response) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }
        const userId = new mongoose.Types.ObjectId(req.user.id);
        const alreadyLiked = post.likes.includes(userId);
        if (alreadyLiked) {
            post.likes = post.likes.filter((id) => id.toString() !== userId.toString());
        }
        else {
            post.likes.push(userId);
        }
        await post.save();
        return res.status(200).json({ likesCount: post.likes.length, liked: !alreadyLiked });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Failed to toggle like post" });
    }
}
