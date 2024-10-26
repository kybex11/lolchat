import { Link } from "react-router-dom"
import Navbar from "../components/navbar"

export default function LogOrReg() {
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