const server = require("./socket").server;
const getBlockNumber = require("./socket").getBlockNumber;
const getData = require("./socket").getData;
const AuctionTimeout_monitor = require("./socket").AuctionTimeout_monitor;

const port = process.env.PORT || 5000;

// app.listen(port, () => {
//   console.log(`Listening: http://localhost:${port}`);
// });

getBlockNumber();

getData();

AuctionTimeout_monitor();

server.listen(port, () => console.log(`Listening on port ${port}..`));
