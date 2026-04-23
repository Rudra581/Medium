import { Link } from "react-router-dom";

interface BlogCardInput {
    authorName: string;
    title: string;
    content: string;
    publishedDate: string;
    id: number;
}

export const BlogCard = ({
    id,
    authorName,
    title,
    content,
    publishedDate
}: BlogCardInput) => {
    const imageUrl = getFirstImage(content);
    const excerpt = getExcerpt(content, 200);
    const finalContent = excerpt === "No content available" ? content.slice(0, 200) : excerpt;

    return (
        <Link to={`/blog/${id}`} className="block">
            {/* Main Wrapper: Flex row to put text on left and image on right */}
            <div className="p-4 border-b border-slate-200 pb-4 w-full max-w-screen-md cursor-pointer flex justify-between items-start gap-4">

                {/* Left Side: Content */}
                <div className="flex-1 overflow-hidden">
                    {/* Header: Avatar and Date */}
                    <div className="flex">
                        <div className="flex justify-center flex-col">
                            <Avtar name={authorName} x={24} y={24} />
                        </div>
                        <div className="flex justify-center flex-col font-normal text-xs pl-2">
                            {authorName}
                        </div>
                        <div className="flex justify-center flex-col pl-2">
                            <Circle />
                        </div>
                        <div className="flex justify-center flex-col pl-2 font-thin text-slate-500 text-xs">
                            {publishedDate}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="text-xl font-bold pt-3 leading-tight break-words line-clamp-2">
                        {title}
                    </div>

                    {/* Excerpt */}
                    <div className="text-sm font-md pt-1 text-slate-600 line-clamp-3 leading-snug">
                        {finalContent}
                    </div>

                    {/* Read Time */}
                    <div className="text-slate-400 text-xs font-thin pt-4">
                        {`${Math.ceil(finalContent.length / 100)} minute(s) read`}
                    </div>
                </div>

                {/* Right Side: Image */}
                {imageUrl && (
                    <div className="flex-none pt-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32">
                            <img
                                src={imageUrl}
                                alt="Cover"
                                className="w-full h-full object-cover rounded-md shadow-sm"
                            />
                        </div>
                    </div>
                )}
            </div>
        </Link>
    );
};

export function Avtar({ name, x, y }: { name: string; x: number; y: number }) {
    return (
        <div
            className="relative inline-flex items-center justify-center overflow-hidden bg-blue-200 rounded-full cursor-pointer"
            style={{ height: `${y}px`, width: `${x}px` }}
        >
            <span className="text-xs text-slate-600 font-extralight">
                {name ? name[0].toUpperCase() : "R"}
            </span>
        </div>
    );
}

function Circle() {
    return <div className="h-1 w-1 rounded-full bg-slate-400"></div>;
}

export const getExcerpt = (content: string, maxLength: number = 150) => {
    try {
        const parsed = JSON.parse(content);
        // 1. Filter only 'paragraph' blocks and join their text
        const fullText = parsed.blocks
            .filter((block: any) => block.type === 'paragraph')
            .map((block: any) => block.data.text)
            .join(" ");

        // 2. Remove HTML tags (like <b> or <a>) from the text
        const cleanText = fullText.replace(/<[^>]*>?/gm, '');

        // 3. Trim to the desired length
        if (cleanText.length <= maxLength) return cleanText;
        return cleanText.substring(0, maxLength) + "...";
    } catch (e) {
        return "No content available";
    }
};
export const getFirstImage = (content: string): string | null => {
    try {
        const parsed = JSON.parse(content);
        // Find the first block where type is 'image'
        const imageBlock = parsed.blocks.find((block: any) => block.type === 'image');

        // Return the URL if it exists, otherwise return null
        return imageBlock ? imageBlock.data.file.url : null;
    } catch (e) {
        return null;
    }
};