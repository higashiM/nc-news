const app = require("./server/app");
const { port = 9090 } = process.env;

app.listen(port, res => console.log(`listening on ${port}....`));
