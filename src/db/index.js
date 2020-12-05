const fs = require('fs');
const neo4j = require('neo4j-driver')
const { makeAugmentedSchema } = require('neo4j-graphql-js');
const config = require('../config')

const typeDefs = fs.readdirSync(__dirname + '/models')
  .filter(i => i !== '_def.gql')
  .map(i => fs.readFileSync(__dirname + '/models/' + i).toString())
  .join('\n');

const schema = makeAugmentedSchema({
  typeDefs,
  config: {
    query: true,
    mutation: true
  }
});

const driver = neo4j.driver('neo4j://localhost', neo4j.auth.basic(config.db.username, config.db.password));

module.exports = { schema, driver };
