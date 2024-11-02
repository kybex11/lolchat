import { Link } from "react-router-dom"
import Navbar from "../components/navbar"
import { useEffect, useState } from 'react';
import MobileNavbar from "../components/mobilenavbar";

export default function LogOrReg() {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);

        setIsMobile(isMobileDevice);
    }, []);

    return (
        <>
            {isMobile ? <MobileComponent /> : <DesktopComponent />}
        </>
    )
}

 function DesktopComponent() {
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

function MobileComponent() {
    return (
        <>
        <MobileNavbar/>
        <div className="pcontainer">
            <Link className="link_m" to="register">Register</Link>
            <h1>or</h1>
            <Link className="link_m" to="login">Login</Link>
        </div>
        </>
    )
}

