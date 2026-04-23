import { Hono } from "hono";
import { insertUser , initDB, insertPost, updatePost, getAllPosts, getPostByUserId } from "./DB/db.js";
import {userRouter} from "./routes/user/users.js"
import { blogRoute } from "./routes/blogs/blogs.js";

import { cors } from 'hono/cors'
import { openAI_router } from "./AI/summ.js";

type Bindings = {
  DATABASE_URL: string;
  JWT_SECRET: string;
};
const app = new Hono<{ Bindings: Bindings }>();
app.use('/*', cors())
app.route("/user", userRouter);
app.route("/blog" , blogRoute);
app.route("/openai" ,openAI_router
);

app.get("/", async(c) =>{ 
  await initDB (c.env.DATABASE_URL);
  return c.text("Hello Hono!")});

export default app;
