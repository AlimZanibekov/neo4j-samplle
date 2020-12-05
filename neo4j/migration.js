const { graphql } = require('graphql');
const { schema, driver } = require('../src/db');

const queryCheck = `
  query {
    user: User(id:"76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5") {
      id
    }
  }
`;

const query = `
  mutation {
    u1: CreateUser(id: "76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5", role: CREATOR, name: "Bob") { name }
    u2: CreateUser(id: "6659fb2d-4141-4dd0-b835-f617c961b863", role: CREATOR, name: "Alice") { name }
    u3: CreateUser(id: "6dd336fc-c8d4-4b35-b186-acf851853b95", role: USER, name: "John") { name }
    
    c1: CreateComponent(id: "e92a351a-b75d-4591-bd03-818bfa0224d6", content: "<h1>Hello world</h1>") { id }
    c2: CreateComponent(id: "dc4b4c6e-5268-4600-8921-57324e5c9c13", content: "<p>Sample text</p>") { id }
    c3: CreateComponent(id: "639aefbb-d561-45ca-9228-d650910ad670", content: "<p>Lorem ipsum</p>") { id }
    
    p0: CreatePage(id: "60a7972e-03eb-4019-81bb-3370540234de", title: "Bad Page") { id }
    p1: CreatePage(id: "2ca8d043-0cd2-4a3e-bc31-c59e13fb3b5a", title: "Test Page") { id }
    p2: CreatePage(id: "80a0eb50-1721-4e01-8dc4-6d69ba735e25", title: "Second Test Page") { id }
    
    r1: AddPageComponents(from: { id: "2ca8d043-0cd2-4a3e-bc31-c59e13fb3b5a" }, to: { id: "e92a351a-b75d-4591-bd03-818bfa0224d6" }, data: { index: 1 }) { index }
    r2: AddPageComponents(from: { id: "2ca8d043-0cd2-4a3e-bc31-c59e13fb3b5a" }, to: { id: "dc4b4c6e-5268-4600-8921-57324e5c9c13" }, data: { index: 2 }) { index }
    r3: AddPageComponents(from: { id: "2ca8d043-0cd2-4a3e-bc31-c59e13fb3b5a" }, to: { id: "639aefbb-d561-45ca-9228-d650910ad670" }, data: { index: 3 }) { index }
    
    r4: AddPageComponents(from: { id: "80a0eb50-1721-4e01-8dc4-6d69ba735e25" }, to: { id: "e92a351a-b75d-4591-bd03-818bfa0224d6" }, data: { index: 1 }) { index }
    r5: AddPageComponents(from: { id: "80a0eb50-1721-4e01-8dc4-6d69ba735e25" }, to: { id: "639aefbb-d561-45ca-9228-d650910ad670" }, data: { index: 2 }) { index }
    
    rx: AddPagePages(from: { id: "60a7972e-03eb-4019-81bb-3370540234de" }, to: { id: "2ca8d043-0cd2-4a3e-bc31-c59e13fb3b5a" }, data: { index: 1 }) { index }
    ry: AddPagePages(from: { id: "60a7972e-03eb-4019-81bb-3370540234de" }, to: { id: "80a0eb50-1721-4e01-8dc4-6d69ba735e25" }, data: { index: 2 }) { index }
    
    r6: AddUserPages(from: { id: "76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5"}, to: { id: "60a7972e-03eb-4019-81bb-3370540234de" }) { to { id } }
    y6: AddUserPages(from: { id: "76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5"}, to: { id: "2ca8d043-0cd2-4a3e-bc31-c59e13fb3b5a" }) { to { id } }
    r7: AddUserPages(from: { id: "6659fb2d-4141-4dd0-b835-f617c961b863" }, to: { id: "80a0eb50-1721-4e01-8dc4-6d69ba735e25" }) { to { id } }
    
    r8: AddUserComponents(from: { id: "76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5"}, to: { id: "e92a351a-b75d-4591-bd03-818bfa0224d6" }) { to { id } }
    r9: AddUserComponents(from: { id: "76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5"}, to: { id: "dc4b4c6e-5268-4600-8921-57324e5c9c13" }) { to { id } }
    b1: AddUserComponents(from: { id: "76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5"}, to: { id: "639aefbb-d561-45ca-9228-d650910ad670" }) { to { id } }
    
    b2: AddUserComponents(from: { id: "6659fb2d-4141-4dd0-b835-f617c961b863"}, to: { id: "e92a351a-b75d-4591-bd03-818bfa0224d6" }) { to { id } }
    b3: AddUserComponents(from: { id: "6659fb2d-4141-4dd0-b835-f617c961b863"}, to: { id: "639aefbb-d561-45ca-9228-d650910ad670" }) { to { id } }
    
    a1: CreateRecipe(id: "ad2d1997-58f6-44c2-bfb6-edffe222a404", title: "Bob recipe") { id }
    a2: AddUserRecipes(from: { id: "76b426de-7e7a-45fc-a2f5-f5f2b8d7a9b5"}, to: { id: "ad2d1997-58f6-44c2-bfb6-edffe222a404" }) { to { id } }
    a3: AddRecipePages(from: { id: "ad2d1997-58f6-44c2-bfb6-edffe222a404"}, to: { id: "60a7972e-03eb-4019-81bb-3370540234de" }) { to { id } }
    a4: AddRecipePages(from: { id: "ad2d1997-58f6-44c2-bfb6-edffe222a404"}, to: { id: "2ca8d043-0cd2-4a3e-bc31-c59e13fb3b5a" }) { to { id } }
  }
`;

function clear() {
  process.stdout.clearLine();
  process.stdout.cursorTo(0);
}

let i = 0;
setInterval(() => {
  clear();
  i = (i + 1) % 4;
  process.stdout.write(`Waiting neo4j${new Array(i + 1).join('.')}`);
}, 700);
graphql(schema, queryCheck, null, { driver })
  .then((result) => {
    if (!result.data || !result.data.user || result.data.user.length === 0) {
      return graphql(schema, query, null, { driver })
    } else {
      clear();
      console.log('Data already exist');
      process.exit(0);
    }
  })
  .then(() => {
    clear();
    console.log('Success');
    process.exit(0);
  })
  .catch(err => {
    clear();
    console.error(err);
    process.exit(1);
  });
