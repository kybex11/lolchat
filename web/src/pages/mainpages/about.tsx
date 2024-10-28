import Navbar from "../../components/navbar";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from 'react';
import MobileNavbar from '../../components/mobilenavbar';


export default function about() {
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
    const { t, i18n } = useTranslation();

    return (
        <>
            <Navbar />
            <br />
            <h3 className="white-text h3_m">
                {t('text1')} <br />
                <br /> {t('text2')} <br />
                <br /> {t('text3')} <br />
                <br /> {t('text4')} <br />
                <br /> {t('text5')} <br />
            </h3>
            <h1 className="white-text">TG: kybex11</h1>
            <h1 className="white-text">VK: enemylol2</h1>
        </>
    )
}

function MobileComponent() {

    const { t, i18n } = useTranslation();

    return (
        <>
            <MobileNavbar />
            <br />
            <h1 className="white-text">
                {t('text1')} <br />
                <br /> {t('text2')} <br />
                <br /> {t('text3')} <br />
                <br /> {t('text4')} <br />
                <br /> {t('text5')} <br />
            </h1>
            <h1 className="white-text">TG: kybex11</h1>
            <h1 className="white-text">VK: enemylol2</h1>
        </>
    )
}