const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const videoComments = document.querySelector(".video__comments ul");
const commentDeleteBtn = document.querySelectorAll(".comment__delete");

const handleCommentDelete = async (event) => {
  event.preventDefault();
  const comment = event.target.parentNode;
  const { id } = comment.dataset;
  await fetch(`/api/comments/${id}`, {
    method: "DELETE",
  });
  videoComments.removeChild(comment);
};

const addComment = (text, id) => {
  const newComment = document.createElement("li");
  const div = document.createElement("div");
  const icon = document.createElement("i");
  const span = document.createElement("span");
  const span2 = document.createElement("span");
  newComment.className = "video__comment";
  newComment.dataset.id = id;
  div.className = "comment__column";
  icon.className = "fas fa-comment";
  span.innerText = `${text}`;
  span2.innerText = "❌";
  span.className = "comment__text";
  span2.className = "comment__delete";
  span2.addEventListener("click", handleCommentDelete);
  div.appendChild(icon);
  div.appendChild(span);
  newComment.appendChild(div);
  newComment.appendChild(span2);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector("textarea");
  const text = textarea.value.trim();
  const videoId = videoContainer.dataset.id;
  if (text === "") return;
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};

if (form) {
  form.addEventListener("submit", handleSubmit);
}

commentDeleteBtn.forEach((e) =>
  e.addEventListener("click", handleCommentDelete)
);
