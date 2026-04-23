import { Signup } from './pages/Signup'
import { Signin } from './pages/Signin'
import { Blog } from './pages/Blog'
import { Blogs } from './pages/Blogs'
import { Publish } from './pages/Publish'
import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'

function App() {
  return (
    <div >
      <BrowserRouter>
        <Routes>
          <Route path='/signup' element={<Signup />}></Route>
          <Route path='/signin' element={<Signin></Signin>}></Route>
          <Route path='/blog/:id' element={<Blog />}></Route>
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:categoryId" element={<Blogs />} />
          <Route path='/publish' element={<Publish />}></Route>
          <Route path='/' element={<LandingPage></LandingPage>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
