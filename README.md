# Odin Book - Back End

## Planning

### Authentication

- PassportJS with Facebook Login
- JSON Web Tokens

### MongoDB Schemas

- User
  - Has an array with the \_id of friends
- Posts
  - Content Message
  - Creation Date
  - Author -> User
  - Array with the \_id of users who liked the post
- Comments
  - Links to Posts
- Friend Requests
  - Fields
    - `from`: Who started the request
    - `to`: To who is the request
    - When it is accepted or rejected it is deleted
