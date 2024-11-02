import '../styles/navbar.css';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export default function Navbar() {
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
        <br />
        <div className="navbar">
            <button onClick={logoClick} className='logo'><h1 className='logo-text'>LoL</h1></button>
            <button className='navbar-button' onClick={aboutClick}>{t('about')}</button>
            <button className='navbar-button' onClick={webClick}>{t('openlol')}</button>
            <button className='navbar-button' onClick={downloadsClick}>{t('download')}</button>
        
            <button className='navbar-button' onClick={changeLanguage}>{lang}</button>
        </div>
        </>
    )
}

//<button className='navbar-button' onClick={accountClick}>{t('account')}</button>   