const http = require("http"),
  url = require("url"),
  fs = require("fs");

http
  .createServer((request, response) => {
    let addr = request.url,
      q = url.parse(addr, true),
      filePath = "";

    //log requestno
    fs.appendFile(
      "log.txt",
      `URL: ${addr} \nTimestamp: ${new Date()}\n\n`,
      (err) => {
        err ? console.log(err) : console.log("Added to log");
      }
    );

    // prepare data
    if (q.pathname.includes("documentation")) {
      filePath = __dirname + "/documentation.html";
    } else {
      filePath = __dirname + "/index.html";
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        throw err;
      }
      response.writeHead(200, { "Content-Type": "text/html" });
      response.write(data);
      response.end();
    });
  })
  .listen(8080);

console.log("Node Server running on port 8080");
