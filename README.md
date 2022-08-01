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
    - **GET**: Return user's data
