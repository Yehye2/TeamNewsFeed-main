const express = require("express");
const router = express.Router();
const { Posts, Likes, Users } = require("../models");
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


// 사용자의 좋아요한 게시물 목록 조회
router.get("/my-likes", authMiddleware, async (req, res) => {
  try {
    const { userId } = res.locals.user;

    // 좋아요한 게시물의 postId 목록 조회
    const likes = await Likes.findAll({
      where: { userId },
      attributes: ["postId"],
    });

    const postId = likes.map((like) => like.postId);

    // postId 목록을 사용하여 해당 게시물들을 조회
    // Posts 모델과 직접적인 연관 관계 설정 없이 조회합니다.
    const posts = await Posts.findAll({
      where: { postId: postId },
    });

    res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ errorMessage: "서버 오류" });
  }
});

module.exports = router;