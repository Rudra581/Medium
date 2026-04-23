import { Hono } from "hono";
import { GoogleGenAI } from "@google/genai";
export const openAI_router = new Hono();
const ai = new GoogleGenAI({ apiKey: "" });
export const extractTextForAI = (content) => {
    try {
        const parsedData = JSON.parse(content);
        return parsedData.blocks.map((block) => {
            switch (block.type) {
                case "header":
                    return `${"#".repeat(block.data.level || 1)} ${block.data.text}`;
                case "paragraph":
                    return block.data.text;
                case "image":
                    return block.data.caption ? `[Image Description: ${block.data.caption}]` : "";
                case "list":
                    return block.data.items.map((item) => `* ${item}`).join("\n");
                case "code":
                    return `\`\`\`\n${block.data.code}\n\`\`\``;
                default:
                    return "";
            }
        }).join("\n\n");
    }
    catch (e) {
        return "";
    }
};
async function summarizeBlog(text) {
    const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [`Summarize this blog into a punchy 2-sentence intro and 3 bullet points: ${text}`],
        config: {
            tools: [{ urlContext: {} }]
        }
    });
    return response.text;
}
openAI_router.post("/summarize", async (c) => {
    const body = await c.req.json();
    // console.log(body.text);
    const content = extractTextForAI(body.text);
    console.log(content ? content : body.text);
    const summary = await summarizeBlog(content ? content : body.text);
    return c.json(summary);
});
async function cloudflare_image_generator(title, env) {
    try {
        const response = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', {
            prompt: `Minimalist, professional blog cover for: "${title}"`,
            num_steps: 4
        });
        // console.log("response is",response);
        // const base64Data = btoa(String.fromCharCode(...new Uint8Array(response)));
        // console.log("base64 is ",base64Data);
        return response.image;
    }
    catch (e) {
        console.error("Cloudflare AI Error:", e);
        return { success: false, message: e.message };
    }
}
openAI_router.post("/generate_image", async (c) => {
    const body = await c.req.json();
    const title = body.title;
    if (!title) {
        return c.json({ success: false, message: "Title is required" }, 400);
    }
    const resp = await cloudflare_image_generator(title, c.env);
    return new Response(resp, {
        headers: {
            "Content-Type": "image/png",
        },
    });
});
