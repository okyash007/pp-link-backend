import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});
router.post("/", (req, res) => {
  console.log(JSON.stringify(req.body, null, 2));
  res.json({ message: "Hello World" });
});

export default router;
