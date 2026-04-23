export const renderBlocks = (content: string) => {
    try {
        const parsedData = JSON.parse(content);
        return parsedData.blocks.map((block: any) => {
            switch (block.type) {
                case "header":
                    // Dynamically choose h1-h6 based on Editor.js data
                    const HeaderTag = `h${block.data.level}` as any;
                    return <HeaderTag key={block.id} className="font-bold my-4 text-2xl">
                        {block.data.text}
                    </HeaderTag>;

                case "paragraph":
                    return <p key={block.id} className="text-lg text-slate-700 leading-relaxed mb-4"
                        dangerouslySetInnerHTML={{ __html: block.data.text }} />;

                case "image":
                    return (
                        <div key={block.id} className="my-8 max-w-svw" >
                            <img
                                src={block.data.file.url}
                                alt={block.data.caption || ""}
                                className="w-full rounded-lg shadow-sm"
                            />
                            {block.data.caption && (
                                <p className="text-center text-sm text-slate-500 mt-2 italic">
                                    {block.data.caption}
                                </p>
                            )}
                        </div>
                    );

                case "list":
                    const ListTag = block.data.style === "ordered" ? "ol" : "ul";
                    return (
                        <ListTag key={block.id} className="list-inside list-disc ml-4 mb-4">
                            {block.data.items.map((item: string, i: number) => (
                                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                            ))}
                        </ListTag>
                    );
                case "code":
                    return (
                        <div key={block.id} className="my-6">
                            <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto">
                                <code className="font-mono text-sm leading-6">
                                    {block.data.code}
                                </code>
                            </pre>
                        </div>
                    );

                default:
                    return null;
            }
        });
    } catch (e) {
        return null;
    }
};