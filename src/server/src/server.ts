import app from "./app";
const port = process.env.PORT || 5555;

app.listen(port, () => {
  console.log(`[Server]: I am running at http://localhost:${port}`);
});
