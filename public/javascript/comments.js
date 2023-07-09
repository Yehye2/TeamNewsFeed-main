$(document).ready(() => {
  getAllComments();
});

async function createComment() {
  try {
    const comment = document.getElementById("comment").value;
    // 페이지 url에서 postId 추출
    const url = window.location.pathname;
    const postId = url.split("/posts/")[1];
    if (!comment) {
      alert("alert");
    }

    const data = {
      comment
    };
    console.log(data);
    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    });
    const responseData = await response.json();
    // 전달받은 값에 벨류 값을 얼럿으로 띄움
    alert(Object.values(responseData)[0]);
    // 새로고침
    window.location.reload();
  } catch (error) {
    console.error(error);
  }
}

const saveCommentBtn = document.getElementById("save-comment");
saveCommentBtn.addEventListener("click", createComment);

async function getAllComments() {
  try {
    // 페이지 url에서 postId 추출
    const url = window.location.pathname;
    const postId = url.split("/posts/")[1];

    const response = await fetch(`/api/posts/${postId}/comments`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });
    const responseData = await response.json();
    responseData.data.forEach(item => {
      let comment = item.comment;
      let commentId = item.id;

      let temp_html = `<div class="comment-container">
                          <div class="comment-text">${comment}</div>
                          <div class="comment-actions">
                            <button class="edit-comment" data-comment-id="${commentId}">수정</button>
                            <button class="delete-comment" data-comment-id="${commentId}">삭제</button>
                          </div>
                        </div>`;
      $(".all-comments").append(temp_html);
    });

    // 수정 버튼 클릭 이벤트 처리
    $(".edit-comment").click(editComment);
    // 삭제 버튼 클릭 이벤트 처리
    $(".delete-comment").click(deleteComment);
  } catch (error) {
    console.error(error);
  }
}

async function editComment(event) {
  const commentId = event.target.dataset.commentId;
  const postId = event.target.dataset.postId;
  const editedComment = prompt("댓글을 수정하세요:");

  if (editedComment) {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ comment: editedComment })
      });

      if (response.ok) {
        // 수정 성공 시 처리
        console.log("댓글이 수정되었습니다.");
        alert("댓글이 수정되었습니다.");
        location.reload(); // 페이지 새로고침
      } else {
        // 수정 실패 시 처리
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}

async function deleteComment(event, postId) {
  const commentId = event.target.dataset.commentId;
  const confirmDelete = confirm("정말로 댓글을 삭제하시겠습니까?");

  if (confirmDelete) {
    try {
      const response = await fetch(`/api/posts/${postId}/comments/${commentId}`, {
        method: "DELETE"
      });

      if (response.ok) {
        // 삭제 성공 시 처리
        console.log("댓글이 삭제되었습니다.");
        alert("댓글이 삭제되었습니다.");
        location.reload(); // 페이지 새로고침
      } else {
        // 삭제 실패 시 처리
        const errorData = await response.json();
        console.error(errorData.message);
      }
    } catch (error) {
      console.error(error);
    }
  }
}