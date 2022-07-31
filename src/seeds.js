#! /usr/bin/env node

import { faker } from "@faker-js/faker";

console.log(
  "This script populates some test users, posts, comments to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true"
);

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

if (!userArgs[0].startsWith("mongodb")) {
  console.log(
    "ERROR: You need to specify a valid mongodb URL as the first argument"
  );
  return;
}

const User = require("./models/User");
const Post = require("./models/Post");
const Comment = require("./models/Comment");

const mongoose = require("mongoose");
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

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

function populateDatabase() {
  let users = [];
  let posts = [];
  let comments = [];

  for (let i = 0; i < 5; i++) {
    const user = new User(createRandomUser());
    user.save(function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`New User: ${user}`);
      users.push(user);
    });
  }

  for (let i = 0; i < 10; i++) {
    const post = new Post(createRandomPost(users[Math.floor(i / 2)]));
    post.save(function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`New post: ${post}`);
      posts.push(post);
    });
  }

  for (let i = 0; i < 15; i++) {
    const comment = new Comment(
      createRandomComment(
        users[Math.floor(i / 3)],
        posts[users[Math.floor(i / 3)]]
      )
    );
    comment.save(function (err) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(`New comment: ${comment}`);
      comments.push(comment);
    });
  }
}

populateDatabase();
