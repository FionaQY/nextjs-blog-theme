import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import { GradientBackground } from '../components/Layout';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { getGlobalData } from '../utils/global-data';
import Layout from '../components/Layout';
import { useUser } from '@auth0/nextjs-auth0/client';

const ProtectedPage = ({ globalData }) => {
  const {user} = useUser();
  const router = useRouter();
  const [userInfo, setUserInfo] = useState(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      fetch('/api/saveUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          _id: user.email,
          name: user.name,
        }),
      })
        .then((res) => {
          setLoading(false);
          if (!res.ok) {
            throw new Error('Failed to obtain user data :(');
          }
          return res.json();
        })
        .then((data) => setUserInfo(data))
        .catch((err) => {
          console.error('API Error:', err);
          setError('Failed to load user data :(');
        });
    } else {
      router.push('/');
    }
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <>
      <SEO title={globalData.name} description={globalData.blogTitle} />
      <Header name={globalData.name} auth0={'logout'}/>
      <Layout>
        <main className="w-full p-9">
          <div className="user-card bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center z-10 mx-auto">
            {userInfo ? (
              <>
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome, {userInfo.name}</h1>
                <div className="text-xl text-gray-600 mb-4 text-left">
                  <p><strong>Email:</strong> {userInfo._id}</p>
                  <p><strong>Streak:</strong> {userInfo.streak}</p>
                  <p><strong>Last Practice Date:</strong> {userInfo.lastDay || 'None :('}</p>
                  <p><strong>Total Study Time:</strong> {userInfo.totalStudyTime}</p>
                </div>
              </>
            ) : (
              <p>Loading user data...</p>
            )}
          </div>

          {/* Deck Container with Dynamic Grid Layout */}
          <div
            className={`deck-container mt-10 grid gap-8 ${
              userInfo && userInfo.decks.length === 1
                ? 'grid-cols-1'
                : userInfo && userInfo.decks.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            {userInfo && userInfo.decks && userInfo.decks.length > 0 ? (
              userInfo.decks.map((deck, index) => (
                <div
                  key={index}
                  className="deck bg-white shadow-lg rounded-lg p-6 mb-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">{deck.title}</h2>
                  <div className="text-sm text-gray-600">
                    <p><strong>Description:</strong> {deck.description || ""}</p>
                    <p><strong>Language:</strong> {deck.language || ""}</p>
                    <p><strong>Details:</strong> {deck.details || ""}</p>
                    <p><strong>Last Practiced:</strong> {deck.lastDay || "No record found :("}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No decks available.</p>
            )}
          </div>
        </main>

        <Footer copyrightText={globalData.footerText} />
        <GradientBackground
          variant="large"
          className="fixed top-20 opacity-40 dark:opacity-60"
        />
        <GradientBackground
          variant="small"
          className="absolute bottom-0 opacity-20 dark:opacity-10"
        />
      </Layout>
    </>
  );
};

export function getStaticProps() {
  const globalData = getGlobalData();
  return { props: { globalData } };
}

export default ProtectedPage;
