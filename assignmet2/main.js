// const console = require("node:console");
// const path = require("node:path");
// //////////////////////////////////////////////////////////////////////
// // =>1
// function showPath() {
//   console.log("File Path:", __filename);
//   console.log("Directory:", __dirname);
// }
// showPath();
// /////////////////////////////////////////////////////
// //=>2
// filePath = __filename;
// dirpath = __dirname;
// function getFileName(n) {
//   return path.basename(n);
// }
// console.log(getFileName(filePath));
// //////////////////////////////////////////////
// //=>3
// fileparse = path.parse(__filename);
// console.log(fileparse);
// function buildPath(n) {
//   return path.format(n);
// }
// console.log(buildPath(fileparse));
// ////////////////////////////////////////////////
// //=>4
//  function giveExt(n) {
//     return path.extname(n)
//  }
//  console.log(giveExt(filePath))
//  ///////////////////////////////////////////////
//  //=>5
// function giveNameExt(obj) {
//     return {
//         name: obj.base,
//         ext: obj.ext
//     };
// }

// console.log(giveNameExt(fileparse));
// ////////////////////////////////////////////
// //=>6
// function isAbsolut(n) {
//   return path.isAbsolute(n);
// }
// console.log(isAbsolut(filePath))
// ///////////////////////////////////////////////////
// //=>7
// function joinSegments(...segments) {
//   return path.join(...segments);
// }

// console.log(joinSegments(filePath,"test"))

// /////////////////////////////////////////////////////////////////////////
// //=>8
// function resolve(n) {
//   return path.resolve(n)
// }
// console.log(resolve("main.js"))
// //////////////////////////////////////////////////////////////////////
// //=>9
// function joinPaths(n, n2) {
//   return path.join(n, n2);
// }

// console.log(joinPaths("/folder1", "folder2/file.txt"));
// ///////////////////////////////////////////////////////////////////////////////////////////////////
// //========>note<============
// //all path points related to each others
//==================================================
// //////////////////////////////////////////////////////////////////////////////////////////////////
// //=>10
// const fs = require("node:fs");
// const path = require("node:path");
// const filePath = __filename;
// const dirpath = __dirname;
// const datapath = path.resolve("data.txt");

// function deleteFile(n) {
//   fs.unlink(n , (err) => {
//     if (err) {
//       console.log("Error:", err.message);
//       return;
//     }

//     console.log(`${path.basename(n)} is deleted.`);
//   });
// }

// console.log(deleteFile("./data.txt"))
////////////////////////////////////////////////////////////
//=>11

// function makefolder(n) {
// fs.mkdirSync(n, { recursive: true })
// }
// makefolder("data")

///////////////////////////////////////////////////////////////////////
//=>12
// const { EventEmitter } = require("node:events");
// const event = new EventEmitter();
// event.on("start", () => {
//   console.log("Welcome event triggered!");
// });
// event.emit("start");
// /////////////////////////////////////////////////////////////////////
// //=>13
// event.on("login", (n) => {
//   setTimeout(() => {
//     console.log(`loggdin to ${n}`);
//   }, 2000);
// });
// event.emit("login", "ahmed")
// //========>note<============
// //all event points related to each others
//==================================================
/////////////////////////////////////////////////////////////////////
//=>14
// try {
//   const data = fs.readFileSync(datapath, "utf8");
//   console.log(data.split("@@@"));
// } catch (error) {
//     console.log(error)
// }
// ////////////////////////////////////////////////////////////////////////
// //=>15
// fs.writeFile(datapath, "@@@helloworld", { flag: "a" }, (error) => {
//   if (error) {
//     return console.log(error);
//   }
//   console.log("doneBitches");
// });

// ///////////////////////////////////////////////////////////////////////////
// //=>16
// try {
//   const exist = fs.existsSync(datapath);
//   console.log({ exist });
// } catch (error) {
//   console.log(error);
// }
////////////////////////////////////////////////////////////////////////////
// //========>note<============
// //all fs points related to each others
//==================================================
///////////////////////////////////////////////////////////////////////////////////////
// const fs = require("node:fs");
// const { createGzip } = require("node:zlib");
// const path = require("node:path");
// const sourcepath = path.resolve("./stream.txt");
// const destepath = path.resolve("./dest.txt");
// const destepathzip = path.resolve("./dest.txt.gz");
// const datapath = path.resolve("./data.txt");
// const zip = createGzip();
// console.log(sourcepath);
// let starttime = Date.now();
//////////////////////////////////////////////////////
//=>17
// const os = require("node:os");

// function getSystemInfo() {
//   return {
//     Platform:os.platform(),
//     Arch: os.arch(),
//   };
// }
// console.log(getSystemInfo());
////////////////////////////////////////////////////
//=>18
// const readstream = fs.createReadStream(sourcepath, { highWaterMark: 5000 });
// readstream.on("data", (chunk) => {
//   console.log("===================================");
//   console.log(chunk);
//   console.log("===================================");
// });
// ////////////////////////////////////////////////
//=>19
// const readstream = fs.createReadStream(sourcepath, { highWaterMark: 5000 });
// const writestream = fs.createWriteStream(destepath);
// readstream.on("data", (chunk) => {
//   console.log("===================================");
//   console.log(chunk);
//   writestream.write(chunk);
//   console.log("===================================");
// });
///////////////////////////////////////////////////////
//=>20
// const readstream = fs.createReadStream(sourcepath, { highWaterMark: 5000 });
// const writestream = fs.createWriteStream(destepath);
// const writeZIPstraem = fs.createWriteStream(destepathzip);
// readstream.pipe(zip).pipe(writeZIPstraem);
////////////////////////////////////////////////////////////////////////////////////

/*
=================================================================================================
http server questions
=================================================================================================
*/
//the server
const fs = require("node:fs");
const filePath = "users.json";
const http = require("node:http");
let port = 3001;
function listen(n) {
  httpserver.listen(n, () => {
    console.log(`server is running on ${n}`);
  });
}
const httpserver = http.createServer((req, res) => {
  console.log(req);
  const { method, url } = req;
  console.log({ method, url });
//////////////////////////////////
//1
  if (method == "POST" && url == "/user") {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const newUser = JSON.parse(body);
      let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const user = users.find((u) => u.email === newUser.email);
      if (user) {
        res.end("Email already exists");
        return;
      }
      users.push(newUser);
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      res.end("User added successfully");
    });
///////////////////////////////////////////
//2
  } else if (method === "PATCH" && url.startsWith("/user/")) {
    const id = Number(url.split("/")[2]);
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
    });
    req.on("end", () => {
      const updatedUser = JSON.parse(body);
      let users = JSON.parse(fs.readFileSync(filePath, "utf8"));
      const user = users.find((u) => u.id === id);
      if (!user) {
        return res.end("User not found");
      }
      if (updatedUser.id) {
        user.id = updatedUser.id;
      }
      if (updatedUser.name) {
        user.name = updatedUser.name;
      }
      if (updatedUser.email) {
        user.email = updatedUser.email;
      }
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
      res.end("User updated successfully");
    });
  } 
//////////////////////////////////////////////
//3
else if (method === "DELETE" && url.startsWith("/user/")) {
  const id = Number(url.split("/")[2]);

  let users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.end("User not found");
  }

  users = users.filter((u) => u.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(users, null, 2));
  
  res.end("User deleted successfully");
}
////////////////////////////////////////////////////////////
//4
else if (method === "GET" && url === "/user") {
  const users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(users));
}
/////////////////////////////////////////////////////
//5
else if (method === "GET" && url.startsWith("/user/")) {
  const id = Number(url.split("/")[2]);

  let users = JSON.parse(fs.readFileSync(filePath, "utf8"));

  const user = users.find((u) => u.id === id);

  if (!user) {
    return res.end("User not found");
  }

  res.writeHead(200, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(user));
}
///////////////////////////////////////////////////////////////
  else {
    res.statusCode = 404;
    res.end("Route not found");
  }
});
///////////////////////////////////////////////////////////////
httpserver.on("error", (error) => {
  if (error.code == "EADDRINUSE") {
    console.log(`use another port`);
    httpserver.close();
  }
});
listen(port);
///////////////////////////////////////////////////////////////////////////////////////////////////////
