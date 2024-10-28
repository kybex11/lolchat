import Navbar from "../../components/navbar";
import { useTranslation } from "react-i18next";

export default function about() {
    const { t, i18n } = useTranslation();

    return (
        <>
        <Navbar/>
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