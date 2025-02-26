const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const VALID_TAGS = ["Sports", "Headlines", "Entertainment"];

let news = [
  {
    id: 1,
    title: "First News",
    content: "This is the first news",
    likes: 0,
    tag: "Headlines",
  },
  {
    id: 2,
    title: "Second News",
    content: "This is the second news",
    likes: 0,
    tag: "Sports",
  },
  {
    id: 3,
    title: "Third News",
    content: "This is the third news",
    likes: 0,
    tag: "Entertainment",
  },
  {
    id: 4,
    title: "Fourth News",
    content: "This is the fourth news",
    likes: 0,
    tag: "Headlines",
  },
  {
    id: 5,
    title: "Fifth News",
    content: "This is the fifth news",
    likes: 0,
    tag: "Sports",
  },
];

app.get("/news", (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 3;
  const category = req.query.category;

  let filteredNews = news;
  if (category && VALID_TAGS.includes(category)) {
    filteredNews = news.filter((n) => n.tag === category);
  }

  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  res.json(filteredNews.slice(startIndex, endIndex));
});

app.post("/news", (req, res) => {
  const { title, content, tag } = req.body;

  if (!title || !content || !tag) {
    return res
      .status(400)
      .json({ message: "Title, content, and tag are required" });
  }

  if (!VALID_TAGS.includes(tag)) {
    return res
      .status(400)
      .json({ message: `Invalid tag. Valid tags: ${VALID_TAGS.join(", ")}` });
  }

  const newArticle = { id: news.length + 1, title, content, likes: 0, tag };
  news.push(newArticle);
  res.status(201).json(newArticle);
});

app.delete("/news/:id", (req, res) => {
  const id = parseInt(req.params.id);
  news = news.filter((n) => n.id !== id);
  res.json({ message: "News deleted" });
});

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

app.listen(5000, () => console.log("Server running on port 5000"));
