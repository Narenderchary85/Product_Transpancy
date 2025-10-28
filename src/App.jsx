import { Route, Routes } from "react-router";
import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Products from "./components/Products";
import AddProductForm from "./components/AddProductForm";

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/products" element={<Products/>}/>
        <Route path="/addproduct" element={<AddProductForm/>}/>
      </Routes>
    </>
  )
}

export default App
