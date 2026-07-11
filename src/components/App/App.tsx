import { useState } from "react";
import { useEffect } from "react";
import AppLoggedIn from "../AppLoggedIn/AppLoggedIn";
import "./App.css";

import { CookiesProvider, useCookies } from "react-cookie";
import ErrorState from "../ErrorState/ErrorState";
import { samlLogin } from "../../utilities/saml";
import { ToastContainer } from "react-toastify";

export default function App() {
  return (
    <CookiesProvider>
      <AppLoginNegotiation />
      <ToastContainer />
    </CookiesProvider>
  );
}

function AppLoginNegotiation() {
  const [searchParams, setSearchParams] = useState<URLSearchParams>();
  const [, setCookie] = useCookies(["iosLogin"]);

  useEffect(() => {
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    if (searchParams?.has("df")) {
      const dfString = localStorage.getItem("darkFeatures");
      const df = dfString ? JSON.parse(dfString) : {};
      df[searchParams.get("df") ?? ''] = true;
      localStorage.setItem("darkFeatures", JSON.stringify(df));
      window.location.href = "/";
    }
  })

  useEffect(() => {
    if (searchParams?.has("iosLogin")) {
      setCookie("iosLogin", true);
      window.location.href = "/";
    }
  })

  return searchParams !== undefined ? (
    searchParams?.has("loginError") ? (
      searchParams.get("loginError") === "om" ? (
        <ErrorState
          statusCode={403}
          message="This website is only for order members. Make sure you are logging in with the same credentials that you use to log into thebuddhistcentre.com and that your order account has been activated."
        />
      ) : (
        <ErrorState statusCode={500} />
      )
    ) : (
      <AppLoginRedirector />
    )
  ) : (
    <></>
  );
}

function AppLoginRedirector() {
  const [cookies, , removeCookie] = useCookies(["jwt", "iosLogin"]);
  const [error, setError] = useState<Error | undefined>(undefined);
  const isLoggedIn = cookies.jwt !== undefined;

  useEffect(() => {
    if (!isLoggedIn) {
      samlLogin((error, login_url) => {
        if (error) {
          setError(error);
        } else {
          window.location.href = login_url;
        }
      });
    } else if (cookies.iosLogin) {
      removeCookie("iosLogin");
      window.location.href = "triratna-order://auth?token=" + cookies.jwt;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  return error ? (
    <ErrorState statusCode={500} />
  ) : isLoggedIn ? (
    <AppLoggedIn source="maitrijala" />
  ) : (
    <></>
  );
}
