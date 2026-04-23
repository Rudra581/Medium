import z from "zod";
export const signupInput = z.object({
    email: z.string(),
    password: z.string().min(6),
    name: z.string().optional()
});
export const signinInput = z.object({
    email: z.string(),
    password: z.string().min(6),
});
export const createBlogInput = z.object({
    title: z.string(),
    content: z.string(),
});
export const updateBlogInput = z.object({
    title: z.string(),
    content: z.string(),
    id: z.number().optional()
});
//# sourceMappingURL=index.js.map