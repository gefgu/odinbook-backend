import { faker } from "@faker-js/faker";

function createRandomUser() {
  return {
    name: `${faker.name.firstName} ${faker.name.lastName}`,
    photoURL: faker.image.avatar(),
  };
}

function createRandomPost(author) {
  return {
    content: faker.lorem.paragraphs(),
    author: author,
  };
}

function createRandomComment(author, post) {
  return {
    content: faker.lorem.paragraph(),
    post: post,
    author: author,
  };
}
