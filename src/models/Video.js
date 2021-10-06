import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 80 },
  fileUrl: { type: String, required: true },
  description: { type: String, required: true, trim: true, minlength: 10 },
  createdAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, required: true, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
});

videoSchema.static("formatHashtags", (hashtags) => {
  return hashtags
    .split(",")
    .map((word) => (word.startsWith("#") ? word : `#${word}`));
});

videoSchema.pre("save", function () {
  this.hashtags = this.hashtags[0];
});

const Video = mongoose.model("Video", videoSchema);

export default Video;
