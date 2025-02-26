const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json()); // Built-in body parser
app.use(cors());

let news = [
  { id: 1, title: "First News", content: "This is the first news", likes: 0 },
  { id: 2, title: "Second News", content: "This is the second news", likes: 0 },
  { id: 3, title: "Third News", content: "This is the third news", likes: 0 },
  { id: 4, title: "Fourth News", content: "This is the fourth news", likes: 0 },
  { id: 5, title: "Fifth News", content: "This is the fifth news", likes: 0 },
];

// Get paginated news (for infinite scrolling)
app.get("/news", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  res.json(news.slice(startIndex, endIndex));
});

// Add news (with body-parser)
app.post("/news", (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).json({ message: "Title and content are required" });
  }

  const newArticle = { id: news.length + 1, title, content, likes: 0 };
  news.push(newArticle);
  res.status(201).json(newArticle);
});

// Delete news
app.delete("/news/:id", (req, res) => {
  const id = parseInt(req.params.id);
  news = news.filter((n) => n.id !== id);
  res.json({ message: "News deleted" });
});

// Like a news article
app.post("/news/:id/like", (req, res) => {
  const id = parseInt(req.params.id);
  const article = news.find((n) => n.id === id);
  if (article) {
    article.likes += 1;
    res.json({ likes: article.likes });
  } else {
    res.status(404).json({ message: "News not found" });
  }
});

// Dislike a news article
app.post("/news/:id/dislike", (req, res) => {
  const id = parseInt(req.params.id);
  const article = news.find((n) => n.id === id);
  if (article && article.likes > 0) {
    article.likes -= 1;
    res.json({ likes: article.likes });
  } else {
    res.status(404).json({ message: "News not found or no likes to remove" });
  }
});

// Start server
app.listen(5000, () => console.log("Server running on port 5000"));
