#! /usr/bin/env node

const faker = require("@faker-js/faker").faker;
const async = require("async");

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

let users = [];
let posts = [];
let comments = [];

function createRandomUser(callback) {
  const user = new User({
    name: `${faker.name.firstName()} ${faker.name.lastName()}`,
    photoURL: faker.image.avatar(),
  });
  user.save(function (err) {
    if (err) {
      callback(err);
      return;
    }
    console.log(`New User: ${user}`);
    users.push(user);
    callback(null, user);
  });
}

function createRandomPost(i, callback) {
  const post = new Post({
    content: faker.lorem.paragraphs(),
    author: users[Math.floor(i / 2)],
  });
  post.save(function (err) {
    if (err) {
      callback(err);
      return;
    }
    console.log(`New post: ${post}`);
    posts.push(post);
    callback(null, post);
  });
}

function createRandomComment(i, callback) {
  const comment = new Comment({
    content: faker.lorem.paragraph(),
    author: users[Math.floor(i / 3)],
    post: posts[Math.floor(i / 3)],
  });
  comment.save(function (err) {
    if (err) {
      callback(err);
      return;
    }
    console.log(`New comment: ${comment}`);
    comments.push(comment);
    callback(null, comment);
  });
}

// function createFriendsAndRequests(user, index, callback) {
//   let newUser = user;
//   let possibleFriends = users.splice(index, 1);
//   newUser.friends = possibleFriends.slice(0, index);
//   newUser.friendshipRequests = possibleFriends.slice(index);
//   User.findByIdAndUpdate(user._id, newUser, {}, function (err) {
//     if (err) {
//       callback(err);
//       return;
//     }

//     console.log(`Added friends and friendship requests for user ${newUser}`);
//   });
// }

async.series(
  [
    (callback) =>
      async.each(
        [...Array(5).keys()],
        (index, cb) => createRandomUser(cb),
        callback
      ),
    (callback) =>
      async.each(
        [...Array(10).keys()],
        (index, cb) => createRandomPost(index, cb),
        callback
      ),
    (callback) =>
      async.each(
        [...Array(15).keys()],
        (index, cb) => createRandomComment(index, cb),
        callback
      ),
    // (callback) =>
    //   async.forEachOf(
    //     users,
    //     (user, index, cb) => {
    //       createFriendsAndRequests(user, index, cb);
    //     },
    //     callback
    //   ),
  ],
  function (err, results) {
    if (err) console.log(`Final Error: ${err}`);

    mongoose.connection.close();
  }
);
