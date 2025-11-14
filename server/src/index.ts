import express, { Request, Response } from "express";

const app = express();

app.get("/hello", (req: Request, res: Response) => {
  res.send("hello world");
});

app.listen(3000, () => {
  console.log(`Server is listening on port:3000..`);
});
