import { useTranslation } from "react-i18next";
import Navbar from "../../components/navbar";
import { useEffect, useState } from 'react';
import MobileNavbar from "../../components/mobilenavbar";

export default function Downloads() {
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
    const { t } = useTranslation();
    return (
        <>
        <Navbar/>
        <br />
        <div className="container">
            <h1 className="title white-text">{t("downloads_timely")}.</h1>
        </div>
        </>
    )
}

function MobileComponent() {
    const { t } = useTranslation();
    return (
        <>
        <MobileNavbar/>
        <br />
        <div className="container">
            <h1 className="title white-text">{t("downloads_timely")}.</h1>
        </div>
        </>
    )
}