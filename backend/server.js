const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/hello", (req, res) => {
    res.json({message : "backend is running!"});
});

app.post("/api/hello", (req, res) => {
  const name = req.body.name;   // NOT req.body()
  res.json({ message: `${name} backend is running` });
});

app.post("/api/square", (req, res) => {
    const num = req.body.num;
    const num2 = num * num;

    res.json({message : `answer is ${num2}`})
})


app.listen(2000, () => {
    console.log("server running at 2000");
});