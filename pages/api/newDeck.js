const { MongoClient, ServerApiVersion } = await import('mongodb');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({message: 'Only POST requests allowed'});
    }

    const {userId, name, description, cards} = req.body;
    const uri = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}@deutsch.kogbn.mongodb.net/?retryWrites=true&w=majority&appName=deutsch`;

    const client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        },
      });
      try {
        // Connect to MongoDB and fetch some data
        await client.connect();
        const db = client.db('knowt');
        const deckCollection = db.collection('decks');
        const cardCollection = db.collection('cards');

        const deckId = await deckCollection.insertOne({userId, name, description, number: cards.length});
        await cardCollection.insertMany(cards.map(x => ({...x, deckId})))
        res.status(200).json();
    } catch (err) {
        console.error('MongoDB error:', err);
        res.status(500).json({ error: 'Failed to insert user' });
    } finally {
        await client.close();
    }
}