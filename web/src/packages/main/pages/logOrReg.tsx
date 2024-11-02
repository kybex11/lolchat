import { Link } from "react-router-dom"
import Navbar from "../components/navbar"
import { checkLogin } from "../cookies";

export default function LogOrReg() {
    if (checkLogin()) {
        window.location.href = "/web"; 
     } else {
        return (
         <>
         <Navbar/>
         <div className="pcontainer">
             <Link className="link" to="register">Register</Link>
             <h1>or</h1>
             <Link className="link" to="login">Login</Link>
         </div>
         </>
     ) 
     }
}
