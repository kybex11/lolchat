import { useTranslation } from "react-i18next";
import Navbar from "../../components/navbar";

export default function Downloads() {
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