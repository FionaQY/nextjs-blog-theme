import { useEffect } from 'react';
import { useRouter } from 'next/router';
import netlifyIdentity from 'netlify-identity-widget';

const ProtectedPage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if the user is not logged in
    if (!netlifyIdentity.currentUser()) {
      router.push('/');
    }
  }, [router]);

  return (
    <div className="protected-container">
      <h1>Protected Page</h1>
      <p>You can see this content because you are logged in.</p>
    </div>
  );
};

export default ProtectedPage;
