import { Hono } from "hono";
import { initDB } from "./DB/db.js";
import { userRouter } from "./routes/user/users.js";
import { blogRoute } from "./routes/blogs/blogs.js";
import { cors } from 'hono/cors';
import { openAI_router } from "./AI/summ.js";
const app = new Hono();
app.use('/*', cors());
app.route("/user", userRouter);
app.route("/blog", blogRoute);
app.route("/openai", openAI_router);
app.get("/", async (c) => {
    await initDB(c.env.DATABASE_URL);
    return c.text("Hello Hono!");
});
export default app;
