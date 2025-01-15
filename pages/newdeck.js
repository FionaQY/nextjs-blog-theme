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
  const {user} = useUser();
  const router = useRouter();
  const [error, setError] = useState(null);
  const [cards, setCards] = useState([]);
  const [deckName, setDeckName] = useState("");
  const [deckDesc, setDeckDesc] = useState("");

  useEffect(() => {
    if (!user) {
      router.push('/');
    }
  }, [user, router]);

  const handleNewCard = () => {
    setCards([...cards, { word: "", meaning: ""}])
  };

  const handleCardChange = (i, field, val) => {
    const updatedCards = [...cards];
    updatedCards[i].field = val;
    setCards(updatedCards);
  }

  const handleSubmitDeck = () => {
    fetch('/api/newDeck', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: user.email,
        name: deckName,
        description: deckDesc,
        cards: cards
      }),
    })
      .then(router.push('/protected'))
      .catch((err) => {
        console.error('API Error:', err);
        setError('Failed to create new deck :(');
      });
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
            New Deck:
            <div className="mt-4">
              <label>Name:</label>
              <input 
              name='name'
              className="border p-2 w-full" 
              value={deckName}
              onChange={(e) => setDeckName(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label>Description:</label>
              <input 
              name='description'
              className="border p-2 w-full" 
              value={deckDesc}
              onChange={(e) => setDeckDesc(e.target.value)}
              />
            </div>
            <button 
            className="mt-4 bg-blue-500 text-white p-2 rounded" 
            onClick={handleSubmitDeck}>
              Add this Deck</button>
          </div>

          {/* Deck Container with Dynamic Grid Layout */}
          <div
            className={`deck-container mt-10 grid gap-8`}
          >
            
            {cards.length > 0 ? (
              cards.map((card, index) => (
                <div
                  key={index}
                  className="deck bg-white shadow-lg rounded-lg p-6 mb-8"
                >
                  <div className="text-sm text-gray-600">
                    <p><strong>Word:
                      <input 
                      value={card.word}
                      onChange={(e) => handleCardChange(index, 'word', e.target.value)}/>
                      </strong></p>
                    <p><strong>Meaning:
                      <input 
                      value={card.meaning}
                      onChange={(e) => handleCardChange(index, 'meaning', e.target.value)}/>
                      </strong> {card.meaning || ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No cards chosen.</p>
            )}
            <button onClick={handleNewCard}>
              Add New Card
            </button>
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

export default NewDeck;
