Server setup (MongoDB)

1. Create a .env based on .env.example and set MONGO_URI, e.g.

MONGO_URI=mongodb://localhost:27017

2. Install dependencies:

npm install

3. Start server:

npm run dev

The server was migrated from SQLite to MongoDB using Mongoose. Existing APIs remain similar, with dataset search available at /api/datasets?q=term
