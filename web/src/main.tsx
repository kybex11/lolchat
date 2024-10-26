import { createRoot } from 'react-dom/client'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import App from './pages/App.tsx'
import Web from './pages/Web.tsx';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Register from './pages/Register.tsx';
import Login from './pages/Login.tsx';
import LogOrReg from './pages/logOrReg.tsx';
import Downloads from './pages/mainpages/downloads.tsx';
import About from './pages/mainpages/about.tsx';
import Account from './pages/mainpages/account.tsx';
import Settings from './pages/chat_pages/settings.tsx';

const resources = {
  en: {
    translation: {
      "about": "About",
      "openlol": "Open LoL",
      "download": "Download",
      "account": "Account",
      "not": "not",
      "messenger": "Messenger",
      "neweraofmessenging": "new era of messenging",
      "downloads_timely": "Sorry, Currently downloads not available",
    }
  },
  ru: {
    translation: {
      "about": "О нас",
      "openlol": "Открыть LoL",
      "download": "Скачать",
      "account": "Аккаунт",
      "not": "не",
      "messenger": "Мессенджер",
      "neweraofmessenging": "новая эра общения",
      "downloads_timely": "Извините, В данный момент скачивание не доступно",
    }
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    interpolation: {
      escapeValue: false
    }
  });

const router = createBrowserRouter([
  {
    path: "/",
    element: <App/>
  },
  {
    path: "web",
    element: <Web/>
  },
  {
    path: "router/register",
    element: <Register/>
  },
  {
    path: "router/login",
    element: <Login/>
  },
  {
    path: "router",
    element: <LogOrReg/>
  },
  {
    path: "downloads",
    element: <Downloads/>
  },
  {
    path: "about",
    element: <About/>
  },
  {
    path: "account",
    element: <Account/>
  },
  {
    path: "web/settings",
    element: <Settings/>
  }
]);


createRoot(document.getElementById("root")!).render(
  <RouterProvider router={router}/>
)