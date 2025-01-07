const { MongoClient, ServerApiVersion } = await import('mongodb');

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).send({message: 'Only POST requests allowed'});
    }

    const {_id, email, name} = req.body;
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
        const collection = db.collection('users');
        let decks = [];

        var existingUser = await collection.findOne({_id});
        if (!existingUser) {
            await collection.insertOne({_id, name, streak: 0, lastDay: null, totalStudyTime: 0});
            existingUser = await collection.findOne({_id});
        } else {
            const decksCollection = db.collection('decks');
            decks = await decksCollection.find({userId: _id}).toArray();
        }
        res.status(200).json({... existingUser, decks: decks});
    } catch (err) {
        console.error('MongoDB error:', err);
        res.status(500).json({ error: 'Failed to insert user' });
    } finally {
        await client.close();
    }
}