import { Link, useNavigate } from "react-router-dom";
import { Appbar } from "../components/Appbar";
import axios from "axios";
import { BACKEND_URL } from "../config";
import { useState, useEffect, useRef } from "react";
import EditorJS from '@editorjs/editorjs';
// @ts-ignore
import Header from '@editorjs/header';
// @ts-ignore
import List from '@editorjs/list';
// @ts-ignore
import ImageTool from '@editorjs/image';
// @ts-ignore
import CodeTool from '@editorjs/code';

export const Publish = () => {
    const [title, setTitle] = useState("");
    const navigate = useNavigate();
    const ejInstance = useRef<EditorJS | null>(null);
    const [category, setCategory] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [tempImage, setTempImage] = useState(null);
    // This tracks if the AI is currently "thinking"

    const base64ToFile = async (base64String: string, fileName: string) => {
        const res = await fetch(base64String);
        const blob = await res.blob();
        return new File([blob], fileName, { type: 'image/png' });
    };


    const handleAIGenerate = async () => {
        // This holds the long string from the AI

        const imgTitle = prompt("What should the AI generate?");
        if (!imgTitle) return;

        setIsGenerating(true);
        try {
            console.log(imgTitle);
            const aiResponse = await axios.post(`${BACKEND_URL}/openai/generate_image`,
                { title: imgTitle },

            );
            console.log(aiResponse.data);
            if (aiResponse.data) {
                setTempImage(aiResponse.data);
            }
        } catch (e) {
            console.error(e);
            alert("Failed to generate AI image");
        } finally {
            setIsGenerating(false);
        }
    };

    useEffect(() => {
        if (!ejInstance.current) {
            const editor = new EditorJS({
                holder: 'editorjs',
                placeholder: 'Tell your story...',
                tools: {
                    header: { class: Header as any, inlineToolbar: true },
                    list: { class: List, inlineToolbar: true },
                    code: CodeTool,
                    image: {
                        class: ImageTool,
                        config: {
                            endpoints: {
                                byFile: `${BACKEND_URL}/blog/upload`,
                            },
                            additionalRequestHeaders: {
                                Authorization: localStorage.getItem("token") || ""
                            }
                        }
                    }
                },
                onReady: () => { ejInstance.current = editor; }
            });
        }
        return () => {
            ejInstance.current?.destroy();
            ejInstance.current = null;
        };
    }, []);

    const handlePublish = async () => {
        const contentData = await ejInstance.current?.save();
        if (!title?.trim() || !contentData?.blocks.length) {
            alert("Title and Content cannot be empty");
            return;
        }
        const c = Number(category);
        try {
            const response = await axios.post(`${BACKEND_URL}/blog`,
                {
                    title,
                    content: JSON.stringify(contentData),
                    publishedDate: new Date(),
                    category_id: c
                },
                { headers: { Authorization: localStorage.getItem("token") || "" } }
            );
            navigate(`/blog/${response.data.post[0].id}`);
        } catch (e: any) {
            alert("Error while publishing");
        }
    };

    return (
        <div>
            {tempImage && (
                <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '400px' }}>
                        <img src={tempImage} style={{ width: '100%' }} alt="Preview" />
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                            <button onClick={() => setTempImage(null)}>Discard</button>
                            <button >Save to Blog</button>
                        </div>
                    </div>
                </div>
            )}
            <Appbar />
            <div className="flex flex-col items-center w-full pt-8 px-4">
                <div className="w-full max-w-screen-md mb-4 flex gap-2">
                    <input
                        onChange={(e) => setTitle(e.target.value)}
                        type="text"
                        className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 text-xl font-bold rounded-lg focus:ring-blue-500 outline-none"
                        placeholder="Title"
                    />
                    {/* --- AI Generate Button --- */}
                    <button
                        onClick={handleAIGenerate}
                        disabled={isGenerating}
                        className="whitespace-nowrap rounded-lg bg-purple-600 px-4 text-sm font-bold text-white hover:bg-purple-700 disabled:bg-purple-300"
                    >
                        {isGenerating ? "Magic..." : "Generate AI Cover"}
                    </button>
                </div>

                <div className="w-full max-w-screen-md bg-white border border-gray-300 rounded-lg p-4 min-h-[400px]">
                    <div id="editorjs"></div>
                </div>

                <div className="w-full max-w-screen-md flex justify-between items-center mt-4">
                    <Link to="/blogs">
                        <button className="px-6 py-2 text-xs font-bold text-gray-600 uppercase hover:bg-gray-100">
                            Back to Feed
                        </button>
                    </Link>

                    <div>
                        <label className="font-medium mr-2">Category:</label>
                        <select
                            className="font-semibold shadow-sm border rounded px-2 py-2"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="">--Select--</option>
                            <option value="1">Tech</option>
                            <option value="2">Financial</option>
                            <option value="4">Comedy</option>
                        </select>
                    </div>

                    <button
                        onClick={handlePublish}
                        className="rounded-md bg-green-600 py-2 px-8 text-xs font-bold uppercase text-white shadow-md hover:bg-green-700 transition-all"
                    >
                        Publish Post
                    </button>
                </div>
            </div>
        </div>
    );
};