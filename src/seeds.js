import { faker } from "@faker-js/faker";

function createRandomUser() {
  return {
    name: `${faker.name.firstName} ${faker.name.lastName}`,
    photoURL: faker.image.avatar(),
  };
}
