import { useEffect, useState } from 'react';
import '../styles/globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import netlifyIdentity from "netlify-identity-widget";
import { Router } from 'next/router';

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  useEffect(() => {
    netlifyIdentity.init();

    netlifyIdentity.on("login", (user) => {
      setUser(user);
      Router.push('/protected');
    });

    netlifyIdentity.on("logout", () => {
      setUser(null);
    });

    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
    }

  })
  return (
    <>
      <span className="theme-bejamas" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
