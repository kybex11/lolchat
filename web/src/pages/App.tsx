import { useTranslation } from 'react-i18next';
import Navbar from '../components/navbar';
import '../styles/index.css';
import { useEffect, useState } from 'react';

export default function App() {
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
      <div className="container">
        <h1 className='title left20 h1'>LoL Chat - <span className='red-text sample_one'>{t('not')}</span> {t('messenger')}</h1>
        <h3 className='title h3'>LoL Chat - {t('neweraofmessenging')}</h3>
        <h1 className='white-text'>Currently the page in development</h1>
      </div>
      </>
  )
}

function MobileComponent() {
  return (
    <>
    <h1>Currently not adapted for phones</h1>
    </>
  )
}