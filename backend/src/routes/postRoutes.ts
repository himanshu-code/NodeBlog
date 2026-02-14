import express from "express";
import authMiddleware from "../middleware/authMiddleware";
import { createPost, deletePost, getPostById, getPosts, toggleLikePost, updatePost } from "../controllers/postController";

const router = express.Router();

router.get("/", getPosts);
router.post("/", authMiddleware, createPost);
router.get("/:id", getPostById);
router.put("/:id", authMiddleware, updatePost);
router.delete("/:id", authMiddleware, deletePost);
router.post("/:id/like", authMiddleware, toggleLikePost);
export default router;