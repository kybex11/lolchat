import { createRoot } from 'react-dom/client'

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import App from './packages/main/pages//App.tsx'
import Web from './packages/main/pages//Web.tsx';

import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom';
import Register from './packages/main/pages//Register.tsx';
import Login from './packages/main/pages//Login.tsx';
import LogOrReg from './packages/main/pages//logOrReg.tsx';
import Downloads from './packages/main/pages//mainpages/downloads.tsx';
import About from './packages/main/pages//mainpages/about.tsx';
import Account from './packages/main/pages//mainpages/account.tsx';
import Settings from './packages/main/pages//chat_pages/settings.tsx';

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

      "text1": "LoL Chat is a messenger aimed at communication and convenience.",
      "text2": "The product is developed in Russia by SSLabs organization.",
      "text3": "Our goal is to achieve a regular online presence and active users.",
      "text4": "We are waiting for you on our platform. ",
      "text5": "if you want to work in SSLabs write to email (varnetcoding@gmail.com) or write to LoL to me personally (kybex11)."
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

      "text1": "LoL Chat - это мессенджер направленный на общение и удобство общения.",
      "text2": "Продукт разработан в России организацией SSLabs.",
      "text3": "Наша задача это добиться обычного онлайна и активных пользователей",
      "text4": "Ждем вас на нашей платформе.",
      "text5": "Если вы хотите работать в SSLabs пишите на почту (varnetcoding@gmail.com) или пишите в LoL мне лично (kybex11)"
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