import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from 'react-auth-kit';
import UaerProvider from './context/context';
import ShoppingCartProvider from './context/shoppingCartContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';  
import HttpApi from 'i18next-http-backend';

const root = ReactDOM.createRoot(document.getElementById('root'));
const strioePromise = loadStripe(process.env.REACT_APP_STRIPE_KEY)

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    debug:true ,
    fallbackLng: "en",
    detection: {
      order: ['cookie', 'htmlTag', 'localStorage', 'sessionStorage', 'navigator', 'path', 'subdomain'],
      caches: ["cookie"]
    },
    backend: {
      loadPath: '/locale/{{lng}}/{{ns}}.json',
    }
  });

  root.render(
    
  <AuthProvider
    authType='cookie'
    authName='_auth'
    cookieDomain={window.location.hostname}
    cookieSecure={false}
  >
    <BrowserRouter>
      <React.StrictMode>
        <UaerProvider>
          <ShoppingCartProvider>
            <GoogleOAuthProvider clientId='318228430339-6at3qe0f5pvcm3cfmicumaand7ta0ci9.apps.googleusercontent.com'>
              <Elements stripe={strioePromise}>
                <App />
              </Elements>
            </GoogleOAuthProvider>
          </ShoppingCartProvider>
        </UaerProvider>
      </React.StrictMode>
    </BrowserRouter>
  </AuthProvider>
);


