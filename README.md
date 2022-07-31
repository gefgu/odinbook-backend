# Odin Book - Back End

## Planning

### Authentication

- PassportJS with Facebook Login
- JSON Web Tokens

### MongoDB Schemas

- User
  - Has an array with the \_id of friends.
  - Has an array with the \_id of users requesting friendship.
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
- Friend Requests
  - Fields
    - `from`: Who started the request
    - `to`: To who is the request
    - When it is accepted or rejected it is deleted
