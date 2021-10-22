const videoContainer = document.getElementById("videoContainer");
const form = document.getElementById("commentForm");
const textarea = form.querySelector("textarea");
const button = form.querySelector("button");

const handleSubmit = (event) => {
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
};

form.addEventListener("sumbmit", handleSubmit);
