import { useEffect, useState } from 'react';
import '../styles/globals.css';
import 'prismjs/themes/prism-tomorrow.css';
import { useRouter } from 'next/router';  // Ensure you use useRouter for client-side navigation
import { UserProvider } from '@auth0/nextjs-auth0/client';

function MyApp({ Component, pageProps }) {
  return (
    <>
    <UserProvider>
      <span className="theme-bejamas" />
      <Component {...pageProps} />
    </UserProvider>
      {/* <span className="theme-bejamas" />
      <Component {...pageProps} /> */}
    </>
  );
}

export default MyApp;
