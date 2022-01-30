const http = require("http");
fs = require("fs");
url = require("url");
path = require("path");

http
  .createServer((req, res) => {
    let content = "";
    req.on("data", (data) => {
      content += data;
    });
    req.on("end", () => {
      let fileName = path.parse(req.url).base;
      if (req.method === "GET" && req.url === "/") {
        fs.createReadStream("./index.html")
          .pipe(res);
      }else if (req.method === "GET" && req.url === "/about") {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream(`./about.html`)
          .pipe(res);
      }else if (req.method === "GET" && req.url === "/form") {
        res.writeHead(200, { "Content-Type": "text/html" });
        fs.createReadStream(`./form.html`)
          .pipe(res);
      }else if (req.method === "POST" && req.url === "/form") {
        console.log(">>>>>>>>>>",content)
        content = JSON.parse(content);
        const contactsPath = path.join(__dirname, "/contacts");
        fs.readdir(contactsPath, (err, dirData) => {
          if(err) {
            console.log("err", err);
            return;
          }
          console.log(contactsPath, content.username)
          let newContactPath = path.join(contactsPath, content.username+".json");
          dirData.forEach(function(file){
           let stream =  fs.createReadStream(path.join(__dirname, "/contacts", file), {encoding: "utf8"});
            stream.on("data", function(data){
              if(data.username === content.username){
                return res.end("taken");
              }else{
                let writeStream = fs.createWriteStream(newContactPath);
                writeStream.write(JSON.stringify(content, null, "\t"));
              }
            })  
          })
        })
      } else if (req.method === "GET" && path.parse(req.url).ext === ".css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        fs.createReadStream(`./assets/stylesheet/${fileName}`)
          .pipe(res);
      } else if (req.method === "GET" && path.parse(req.url).ext === ".jpg") {
        res.writeHead(200, { "Content-Type": "image/jpg" });
        fs.createReadStream(`./assets/images/${fileName}`)
          .pipe(res);
      }
    });
  })
  .listen(4444, () => console.log("listening"));
