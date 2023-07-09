const express = require("express");
const router = express.Router();
const { Comments } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

router.post(`/posts/:postId/comments`, authMiddleware, async (req, res) => {
  const PostId = req.params.postId;
  const UserId = res.locals.user.dataValues.userId;
  try {
    const { comment } = req.body;

    if (!comment) {
      return res.status(404).json({ errorMessage: "댓글을 입력해주세요." });
    }
    await Comments.create({
      UserId,
      PostId,
      comment
    });
    res.status(200).json({ message: "댓글이 작성되었습니다." });
  } catch (error) {
    console.error(`Error: ${error.message}`);

    return res.status(400).json({
      message: "댓글 작성에 실패했습니다."
    });
  }
});

router.get("/posts/:postId/comments", async (req, res) => {
  const PostId = req.params.postId;

  const result = await Comments.findAll({
    where: { PostId },
    order: [["createdAt", "desc"]]
  });
  res.status(200).json({ data: result });
});

router.put("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const UserId = res.locals.user.dataValues.userId;
  const { comment } = req.body;

  try {
    const existingComment = await Comments.findOne({
      where: {
        id: commentId,
        UserId
      }
    });

    if (!existingComment) {
      return res.status(404).json({ errorMessage: "수정할 댓글을 찾을 수 없습니다." });
    }

    await existingComment.update({ comment });

    res.status(200).json({ message: "댓글이 수정되었습니다." });
  } catch (error) {
    console.error(`Error: ${error.message}`);

    return res.status(400).json({
      message: "댓글 수정에 실패했습니다."
    });
  }
});

router.delete("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const UserId = res.locals.user.dataValues.userId;

  try {
    const existingComment = await Comments.findOne({
      where: {
        id: commentId,
        UserId
      }
    });

    if (!existingComment) {
      return res.status(404).json({ errorMessage: "삭제할 댓글을 찾을 수 없습니다." });
    }

    await existingComment.destroy();

    res.status(200).json({ message: "댓글이 삭제되었습니다." });
  } catch (error) {
    console.error(`Error: ${error.message}`);

    return res.status(400).json({
      message: "댓글 삭제에 실패했습니다."
    });
  }
});

module.exports = router;
