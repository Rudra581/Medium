import { Hono } from "hono";
import { insertPost, updatePost, getAllPosts, getPostByPostId, getCommentByPostId, createcomment, createrating, getRatingByPostId, GetAllCategories, GetPostByCategories } from "../../DB/db";
import { verify } from 'hono/jwt';
import { createBlogInput, updateBlogInput } from "@sedrftyuzesdxcfgh/medium";
export const blogRoute = new Hono();
blogRoute.use("/*", async (c, next) => {
    const authHeader = c.req.header("Authorization") || "";
    const token = authHeader.split(" ")[1] || authHeader;
    // console.log("Full Auth Header:", authHeader);
    // console.log(token);
    try {
        console.log(c.env.JWT_SECRET);
        const user = await verify(token, c.env.JWT_SECRET);
        const userID = user.payload;
        // console.log(userID);
        if (!userID) {
            return c.json({ msg: "Invalid token payload" }, 403);
        }
        c.set("authorId", Number(userID));
        console.log(c.get("authorId"));
        await next();
    }
    catch (err) {
        return c.json({ msg: "You are not logged in or session expired", err: err.message }, 403);
    }
});
blogRoute.post("/", async (c) => {
    const body = await c.req.json();
    const success = createBlogInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Blogs Inputs not correct"
        });
    }
    try {
        const post = await insertPost({
            title: body.title,
            content: body.content,
            authorId: c.get("authorId"),
            category_id: body.category_id
        }, c.env.DATABASE_URL);
        return c.json({ success: true, post });
    }
    catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});
blogRoute.put("/", async (c) => {
    const body = await c.req.json();
    const success = updateBlogInput.safeParse(body);
    if (!success) {
        return c.json({ msg: "Input is not correct" });
    }
    try {
        const post = await updatePost({
            title: body.title,
            content: body.content,
            authorId: c.get("authorId")
        }, c.env.DATABASE_URL);
        return c.json({ success: true, post });
    }
    catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});
blogRoute.get("/bulk", async (c) => {
    try {
        const post = await getAllPosts(c.env.DATABASE_URL);
        return c.json({ success: true, post });
    }
    catch (e) {
        return c.json({ success: false, error: e.message }, 500);
    }
});
blogRoute.get("/", async (c) => {
    try {
        const postId = c.req.query('id');
        const post = await getPostByPostId(Number(postId), c.env.DATABASE_URL);
        return c.json({ success: true, post });
    }
    catch (e) {
        return c.json({ success: false, error: e.message });
    }
});
blogRoute.post("/comment", async (c) => {
    try {
        const postId = c.req.query('id');
        const content = await c.req.json();
        const userId = c.get("authorId");
        const comment = await createcomment(Number(postId), userId, content, c.env.DATABASE_URL);
        return c.json({ success: true, comment });
    }
    catch (e) {
        return c.json({ success: false, error: e.message });
    }
});
blogRoute.get("/comments", async (c) => {
    try {
        const postId = c.req.query('id');
        const comments = await getCommentByPostId(Number(postId), c.env.DATABASE_URL);
        console.log(comments);
        return c.json({ success: true, comments });
    }
    catch (e) {
        return c.json({ success: false, error: e.message });
    }
});
blogRoute.get("/ratings", async (c) => {
    try {
        const postId = c.req.query('id');
        const rating = await getRatingByPostId(Number(postId), c.env.DATABASE_URL);
        return c.json({ success: true, rating });
    }
    catch (e) {
        return c.json({ success: false, error: e.message });
    }
});
blogRoute.post("/rating", async (c) => {
    const postId = c.req.query('id');
    const userId = c.get("authorId");
    const rating = await c.req.json();
    if (rating < 1 || rating > 5) {
        return c.json({ message: "Rating must be between 1 and 5" }, 400);
    }
    try {
        const result = await createrating(Number(postId), userId, rating, c.env.DATABASE_URL);
        if (result) {
            return c.json({
                message: "Rating saved successfully",
                rating: result
            });
        }
        return c.json({ message: "Failed to save rating" }, 500);
    }
    catch (e) {
        return c.json({ message: "Internal server error" }, 500);
    }
});
blogRoute.post("/upload", async (c) => {
    try {
        const body = await c.req.parseBody();
        const imageFile = body['image'];
        if (!imageFile || !(imageFile instanceof File)) {
            return c.json({ success: 0, message: "No image file found" }, 400);
        }
        const imgbbForm = new FormData();
        imgbbForm.append("image", imageFile, imageFile.name);
        const IMGBB_API_KEY = "f137a5b442a6e5c15303b1678dee3eaf";
        const imgbbRes = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
            method: "POST",
            body: imgbbForm,
        });
        const imgbbData = await imgbbRes.json();
        if (!imgbbData.success) {
            return c.json({ success: 0 }, 500);
        }
        return c.json({
            success: 1,
            file: {
                url: imgbbData.data.url,
            }
        });
    }
    catch (error) {
        return c.json({ success: 0, message: error.message }, 500);
    }
});
blogRoute.get("/categories", async (c) => {
    try {
        const categories = await GetAllCategories(c.env.DATABASE_URL);
        return c.json({ success: true, categories });
    }
    catch (e) {
        return c.json({ success: false, error: e.message });
    }
});
blogRoute.get("/category_id", async (c) => {
    try {
        const category_id = c.req.query('id');
        // console.log(category_id);
        const posts = await GetPostByCategories(c.env.DATABASE_URL, Number(category_id));
        return c.json({ success: true, posts });
    }
    catch (e) {
        return c.json({ success: false, error: e.message });
    }
});
