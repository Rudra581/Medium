import { useState } from "react"
import { useComments, useRating, type CommentSchema } from "../hooks"
import { Appbar } from "./Appbar"
import { Avtar } from "./BlogCard"
import { renderBlocks } from "./BlogRender"
import axios from "axios"
import { BACKEND_URL } from "../config"
import ReactMarkdown from 'react-markdown'

interface Blog {
    "content": string,
    "title": string,
    "id": number,
    "authorid"?: number,
    "email": string
    "name": string
}

interface Comment {
    id: number;
    name: string;
    email: string;
    comment: string;
    rating: number;
    createdAt: string;
}

export const FullBlog = ({ blog }: { blog: Blog }) => {
    const comment = useComments(blog.id);
    const rating = useRating(blog.id);

    const [selectedRating, setSelectedRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [commentText, setCommentText] = useState('');
    const [visibleComments, setVisibleComments] = useState(4);

    // 1. New states for AI Summary
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [summary, setSummary] = useState("");
    const [isSummarizing, setIsSummarizing] = useState(false);

    const handleGetSummary = async () => {
        setIsModalOpen(true);
        if (summary) return;
        setIsSummarizing(true);
        try {
            const response = await axios.post(`${BACKEND_URL}/openai/summarize`, {
                text: blog.content
            });
            console.log(response.data);
            setSummary(response.data);
        } catch (e) {
            setSummary("Failed to generate summary. Please try again later.");
        } finally {
            setIsSummarizing(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedRating === 0) {
            alert('Please select a rating!');
            return;
        }
        const trimstring = commentText.trim();
        if (trimstring === "") {
            alert("Please Fill the Comment");
            return;
        }
        const config = {
            headers: {
                Authorization: localStorage.getItem("token") || ""
            }
        };

        await Promise.all([
            axios.post(
                `${BACKEND_URL}/blog/comment?id=${blog.id}`,
                { content: trimstring },
                config
            ),
            axios.post(
                `${BACKEND_URL}/blog/rating?id=${blog.id}`,
                selectedRating,
                config
            )])
        alert("Comment posted successfully!");
        window.location.reload();

        setCommentText('');
        setSelectedRating(0);
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now.getTime() - date.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Yesterday';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
        return date.toLocaleDateString();
    };

    const loadMoreComments = () => {
        setVisibleComments(prev => prev + 4);
    };

    const showLessComments = () => {
        setVisibleComments(4);
    };

    return (
        <div>
            <Appbar />
            <div className="flex justify-center">
                <div className="grid grid-cols-12 px-10 w-full pt-12 max-w-screen-xl">
                    <div className="col-span-8">
                        <div className="text-5xl font-extrabold">{blog.title}</div>
                        <div className="pt-4 text-slate-500 ">Posted on Feb 7, 2026</div>
                        <div className="pt-4 whitespace-pre-line">
                            {renderBlocks(blog.content) === null ? blog.content : renderBlocks(blog.content)}
                        </div>

                        <div className="mt-10 mb-10">
                            {/* Rating Section */}
                            <div className="rounded-lg p-4 border border-gray-300 mb-4">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-bold text-gray-800">Rate This Article</h2>
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl font-bold text-gray-800">{rating.rating?.average || 0}</div>
                                        <div className="flex gap-0.5 text-yellow-500">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <span key={star} className="text-sm">
                                                    {star <= Math.round(Number(rating.rating?.average) || 0) ? '★' : '☆'}
                                                </span>
                                            ))}
                                        </div>
                                        <span className="text-xs text-gray-500">({rating.rating?.total || 0})</span>
                                    </div>
                                </div>
                                <div className="flex gap-1 mt-3">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setSelectedRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="text-2xl transition-all duration-200 hover:scale-110 focus:outline-none"
                                        >
                                            <span className={star <= (hoverRating || selectedRating) ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment Section */}
                            <div className="rounded-lg p-4 border border-gray-300 mb-4">
                                <h3 className="text-base font-bold text-gray-800 mb-3">Leave a Comment</h3>
                                <form onSubmit={handleSubmit}>
                                    <textarea
                                        placeholder="Share your thoughts..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        required
                                        rows={2}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none mb-2 text-sm"
                                    />
                                    <button
                                        type="submit"
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-5 py-1.5 rounded-lg font-semibold text-xs cursor-pointer transition-all"
                                    >
                                        Post Comment
                                    </button>
                                </form>
                            </div>

                            {/* Comments List */}
                            <div className="rounded-lg p-4 border border-gray-300">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-base font-bold text-gray-800">Comments</h3>
                                    <span className="bg-blue-500 text-white px-2.5 py-0.5 rounded-full text-xs font-semibold">
                                        {comment?.length || 0}
                                    </span>
                                </div>
                                {comment && comment.length > 0 ? (
                                    <>
                                        <div className="grid grid-cols-2 gap-3">
                                            {comment.slice(0, visibleComments).map((c: CommentSchema) => (
                                                <div key={c.id} className="rounded-lg p-3 border border-gray-200 bg-white flex flex-col h-32">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-xs">
                                                            {getInitials(c.authorName)}
                                                        </div>
                                                        <div className="flex-1 min-w-0 text-xs">
                                                            <h4 className="font-semibold truncate">{c.authorName}</h4>
                                                            <p className="text-gray-500">{formatDate(c.publisheddate)}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex-1 overflow-y-auto text-xs text-gray-700">
                                                        {c.content}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                        {comment.length > 4 && (
                                            <div className="mt-4 text-center">
                                                <button onClick={visibleComments < comment.length ? loadMoreComments : showLessComments} className="bg-blue-500 text-white px-6 py-2 rounded-lg text-xs font-semibold">
                                                    {visibleComments < comment.length ? "View More" : "Show Less"}
                                                </button>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    <div className="text-center py-6 text-gray-400 text-xs">No comments yet.</div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="col-span-4 pl-5">
                        <div className="text-slate-600 text-lg">Author</div>
                        <div className="flex">
                            <div className="pt-1 pr-2">
                                <Avtar name={blog.name} x={32} y={32} />
                            </div>
                            <div className="text-2xl font-bold">{blog.name}</div>
                        </div>
                        <div className="pt-2 text-slate-500">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque praesentium officiis ducimus inventore voluptatum excepturi illo cupiditate explicabo perspiciatis provident distinctio, repellendus vitae minima saepe fugit necessitatibus eveniet laborum maiores.
                        </div>
                        <div className="pt-5">
                            <button
                                onClick={handleGetSummary}
                                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer"
                            >
                                <span className="text-lg">✨</span>
                                Summarize with AI
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Summary Modal moved INSIDE the return div */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden transform animate-in zoom-in-95 duration-300">
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                            <div className="flex items-center gap-2">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <span className="text-xl">🪄</span>
                                </div>
                                <h3 className="text-xl font-bold text-slate-800">AI Insights</h3>
                            </div>
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
                        </div>

                        <div className="p-8">
                            {isSummarizing ? (
                                <div className="flex flex-col items-center justify-center py-12">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                                    <p className="text-slate-500 font-medium animate-pulse">Gemini is reading your blog...</p>
                                </div>
                            ) : (
                                <div className="prose prose-blue max-w-none">
                                    <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 text-slate-700 leading-relaxed whitespace-pre-line">
                                        <div className="markdown-content prose prose-slate max-w-none">
                                            <ReactMarkdown>
                                                {summary}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end">
                            <button onClick={() => setIsModalOpen(false)} className="bg-white border border-slate-200 text-slate-600 px-6 py-2 rounded-lg font-semibold hover:bg-slate-100 transition-all">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}