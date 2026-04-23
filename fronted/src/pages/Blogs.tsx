import { BlogCard } from "../components/BlogCard"
import { Appbar } from "../components/Appbar"
import { useBlogs, useCategory } from "../hooks"
import { Loader } from "../components/Loader"
import { useParams, useNavigate } from "react-router-dom"
export const Blogs = () => {
    const { loading, blogs } = useBlogs();
    const cate = useCategory();
    const categories = cate.cat;
    const navigate = useNavigate();
    const { categoryId } = useParams();
    console.log(typeof (categoryId))
    console.log(categories?.length);
    const filteredBlogs = categoryId
        ? blogs.filter((blog: any) => (blog.category_id) === Number(categoryId))
        : blogs;
    console.log(filteredBlogs);
    if (loading) {
        return <div className="flex justify-center items-center h-screen">
            <Loader />
        </div>
    }

    return <div>
        <Appbar />
        <div className="flex justify-center">
            {/* Main Container: Sets the width for both blogs and sidebar */}
            <div className="flex flex-col md:flex-row gap-2 max-w-screen-xl w-full pl-45  pr-0 px-5 py-8">

                {/* Left Side: Your Blog List */}
                <div className="flex-[2.5]">
                    {
                        filteredBlogs.map((blog: any) => (
                            <BlogCard
                                key={blog.id}
                                id={blog.id}
                                authorName={blog.name || "Anonymous"}
                                title={blog.title}
                                content={blog.content}
                                publishedDate={"1st Jan 2026"}
                            />
                        ))}
                </div>

                {/* Right Side: Recommended Topics (The sidebar) */}
                <div className="flex-1 hidden md:block">
                    <div className="">
                        <h3 className="font-bold text-gray-900 mb-4">
                            Recommended topics
                        </h3>

                        {/* Categories Grid/Flex */}
                        <div className="flex flex-wrap gap-2">
                            {categories?.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => navigate(`/blogs/${cat.id}`)}
                                    className={`px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm rounded-full transition-all cursor-pointer border ${Number(categoryId) === cat.id
                                        ? "border-black bg-slate-100 text-black font-medium"
                                        : "border-transparent bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
                                >
                                    {cat?.name}
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <button className="text-green-700 text-sm font-medium hover:text-black cursor-pointer">
                                See more topics
                            </button>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
}