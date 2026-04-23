import { useParams } from "react-router-dom";
import { useBlog } from "../hooks";
import { FullBlog } from "../components/FullBlog";
import { Loader } from "../components/Loader";


export function Blog() {
    // 1. useParams returns an object, so we destructure { id }
    // 2. We define the type inside <> as an object interface
    const { id } = useParams<{ id: string }>();
    const { loading, blog } = useBlog(Number(id));
    console.log(blog);
    if (loading) {
        return <div>
          <Loader></Loader>
        </div>
    }
    if (!blog) {
        return <div>Post not found.</div>;
    }
    console.log(blog);
    return (
        <div>
          <FullBlog blog={blog}></FullBlog>
        </div>
    );
}