import axios from "axios";
import { useEffect, useState } from "react"
import { BACKEND_URL } from "../config";
export interface Blog {
    "content": string,
    "title": string,
    "id": number
    "email": string
    "name": string
    "publisheddate"?: string
}
export interface User {
    id: number,
    email: string,
    password: string,
    name: string
}
export interface RatingSchema {
    average: string,
    total: number
}
export interface CommentSchema {
    id: number,
    content: string,
    publisheddate: string,
    authorName: string
}
export interface Category {
    id: number,
    name: string
}
export const useBlog = (id: number) => {
    const [loading, setLoading] = useState(true);
    const [blog, setBlog] = useState<Blog>();

    useEffect(() => {
        axios.get(`${BACKEND_URL}/blog?id=${id}`, { headers: { Authorization: localStorage.getItem("token") } })
            .then(resp => {
                console.log(resp.data.post[0]);
                setBlog(resp.data.post[0]);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch failed", err);
                setLoading(false);
            });
    }, [])
    return {
        loading,
        blog
    }
}
export const useComments = (blogId: number) => {
    const [comments, setComments] = useState<CommentSchema[]>([]);
    useEffect(() => {
        axios.get(`${BACKEND_URL}/blog/comments?id=${blogId}`, { headers: { Authorization: localStorage.getItem("token") } })
            .then(res => setComments(res.data.comments));
    }, []);
    return comments;
}
export const useRating = (blogId: number) => {
    const [rating, setRating] = useState<RatingSchema>();
    useEffect(() => {
        axios.get(`${BACKEND_URL}/blog/ratings?id=${blogId}`, { headers: { Authorization: localStorage.getItem("token") } })
            .then(res => setRating(res.data.rating || res.data));
    }, [])
    return { rating }
}


export const useBlogs = () => {
    const [loading, setLoading] = useState(true);
    const [blogs, setBlogs] = useState([]);
    useEffect(() => {
        axios.get(`${BACKEND_URL}/blog/bulk`, { headers: { Authorization: localStorage.getItem("token") } })
            .then(resp => {
                console.log(resp.data.post);
                setBlogs(resp.data.post);
                setLoading(false);
            })
    }, [])


    return {
        loading,
        blogs
    }
}
export const userDetail = (id: number) => {
    const [user, setUser] = useState<User>();
    useEffect(() => {
        axios.get(`${BACKEND_URL}/user?id=${id}`)
            .then(res => {
                setUser(res.data.user)

            })
    }, [])
    return {
        user
    }
}
export const useCategory = () => {
    const [cat, setcat] = useState<Category[]>();
    useEffect(() => {
        axios.get(`${BACKEND_URL}/blog/categories`, { headers: { Authorization: localStorage.getItem("token") } })
            .then(res => {
                setcat(res.data.categories);
            })
    }, [])
    console.log(typeof (cat));
    return { cat };
}
