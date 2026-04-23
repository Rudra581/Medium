import {  Link  , useNavigate} from "react-router-dom"
import React, { useState } from 'react';
import axios from "axios";
import { BACKEND_URL } from "../config";


export const Auth=({type}: {type : "signup" | "signin"})=>{
 const [email , setUSername] = useState("");
 const [password , setPassword] = useState("");
 const [name , setname] = useState("");
const navigate = useNavigate()
async function sendReq(){
  try{
const res =await axios.post(`${BACKEND_URL}/user/${type ==="signup" ? "signup" : "signin"}` ,type==="signup" ? {
    email,
    password,
    name
}: {email ,password })

const jwt = res.data;
console.log(res.status);
localStorage.setItem("token" , jwt);
navigate('/blogs')
  }
  catch(e : any){
    if(e.status == 403){
      alert("Email or PassWord is incorrect")
    }
    if(e.status == 411){
      alert("Password must be greater than 8 char")
    }
    console.log("Send Request fails" , e.status);
  }

}



return <div className="bg-slate-100 h-screen flex justify-center flex-col">
 
<div className="flex justify-center">
<div>
<div className="text-3xl font-extrabold">
  {type === "signin" ? "Welcome back" : "Create an account"}
 </div>
 <div className="text-slate-400" >
    {type === "signup" ? "Already have an account?" : "No account ?" }
    <Link className="pl-2 underline " to ={type === "signup" ?'/signin' : '/signup'}>{type === "signup" ?  "Login": "Create one"}</Link>
 </div>
 {type === "signup" ? <LabelInput label="Name" placeholder="Enter the name" onChange={(e)=>{
  console.log(e.target.value);
  setname(e.target.value);
  
}} ></LabelInput>:null}
<LabelInput label="Email" placeholder="Enter the Email" onChange={(e)=>{
  console.log(e.target.value);
  setUSername(e.target.value);
  
}} ></LabelInput>

<LabelInput label="Password" placeholder="Enter the Password" onChange={(e)=>{
  setPassword(e.target.value);
}} ></LabelInput>
<button onClick={sendReq} className="bg-stone-800 mt-2 rounded w-20 h-8 text-slate-50 cursor-pointer ">{type==='signup'  ? "signup" : "signin"}</button>
</div>
</div>
</div>
}


interface LabelInputType {
  label: string;
  placeholder: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // Added optional props
  type?: string; 
  autoComplete?: string;
  name?: string;
}

export const LabelInput = ({ 
  label, 
  placeholder, 
  onChange, 
  type, 
  autoComplete,
  name 
}: LabelInputType) => {
  return (
    <div className="pb-4">
      <label className="block mb-2 text-sm font-medium text-slate-900">
        {label}
      </label>
      <input 
        name={name}
        onChange={onChange} 
        type={type || "text"} 
        autoComplete={autoComplete || "on"}
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 shadow-sm placeholder:text-gray-400" 
        placeholder={placeholder} 
        required 
      />
    </div>
  );
};

export default LabelInput;
