const app = require("./server/app");
const PORT = process.env.PORT || 9090;

app.listen(PORT, () => console.log(`listening on ${PORT}....`));
