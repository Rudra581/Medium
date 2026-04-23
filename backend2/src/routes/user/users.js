import { Hono } from "hono";
import { findUser, insertUser, getUserByUSerId } from "../../DB/db";
import { sign } from 'hono/jwt';
import { signupInput, signinInput } from "@sedrftyuzesdxcfgh/medium";
// import {signupInput , signinInput} from "@sedrftyuzesdxcfgh/medium-common"
export const userRouter = new Hono();
userRouter.get("/", async (c) => {
    const userId = c.req.query('id');
    try {
        const user = await getUserByUSerId(Number(userId), c.env.DATABASE_URL);
        return c.json({ success: true, user });
    }
    catch (e) {
        console.log(e);
    }
});
userRouter.post("/signup", async (c) => {
    const body = await c.req.json();
    const { success } = signupInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "user Inputs not correct"
        });
    }
    try {
        const user = await insertUser({
            name: body.name,
            email: body.email || `${crypto.randomUUID()}@mail.com`,
            password: body.password,
        }, c.env.DATABASE_URL);
        const payload = user.id;
        const secret = c.env.JWT_SECRET;
        const jwt = await sign({ payload }, secret);
        return c.text(jwt);
    }
    catch (err) {
        return c.json({ success: false, error: err.message }, 500);
    }
});
userRouter.post("/signin", async (c) => {
    const body = await c.req.json();
    const { success } = signinInput.safeParse(body);
    if (!success) {
        c.status(411);
        return c.json({
            message: "Inputs not correct"
        });
    }
    const user = await findUser(body.email, c.env.DATABASE_URL);
    if (!user) {
        return c.json({ msg: "Username not exist Please signup" }, { status: 403 });
    }
    const payload = user.id;
    const secret = c.env.JWT_SECRET;
    const jwt = await sign({ payload }, secret);
    return c.text(jwt);
    // try{  
    // }
    // catch(e : any){
    //     return c.json({success : false , error : e.message});
    // }
});
