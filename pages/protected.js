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
  const { user } = useUser();
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
  }, [user, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="loader text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        <p className="text-lg">{error}</p>
      </div>
    );
  }

  return (
    <>
      <SEO name={globalData.name} description={globalData.blogname} />
      <Header name={globalData.name} auth0="logout" />
      <Layout>
        <main className="w-full p-10">
          {/* User Info Card */}
          <div className="user-card bg-white shadow-lg rounded-xl p-8 max-w-lg w-full mx-auto mb-12">
            {userInfo ? (
              <>
                <h1 className="text-3xl font-bold text-gray-800 mb-4">
                  Welcome, {userInfo.name}
                </h1>
                <div className="text-lg text-gray-600">
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

          {/* Deck Container */}
          <div
            className={`deck-container grid gap-8 mb-12 ${
              userInfo?.decks?.length === 1
                ? 'grid-cols-1'
                : userInfo?.decks?.length === 2
                ? 'grid-cols-2'
                : 'grid-cols-3'
            }`}
          >
            <button
              onClick={() => router.push('/newdeck')}
              className="bg-blue-500 text-white py-3 px-6 rounded-lg shadow-lg hover:bg-blue-600 transition duration-300"
            >
              Add New Deck
            </button>
            {userInfo && userInfo.decks && userInfo.decks.length > 0 ? (
              userInfo.decks.map((deck, index) => (
                <div
                  key={index}
                  className="deck bg-white shadow-lg rounded-lg p-6 mb-8"
                >
                  <h2 className="text-2xl font-semibold text-gray-800 mb-4">{deck.name}</h2>
                  <div className="text-sm text-gray-600">
                    <p><strong>Description:</strong> {deck.description || "No description available"}</p>
                    <p><strong>Language:</strong> {deck.language || "Not specified"}</p>
                    <p><strong>Number of cards:</strong> {deck.number || "N/A"}</p>
                    <p><strong>Details:</strong> {deck.details || "No details available"}</p>
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
