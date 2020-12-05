const express = require('express');
const { execute, parse } = require('graphql');
const { schema, driver } = require('../db');
const router = express.Router();

const generateRecursiveQuery = (depth = 0) => {
  if (depth <= 0) {
    return '';
  }
  return `
    pages {
      to(orderBy: index_asc) {
        index
        Page {
          ...PageFragment
          ${generateRecursiveQuery(depth - 1)}
        }
      }
    }
  `;
}

const query = `
fragment PageFragment on Page {
  title
  id
  components(orderBy: index_asc) {
    index
    Component {
        content
    }
  }
}

fragment PageRecursive on Page {
  ${generateRecursiveQuery(10)}
}
query($id: ID!) {
  Page(id: $id) {
    ...PageFragment
    ...PageRecursive
  }
}
`

const compiledQuery = parse(query);

router.get('/page/:id', (req, res) => {
  const { id } = req.params;
  execute(schema, compiledQuery, null, { driver }, { id })
    .then((result) => {
      res.json(result);
    })
    .catch(err => {
      res.status(500).json(err);
    });
});


module.exports = router;
