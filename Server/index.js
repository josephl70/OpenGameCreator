const express = require('express');
const app = express();
var fs = require('fs');
const path = require( 'path' );
const glob = require('glob');
var crypto = require('crypto');

const ip = "localhost";
const port = 3000;
const GameName = "";

function chunkArray(arr, size) {
  var myArray = [];
  for(var i = 0; i < arr.length; i += size) {
    myArray.push(arr.slice(i, i+size));
  }
  return myArray;
}

if(GameName == "")
{
  console.log("ERROR - Variable 'Game Name' not set!");
  process.kill(process.pid, 'SIGTERM');
}

if(!fs.existsSync(__dirname + '/gamecreator_' + GameName))
{
  console.log("ERROR - gamecreator folder not created!");
  process.kill(process.pid, 'SIGTERM');
}


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('gamecreator/thumbnails'));

app.get('/crossdomain.xml', function(req, res, next) {
  res.type('application/xml');
  res.send('<?xml version="1.0"?><!DOCTYPE cross-domain-policy SYSTEM "http://www.macromedia.com/xml/dtds/cross-domain-policy.dtd"><cross-domain-policy></cross-domain-policy>');
});

app.post('/authToken', function(req, res, next) {
  res.send("authService.tokens.missing.authid Missing authid token authService.tokens.missing.pid Missing PID\nauthService.tokens.invalid.credentials Something isn't working right. Please try again later.");
});

app.get('/game-creator/' + GameName + '/random', function(req, res, next) {
  glob(__dirname + '/gamecreator_' + GameName + '/json_levels/**/*.xml', {}, (err, files)=>{
    fs.readFile(files[Math.floor(Math.random() * files.length)], function(err, data) {
      res.type('application/json');
      res.send(data);
    });
  });
});

app.get('/v2/game-creator/' + GameName + '/random', function(req, res, next) {
  glob(__dirname + '/gamecreator_' + GameName + '/json_levels/**/*.xml', {}, (err, files)=>{
    fs.readFile(files[Math.floor(Math.random() * files.length)], function(err, data) {
      res.type('application/json');
      res.send(data);
    });
  });
});

app.get('/gamecreator/cache_storage/images/related/:xml', function(req, res, next) {
  res.status(404).send('Not found');
});

app.get('/gamecreator/cache_storage/images//:xml', function(req, res, next) {
  fs.readFile(__dirname + "/gamecreator_" + GameName + "/xml_levels/" + req.params.xml, function(err, data) {
    res.type('application/json');
    res.send(data);
  });
});

app.get('/gamecreator/cache_storage/images2//:xml', function(req, res, next) {
  fs.readFile(__dirname + "/gamecreator_" + GameName + "/xml_levels/" + req.params.xml, function(err, data) {
    res.type('application/json');
    res.send(data);
  });
});

app.get('/gamecreator/cache_storage/images/:folder/:xml', function(req, res, next) {
  fs.readFile(__dirname + "/gamecreator_" + GameName + "/xml_levels/" + req.params.folder + "/" + req.params.xml, function(err, data) {
    res.type('application/json');
    res.send(data);
  });
});

app.get('/gamecreator/cache_storage/images2/:folder/:xml', function(req, res, next) {
  fs.readFile(__dirname + "/gamecreator_" + GameName + "/xml_levels/" + req.params.folder + "/" + req.params.xml, function(err, data) {
    res.type('application/json');
    res.send(data);
  });
});

app.get('/game-creator/' + GameName + "/:gamename", function(req, res, next) {
  glob(__dirname + '/gamecreator_' + GameName + '/json_levels/**/' + req.params.gamename + ".xml", {}, (err, files)=>{
    if(files.length > 0)
    {
      fs.readFile(files[0], function(err, data) {
        res.type('application/json');
        res.send(data);
      });
    }
  });
});

app.get('/v2/game-creator/' + GameName + "/:gamename", function(req, res, next) {
  glob(__dirname + '/gamecreator_' + GameName + '/json_levels/**/' + req.params.gamename + ".xml", {}, (err, files)=>{
    if(files.length > 0)
    {
      fs.readFile(files[0], function(err, data) {
        res.type('application/json');
        res.send(data);
      });
    }
  });
});

app.get('/game-creator-list/featured/' + GameName + '/:page', function(req, res, next) {
    var MaxLevelsPerPage = 10;
    glob(__dirname + '/gamecreator_' + GameName + '/json_levels/**/*.xml', {}, (err, files)=>{
      if(files.length > 0)
      {
        let FeaturedArray = [];
        files.forEach(function(entry, index) {
          fs.readFile(entry, function(err, data) {
            if (err) throw err; 
            const users = JSON.parse(data);
            if(users.featured == true)
            {
              FeaturedArray.push(users);
            }
            if(index >= (files.length - 1))
            {
              var ChunkArray = chunkArray(FeaturedArray, 10);
              res.set('Content-Type', 'application/json;charset=utf-8');
              res.send(ChunkArray[req.params.page - 1]);
            }
          }); 
        });
      }
      else
      {
        res.type('application/json');
        res.send("[]");
      }
    });
});

app.get('/v3/game-creator-list/' + GameName + '/featured/sort/recent/page/:page', function(req, res, next) {
  var MaxLevelsPerPage = 10;
  glob(__dirname + '/gamecreator_' + GameName + '/json_levels/**/*.xml', {}, (err, files)=>{
    if(files.length > 0)
    {
      let FeaturedArray = [];
      files.forEach(function(entry, index) {
        fs.readFile(entry, function(err, data) {
          if (err) throw err; 
          const users = JSON.parse(data);
          if(users.featured == true)
          {
            FeaturedArray.push(users);
          }
          if(index >= (files.length - 1))
          {
            var ChunkArray = chunkArray(FeaturedArray, 10);
            res.set('Content-Type', 'application/json;charset=utf-8');
            res.send(ChunkArray[req.params.page - 1]);
          }
        }); 
      });
    }
    else
    {
      res.type('application/json');
      res.send("[]");
    }
  });
});

app.get('/game-creator-list/player/' + GameName + '//:page', function(req, res, next) {
  console.log("Tried to access player created levels, however there are no account systems supported!");
  res.type('application/json');
  res.send("[]");
});

app.get('/v2/game-creator-list/player/' + GameName + '//:page', function(req, res, next) {
  console.log("Tried to access player created levels, however there are no account systems supported!");
  res.type('application/json');
  res.send("[]");
});

app.get('/game-creator-list/hero/' + GameName + '/:ID/:page', function(req, res, next) {
  console.log("Tried to access hero page");
  res.status(404).send('Not found');
});

app.get('/v2/game-creator-list/hero/' + GameName + '/:ID/:page', function(req, res, next) {
  console.log("Tried to access hero page");
  res.status(404).send('Not found');
});

app.post('/game-creator/' + GameName, function(req, res, next) { HandleRequestType(req, res); });
app.post('/v2/game-creator/' + GameName, function(req, res, next) { HandleRequestType(req, res); });

app.use('/', function(req, res, next) {
    if(path.extname(req.url) == ".jpg")
    {
      glob(__dirname + '/gamecreator_' + GameName + '/thumbnails/**/' + req.url, {}, (err, files)=>{
        if(files.length > 0)
        {
          res.sendFile(files[0]);
        }
      });
      return;
    }
    res.set('Content-Type', 'application/json;charset=utf-8');
    res.send("[]");
    console.log("Game Creator - Trying to Access URL: " + req.url);
});

function HandleRequestType(req, res)
{
  if(req.body["requestType"] === "saveGame")
  {
      var NameArray = fs.readFileSync(__dirname + '/gamecreator_' + GameName + '/stringNames.txt', 'utf8').split('\n');
      var UniqueIDString = req.body["goal-id"] + req.body["hero-id"] + req.body["game-name"];
      UniqueIDString.replace(",", "");
      var CryptoID = crypto.createHash('sha1').update(UniqueIDString).digest('hex');
      var UniqueID = CryptoID.substr(0, 24);
      var data_encode = req.body["encoded-thumbnail"] .replace('#^data:image/\w+;base64,#i', '');
      var data = Buffer.from(data_encode, 'base64'); 
      var PlayerName = req.body["player-name"];
      if (PlayerName == ""){PlayerName = "Guest";} //ONLY USE THIS IF YOU ARE HANDLING ACCOUNT SYSTEMS
      fs.writeFile(__dirname + "/gamecreator_" + GameName + "/thumbnails/" + PlayerName + "/" + UniqueID + ".jpg", data, 'base64', function(err) {
          if(err) { console.log("Error: " + err); }
      });
      var GameNameArray = req.body["game-name"].split(",");
      var GameTextName = NameArray[Number(GameNameArray[0])].replace('\r', '') + " " + NameArray[Number(GameNameArray[1])].replace('\r', '') + " " + NameArray[Number(GameNameArray[2])].replace('\r', '');
      var GameTextNamexmlLevel = NameArray[Number(GameNameArray[0]) - 1].replace('\r', '') + " " + NameArray[Number(GameNameArray[1] - 1)].replace('\r', '') + " " + NameArray[Number(GameNameArray[2] - 1)].replace('\r', '');
      var XMLCacheData = '<?xml version="1.0"?>\n<root>\n<response status="SUCCESS"/>\n<game id="' + UniqueID + '" rating="0" difficulty="0" status="0" timeToBeat="0" createDate="07/01/2010">\n<thumbnail>http://' + ip + ":" + port + "/" + PlayerName + "/" + UniqueID + '.jpg</thumbnail>\n<title>' + GameTextNamexmlLevel + '</title>\n<creator>' + PlayerName + '</creator>\n<levelData>' + req.body["game-data"] + '</levelData>\n<relatedgames/>\n</game>\n</root>';
      var JsonData = '{"heroId":' + req.body["hero-id"] + ',"goalId":' + req.body["goal-id"] + ',"timeToBeat":0,"gameData":"' + req.body["game-data"] + '","id":"' + UniqueID + '","productName":"gamecreator","gameName":"' + GameTextName + '","playerName":"' + PlayerName + '","timesPlayed":0,"lastTimePlayed":1375410277138,"difficulty":0,"rating":0,"difficultyCount":0,"ratingCount":0,"ratingAverage":0,"featured":' + req.body["featured"] + ',"featuredDate":0,"timesCompleted":0,"flagCount":0,"thumbnailUrl":"http://' + ip + ":" + port + "/" + PlayerName + "/" + UniqueID + '.jpg","thumbnailBase64Encoded":"' + req.body["encoded-thumbnail"] + '","approveDate":1375242495523,"rejectDate":0,"approveBy":"TurnOut_GC3","createdBy":"aa41859-1202333211-1375240985621-1","createdDate":1375242400748,"version":1,"versionUUID":"6567c0f0-13c6-4f2b-8cbf-a25918dbb3b9"}';;
      fs.writeFile(__dirname + "/gamecreator_" + GameName + "/json_levels/" + PlayerName + "/" + UniqueID + "." + req.body["mode"], JsonData, function(err) {
          if(err) { console.log("Error: " + err); }
      });
      fs.writeFile(__dirname + "/gamecreator_" + GameName + "/xml_levels/" + PlayerName + "/" + UniqueID + ".xml", XMLCacheData, function(err) {
          if(err) { console.log("Error: " + err); }
      });
      res.type('application/json');
      res.send(JsonData);
  }
  else
  {
    res.send('{"code":401,"message":"The user is unauthorized for this action."}');
  }
}

app.listen(port, ip, () => console.log("Server Started"));