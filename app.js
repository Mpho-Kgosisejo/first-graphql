const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const {
  graphqlHTTP
} = require('express-graphql');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolvers');

const {
  authMiddleware
} = require('./middlewares/authMiddleware');

const app = express();
const PORT = 4200;

app.use(bodyParser.json());

app.use(authMiddleware);

app.use('/graphql', graphqlHTTP({
  schema: graphQlSchema,
  rootValue: graphQlResolvers,
  graphiql: true
}));

// mongoose.connect(process.env.MONGO_LOCAL_URL)
mongoose.connect(process.env.MONGO_URL
  .replace('<username>', process.env.MONGO_USERNAME)
  .replace('<password>', process.env.MONGO_PASSWORD)
  .replace('<project>', process.env.MONGO_DB_NAME)
)
  .then(() => {

    console.log('DB Connected');

    app.listen(PORT, () => {

      console.log(`Server running @: http://localhost:${PORT}`);
    });

  })
  .catch(e => {

    console.error('DB Connection error', e);
  });

