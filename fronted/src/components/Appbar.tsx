import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Avtar } from "./BlogCard";
import { jwtDecode } from "jwt-decode";
import { userDetail } from "../hooks";

export const Appbar = () => {
 
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/signin");
    };
    const jwt = localStorage.getItem("token");
     const decoded = jwtDecode(jwt || "");
    // console.log(decoded)
    const userId ={decoded}
    const id = userId.decoded.payload;
    const user =  userDetail(id)
    const name = user.user?.name;

    console.log(name);
    return (
        <div className="border-b flex justify-between px-10 py-3 relative bg-white">
            <Link to={`/blogs`}>
                <div className="flex flex-col justify-center cursor-pointer font-extrabold ml-4 text-3xl font-serif">
                    Medium
                </div>
            </Link>

            <div className="flex items-center gap-4">
                <Link to={`/publish`}>
                    <button className="text-white bg-slate-800 hover:bg-green-800 font-medium rounded-full text-sm w-24 h-8 cursor-pointer transition-all">
                        New
                    </button>
                </Link>

                
                <div className="relative">
                    <div 
                        className="cursor-pointer" 
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <Avtar name={ name || "Rudra"} x={32} y={32} />
                    </div>

                   
                    {isMenuOpen && (
                        <>
                            
                            <div 
                                className="fixed inset-0 z-10" 
                                onClick={() => setIsMenuOpen(false)}
                            ></div>

                            <div className="absolute right-0 mt-3 w-48 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-2 overflow-hidden">
                                <div className="px-4 py-2 border-b border-slate-100 mb-1">
                                    <p className="text-xs text-slate-500">Signed in as</p>
                                    <p className="text-sm font-bold truncate">{name}</p>
                                </div>
                                
                                <Link 
                                    to="/profile" 
                                    className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Profile
                                </Link>

                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium border-t border-slate-100 mt-1"
                                >
                                    Sign out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};