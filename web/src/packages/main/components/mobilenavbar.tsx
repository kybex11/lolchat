import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function MobileNavbar() {
    const { t, i18n } = useTranslation();
    const [lang, setLang] = useState("en");

    const changeLanguage = () => {
        if (lang == "en") {
            i18n.changeLanguage("ru");
            setLang("ru");
        } else if (lang == "ru") {
            i18n.changeLanguage("en");
            setLang("en");
        }
    }

    const logoClick = () => {
        window.location.href = "/";
    }

    const aboutClick = () => {
        window.location.href = "/about";
    }
    
    const webClick = () => {
        window.location.href = "/web";
    }

    const downloadsClick = () => {
        window.location.href = "/downloads";
    }

    return (
        <>
        <div className="navbar">
            <button className='navbar-button_m' onClick={logoClick}>Home</button>
            <button className='navbar-button_m' onClick={aboutClick}>{t('about')}</button>
            <button className='navbar-button_m' onClick={webClick}>{t('openlol')}</button>
            <button className='navbar-button_m' onClick={downloadsClick}>{t('download')}</button>

            
            <button className='navbar-button_m' onClick={changeLanguage}>{lang}</button>
        </div>
        </>
    )
}

//<button className='navbar-button' onClick={accountClick}>{t('account')}</button>   