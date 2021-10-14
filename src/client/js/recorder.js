const startBtn = document.getElementById("startBtn");

const handleStartBtn = async () => {
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
  });
};

startBtn.addEventListener("click", handleStartBtn);
