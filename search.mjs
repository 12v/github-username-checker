import { graphql } from '@octokit/graphql';
import { config } from 'dotenv'

config();

const graphqlWithAuth = graphql.defaults({
  headers: {
    authorization: `token ${process.env.GITHUB_TOKEN}`,
  },
});

const alphabet1 = 'abcdefghijklmnopqrstuvwxyz0123456789';
const alphabet2 = 'abcdefghijklmnopqrstuvwxyz-0123456789';
const usernames = [];

for (let i = 0; i < alphabet1.length; i++) {
  usernames.push(`${alphabet1[i]}`);
}

for (let i = 0; i < alphabet1.length; i++) {
  for (let j = 0; j < alphabet2.length; j++) {
    for (let k = 0; k < alphabet1.length; k++) {
      usernames.push(`${alphabet1[i]}${alphabet2[j]}${alphabet1[k]}`);
    }
  }
}

console.log(usernames.length);

const sanitise = username => username
  .replace("-", "_")
  .replace("0", "A")
  .replace("1", "B")
  .replace("2", "C")
  .replace("3", "D")
  .replace("4", "E")
  .replace("5", "F")
  .replace("6", "G")
  .replace("7", "H")
  .replace("8", "I")
  .replace("9", "J");

const unsanitise = username => username
  .replace("_", "-")
  .replace("A", "0")
  .replace("B", "1")
  .replace("C", "2")
  .replace("D", "3")
  .replace("E", "4")
  .replace("F", "5")
  .replace("G", "6")
  .replace("H", "7")
  .replace("I", "8")
  .replace("J", "9");

const usernameQuery = usernames => `
  query {
    ${usernames.map((username) => `
      ${sanitise(username)}: user(login: "${username}") {
        name
      }
    `).join('\n')}
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }
`;

const orgQuery = usernames => `
  query {
    ${usernames.map((username) => `
      ${sanitise(username)}: organization(login: "${username}") {
        description
      }
    `).join('\n')}
    rateLimit {
      limit
      cost
      remaining
      resetAt
    }
  }
`;

const candidates = [];
const batchSize = 4000;
let offset = 0;

while (offset < usernames.length) {
  try {
    await graphqlWithAuth(usernameQuery(usernames.slice(offset, offset + batchSize)));
  } catch (error) {
    if (!error.data) {
      console.log("candidates");
      console.dir(candidates, {'maxArrayLength': null});
    }
    console.log(error.data.rateLimit);
    delete error.data.rateLimit;
    const results = Object.keys(error.data)
      .filter(username => error.data[username] === null)
      .map(username => unsanitise(username));
    candidates.push(...results);
  }
  offset += batchSize;
}

console.log(candidates.length);

const filteredCandidates = [];
offset = 0;

while (offset < candidates.length) {
  try {
    await graphqlWithAuth(orgQuery(candidates.slice(offset, offset + batchSize)));
  } catch (error) {
    if (!error.data) {
      console.log("filteredCandidates");
      console.dir(candidates, {'maxArrayLength': null});
    }
    console.log(error.data.rateLimit);
    delete error.data.rateLimit;
    const results = Object.keys(error.data)
      .filter(username => error.data[username] === null)
      .map(username => unsanitise(username));
    filteredCandidates.push(...results);
  }
  offset += batchSize;
}

console.dir(filteredCandidates, {'maxArrayLength': null});
