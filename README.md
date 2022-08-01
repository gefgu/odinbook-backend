# Odin Book - Back End

## Planning

### Authentication

- PassportJS with Facebook Login

### MongoDB Schemas

- User
  - Has an array with the \_id of friends
  - Has an array with the \_id of users requesting friendship
- Posts
  - Content Message
  - Creation Date
  - Author -> User
  - Array with the \_id of users who liked the post
- Comments
  - Content Message
  - Creation Date
  - Author -> User
  - Links to Posts

### RESTful Endpoints

- Users
  - `/users`
    - **GET**: Return list of all users
  - `/users/:userId`
    - **GET**: Return user's data with friends and friend requests data
  - `/users/:userId/friends`
    - **POST**: Add user (in body - userId) as friend of user#userId and vice-versa
    - **DELETE**: Delete user (in body - userId) as friend of user#userId and vice-versa
  - `/users/:userId/friendshipRequests`
    - **GET**: Get all friendship Requests made by :userId
    - **POST**: Add user (in body - userId) as friendshipRequest of user#userId
    - **DELETE**: Delete user (in body - userId) as friendshipRequest of user#userId
