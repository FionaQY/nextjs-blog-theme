import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Footer from '../components/Footer';
import { GradientBackground } from '../components/Layout';
import Header from '../components/Header';
import SEO from '../components/SEO';
import { getGlobalData } from '../utils/global-data';
import Layout from '../components/Layout';
import { useUser } from '@auth0/nextjs-auth0/client';

const NewDeck = ({ globalData }) => {
  const { user } = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [deckName, setDeckName] = useState('');
  const [deckDesc, setDeckDesc] = useState('');

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleNewCard = () => {
    setCards([...cards, { word: '', meaning: '' }]);
  };

  const handleCardChange = (index, field, value) => {
    const updatedCards = [...cards];
    updatedCards[index][field] = value;
    setCards(updatedCards);
  };

  const handleSubmitDeck = async () => {
    try {
      const response = await fetch('/api/newDeck', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.email,
          name: deckName,
          description: deckDesc,
          cards,
        }),
      });
      if (response.ok) {
        router.push('/protected');
      } else {
        throw new Error('Failed to create new deck');
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to create new deck :(');
    }
  };

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
      <Header name={globalData.name} auth0="logout" />
      <Layout>
        <main className="w-full p-9">
          <div className="user-card bg-white shadow-lg rounded-lg p-8 max-w-lg w-full text-center z-10 mx-auto">
            <h2 className="text-xl font-semibold">New Deck</h2>
            <div className="mt-4">
              <label className="block">Name:</label>
              <input
                name="name"
                className="border p-2 w-full mt-2"
                value={deckName}
                onChange={(e) => setDeckName(e.target.value)}
                placeholder="Enter deck name"
              />
            </div>
            <div className="mt-4">
              <label className="block">Description:</label>
              <input
                name="description"
                className="border p-2 w-full mt-2"
                value={deckDesc}
                onChange={(e) => setDeckDesc(e.target.value)}
                placeholder="Enter deck description"
              />
            </div>
            <button
              className="mt-4 bg-blue-500 text-white p-2 rounded w-full"
              onClick={handleSubmitDeck}
            >
              Add this Deck
            </button>
          </div>

          <div className="deck-container mt-10 grid gap-8">
            {cards.length > 0 ? (
              cards.map((card, index) => (
                <div
                  key={index}
                  className="deck bg-white shadow-lg rounded-lg p-6 mb-8"
                >
                  <div className="text-sm text-gray-600">
                    <div>
                      <strong>Word:</strong>
                      <input
                        value={card.word}
                        onChange={(e) =>
                          handleCardChange(index, 'word', e.target.value)
                        }
                        className="border p-2 w-full mt-1"
                        placeholder="Enter word"
                      />
                    </div>
                    <div className="mt-2">
                      <strong>Meaning:</strong>
                      <input
                        value={card.meaning}
                        onChange={(e) =>
                          handleCardChange(index, 'meaning', e.target.value)
                        }
                        className="border p-2 w-full mt-1"
                        placeholder="Enter meaning"
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p>No cards added yet. Click &quot;Add New Card&quot; to get started.</p>
            )}
            <button
              className="mt-4 bg-green-500 text-white p-2 rounded w-full"
              onClick={handleNewCard}
            >
              Add New Card
            </button>
          </div>
        </main>

        <Footer copyrightText={globalData.footerText} />
        <GradientBackground variant="large" className="fixed top-20 opacity-40 dark:opacity-60" />
        <GradientBackground variant="small" className="absolute bottom-0 opacity-20 dark:opacity-10" />
      </Layout>
    </>
  );
};

export function getStaticProps() {
  const globalData = getGlobalData();
  return { props: { globalData } };
}

export default NewDeck;
