const express = require('express');
const bodyParser = require('body-parser');

const {
  graphqlHTTP
} = require('express-graphql');

const {
  buildSchema
} = require('graphql');

const app = express();

app.use(bodyParser.json());

app.use('/graphql', graphqlHTTP({
  schema: buildSchema(`

    type RootQuery {
      events: [String!]!
    }

    type RootMutation {
      createEvent(name: String): String
    }

    schema {
      query: RootQuery
      mutation: RootMutation
    }
  `),
  rootValue: {
    events: () => ([ 'Party today!', 'Some shit' ]),
    createEvent: ({ name }) => (`event name: ${name}`),
  },
  graphiql: true
}));

app.listen(4200, () => {

  console.log('Server running...');
});