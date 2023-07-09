const express = require("express");
const router = express.Router();
const { Posts, Likes } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

// 좋아요 추가하기
router.post("/:postId/like", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({
    where: { postId }
  });

  if (!post) {
    return res.status(404).json({ errorMessage: "게시물을 찾을 수 없습니다." });
  }

  await Likes.create({
    PostId: postId,
    UserId: userId
  });

  return res.status(200).json({ message: "좋아요가 추가되었습니다." });
});

// 좋아요 취소하기
router.delete("/:postId/unlike", authMiddleware, async (req, res) => {
  const { postId } = req.params;
  const { userId } = res.locals.user;

  const post = await Posts.findOne({
    where: { postId }
  });

  if (!post) {
    return res.status(404).json({ errorMessage: "게시물을 찾을 수 없습니다." });
  }

  await Likes.destroy({
    where: {
      PostId: postId,
      UserId: userId
    }
  });
  return res.status(200).json({ message: "좋아요가 취소되었습니다." });
});

// 좋아요 조회
router.get("/likes/:postId", async (req, res) => {
  try {
    const postId = req.params.postId;

    const likesCount = await Likes.count({
      where: { PostId: postId }
    });
    res.status(200).json({ count: likesCount });
  } catch (error) {
    res.status(400).json({ errorMessage: "좋아요 수 조회에 실패했습니다." });
  }
});

// 좋아요 상태 조회
router.get("/:postId/like-status", authMiddleware, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = res.locals.user;

    const existingLike = await Likes.findOne({
      where: {
        PostId: postId,
        UserId: userId,
      },
    });

    const userLikesPost = existingLike ? true : false;

    res.status(200).json({ userLikesPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "서버 오류" });
  }
});

// 좋아요 수 조회
router.get("/:postId/like-count", async (req, res) => {
  try {
    const { postId } = req.params;

    const likeCount = await Likes.count({
      where: {
        PostId: postId,
      },
    });

    res.status(200).json({ likeCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "서버 오류" });
  }
});

module.exports = router;