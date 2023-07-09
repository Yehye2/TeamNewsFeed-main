const url = window.location.pathname;
const postId = url.split("/posts/")[1];
const like = document.querySelector(".like");
const likeCountElement = document.querySelector(".like-count"); // 좋아요 수를 표시할 요소

import { isLoggedIn } from "./isLoggedIn.js";

$(document).ready(() => {
  // 사용자의 좋아요 상태와 좋아요 수를 가져와서 초기화
  getLikeStatus();
  getLikeCount();
});

async function getLikeStatus() {
  try {
    const data = await isLoggedIn();
    const userId = data.user.id;
    const response = await fetch(`/api/${postId}/like-status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      const userLikesPost = responseData.userLikesPost;

      if (userLikesPost) {
        like.classList.add("liked");
        like.removeEventListener("click", addLike);
        like.addEventListener("click", deleteLike);
      }
    } else {
      console.log("좋아요 상태를 가져올 수 없습니다.");
    }
  } catch (error) {
    console.log(`좋아요 상태 조회에 실패했습니다: ${error}`);
  }
}

async function getLikeCount() {
  try {
    const response = await fetch(`/api/${postId}/like-count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const responseData = await response.json();
      const likeCount = responseData.likeCount;
      displayLikeCount(likeCount);
    } else {
      console.log("좋아요 수를 가져올 수 없습니다.");
    }
  } catch (error) {
    console.log(`좋아요 수 조회에 실패했습니다: ${error}`);
  }
}

async function addLike() {
  const response = await fetch(`/api/${postId}/like`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    alert("좋아요가 추가되었습니다.");
    like.classList.add("liked");
    like.removeEventListener("click", addLike);
    like.addEventListener("click", deleteLike);
    updateLikeCount(); // 좋아요 수 업데이트
  } else {
    const errorMessage = await response.text();
    alert(`좋아요 추가에 실패했습니다: ${errorMessage}`);
  }
}

like.addEventListener("click", addLike);

async function deleteLike() {
  const response = await fetch(`/api/${postId}/unlike`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    alert("좋아요가 삭제되었습니다.");
    like.classList.remove("liked");
    like.removeEventListener("click", deleteLike);
    like.addEventListener("click", addLike);
    updateLikeCount(); // 좋아요 수 업데이트
  } else {
    const errorMessage = await response.text();
    alert(`좋아요 삭제에 실패했습니다: ${errorMessage}`);
  }
}

async function updateLikeCount() {
  const response = await fetch(`/api/${postId}/like-count`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    const data = await response.json();
    const likeCount = data.likeCount;
    likeCountElement.textContent = likeCount.toString(); // 좋아요 수 업데이트
  } else {
    const errorMessage = await response.text();
    console.log(`좋아요 수 조회에 실패했습니다: ${errorMessage}`);
  }
}

function displayLikeCount(likeCount) {
  if (likeCountElement) {
    likeCountElement.textContent = likeCount.toString();
  }
}