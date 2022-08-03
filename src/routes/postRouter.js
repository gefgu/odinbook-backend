const express = require("express");
const passport = require("passport");
const { body, validationResult } = require("express-validator");
const { removeObjectDuplicatesOfArray } = require("../helpers");

function handleUserIsAuthorOfPost(req, res, next) {
  req.context.models.Post.findById(req.params.postId).exec((err, post) => {
    if (err) return next(err);

    if (post === null) {
      const err = new Error("Post not found!");
      err.status = 404;
      return next(err);
    }

    if (post.author.toString() !== req.user._id.toString()) {
      const err = new Error("Unauthorized");
      err.status = 401;
      return next(err);
    }

    next();
  });
}

function handleUserIsAuthorOfComment(req, res, next) {
  req.context.models.Comment.findById(req.params.commentId).exec(
    (err, comment) => {
      if (err) return next(err);

      if (comment === null) {
        const err = new Error("Comment not found!");
        err.status = 404;
        return next(err);
      }

      if (comment.author.toString() !== req.user._id.toString()) {
        const err = new Error("Unauthorized");
        err.status = 401;
        return next(err);
      }

      next();
    }
  );
}

const postRouter = express.Router();

postRouter.use(passport.authenticate("facebook-token", { session: false }));

postRouter.get("/", (req, res, next) => {
  const friends = req.user.friends;

  req.context.models.Post.find({ author: friends.concat(req.user._id) }).exec(
    (err, postList) => {
      if (err) return next(err);

      res.json(postList);
    }
  );
});

postRouter.post("/", [
  body("content", "Post Content must be specified").trim().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const post = new req.context.models.Post({
      content: req.body.content,
      author: req.user._id,
    });

    post.save(function (err) {
      if (err) return next(err);

      res.json({ message: "POST CREATED WITH SUCESS!", post });
    });
  },
]);

postRouter.get("/:postId", (req, res, next) => {
  req.context.models.Post.findById(req.params.postId).exec((err, post) => {
    if (err) return next(err);
    if (post === null) {
      const err = new Error("Post not found!");
      err.status = 404;
      return next(err);
    }
    res.json(post);
  });
});

postRouter.put("/:postId", [
  body("content", "Post Content must be specified").trim().isLength({ min: 1 }),
  handleUserIsAuthorOfPost,
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const post = new req.context.models.Post({
      content: req.body.content,
      author: req.user._id,
      _id: req.params.postId,
    });

    req.context.models.Post.findByIdAndUpdate(
      req.params.postId,
      post,
      {},
      function (err) {
        if (err) return next(err);

        if (post === null) {
          const err = new Error("Post not found");
          err.status = 404;
          return next(err);
        }

        res.json({ message: "POST UPDATED WITH SUCESS!", post });
      }
    );
  },
]);

postRouter.delete("/:postId", handleUserIsAuthorOfPost, (req, res, next) => {
  req.context.models.Post.findByIdAndRemove(req.params.postId, function (err) {
    if (err) return next(err);

    res.json({ message: "POST DELETED WITH SUCCESS!" });
  });
});

postRouter.get("/:postId/comments", (req, res, next) => {
  req.context.models.Comment.find({ post: req.params.postId }).exec(
    (err, commentList) => {
      if (err) return next(err);

      res.json(commentList);
    }
  );
});

postRouter.post("/:postId/comments", [
  body("content", "Comment Content must be specified")
    .trim()
    .isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const comment = new req.context.models.Comment({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postId,
    });

    comment.save(function (err) {
      if (err) return next(err);

      res.json({ message: "Comment CREATED WITH SUCESS!", comment });
    });
  },
]);

postRouter.put("/:postId/comments/:commentId", [
  body("content", "Comment Content must be specified")
    .trim()
    .isLength({ min: 1 }),
  handleUserIsAuthorOfComment,
  (req, res, next) => {
    const errors = validationResult(req);
    if (errors.array().length > 0) {
      res.json(errors);
      return;
    }

    const comment = new req.context.models.Post({
      content: req.body.content,
      author: req.user._id,
      post: req.params.postId,
      _id: req.params.commentId,
    });

    req.context.models.Comment.findByIdAndUpdate(
      req.params.commentId,
      comment,
      {},
      function (err) {
        if (err) return next(err);

        res.json({ message: "COMMENT UPDATED WITH SUCCESS!", comment });
      }
    );
  },
]);

postRouter.delete(
  "/:postId/comments/:commentId",
  handleUserIsAuthorOfComment,
  (req, res, next) => {
    req.context.models.Comment.findByIdAndRemove(
      req.params.commentId,
      function (err) {
        if (err) return next(err);

        res.json({ message: "COMMENT DELETED WITH SUCCESS!" });
      }
    );
  }
);

postRouter.put("/:postId/like", (req, res, next) => {
  req.context.models.Post.findById(req.params.postId).exec((err, post) => {
    if (err) return next(err);
    if (post === null) {
      const err = new Error("Post not found!");
      err.status = 404;
      return next(err);
    }

    let likes = post.likes;

    const index = likes.indexOf(req.user._id.toString());
    if (index > -1) {
      likes.splice(index, 1);
    } else {
      likes = post.likes.concat(req.user._id);
    }

    likes = removeObjectDuplicatesOfArray(likes);

    const postWithLike = new req.context.models.Post({
      content: post.content,
      author: post.author,
      _id: post._id,
      creationDate: post.creationDate,
      likes: likes,
    });

    req.context.models.Post.findByIdAndUpdate(
      req.params.postId,
      postWithLike,
      {},
      function (err) {
        if (err) return next(err);

        res.json({ message: "POST UPDATED WITH SUCCESS!", postWithLike });
      }
    );
  });
});

module.exports = postRouter;
