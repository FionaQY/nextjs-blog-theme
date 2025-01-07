import { useEffect, useState } from 'react';
import '../styles/globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import netlifyIdentity from "netlify-identity-widget";
import { useRouter } from 'next/router';  // Ensure you use useRouter for client-side navigation

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState(null);
  const router = useRouter(); // Use next/router for client-side routing

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init();

    const currentUser = netlifyIdentity.currentUser();
    if (currentUser) {
      setUser(currentUser);
    }

    netlifyIdentity.on("login", (user) => {
      setUser(user);
      router.push('/protected');
    });

    netlifyIdentity.on("logout", () => {
      setUser(null);
      router.push('/');  
    });

    return () => {
      netlifyIdentity.off("login");
      netlifyIdentity.off("logout");
    };
  }, [router]);

  return (
    <>
      <span className="theme-bejamas" />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
