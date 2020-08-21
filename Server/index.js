const express = require('express');
const app = express();
var fs = require('fs');
const path = require( 'path' );
const glob = require('glob');
var crypto = require('crypto');
var bodyParser = require('body-parser');

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

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('gamecreator/thumbnails'));

app.use('/authToken', function(req, res, next) {
  res.send("authService.tokens.missing.authid Missing authid token authService.tokens.missing.pid Missing PID\nauthService.tokens.invalid.credentials Something isn't working right. Please try again later.");
});

app.get('/game-creator-list/featured/' + GameName + '/:page', function(req, res, next) {
    var MaxLevelsPerPage = 10;
    glob(__dirname + '/gamecreator/json_levels/*.xml', {}, (err, files)=>{
      console.log(files);
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
        res.set('Content-Type', 'application/json;charset=utf-8');
        res.send("[]");
      }
    });
});

app.use('/game-creator/' + GameName + '/random', function(req, res, next) {
  glob(__dirname + '/gamecreator/xml_levels/*.xml', {}, (err, files)=>{
    fs.readFile(files[Math.floor(Math.random() * files.length)], function(err, data) {
      res.set('Content-Type', 'application/json;charset=utf-8');
      res.send(data);
    });
  });
});

app.post('/game-creator/' + GameName, function(req, res, next) {
  if(req.body["requestType"] === "saveGame")
  {
      var NameArray = new Array("", "Adventure", "Alien", "Ambush", "Animo", "Assault", "Atomic", "Attack", "Battle", "Beast", "Ben", "Blaster", "Breaker", "Burst", "Challenge", "Champion", "Charge", "Chase", "Clash", "Cosmic", "Crusher", "Danger", "Dark", "Defense", "Doom", "Droid", "Drome", "Earth", "Energy",
      "Escape", "Fire", "Force", "Fury", "Fusion", "Galaxy", "Gear", "Giga", "Hero", "Hex", "Humungousaur", "Hyper", "Invasion", "Iron", "Jetray", "Laser", "Light", "Lightning", "Magno", "Mega", "Metal", "Mission", "Nano", "Nitro", "Nova", "Patrol", "Plasma", "Plumber", "Power", "Pulse", "Pursuit", "Quake", "Racer", 
      "Rampage", "Razor", "Rescue", "Robot", "Rock", "Rocket", "Rumble", "Rush", "Rustbucket", "Search", "Shadow", "Shock", "Siege", "Slam", "Smash", "Solar", "Sonic", "Space", "Spark", "Spidermonkey", "Spike", "Star", "Steel", "Stone", "Storm", "Streak", "Swampfire", "Target", "Techno", "Thunder", "Titan", "Turbo", "Ultimate", "Ultra", 
      "Universe", "Vilgax", "Warp", "Warrior", "Brainstorm", "Terraspin", "Water", "Waterhazard", "Whirlwind", "Big", "Cannonbolt", "Chill", "Echo", "Omniverse", "Feedback", "Gravattack", "Ball Weevil", "Bloxx", "Rook", "Kickin Hawk", "Snare-Oh", "Blitzwolf");
      var UniqueIDString = req.body["goal-id"] + req.body["hero-id"] + req.body["game-name"];
      UniqueIDString.replace(",", "");
      var CryptoID = crypto.createHash('sha1').update(UniqueIDString).digest('hex');
      var UniqueID = CryptoID.substr(0, 24);
      var data_encode = req.body["encoded-thumbnail"] .replace('#^data:image/\w+;base64,#i', '');
      var data = Buffer.from(data_encode, 'base64'); 
      var PlayerName = req.body["player-name"];
      //if (PlayerName == ""){PlayerName = "Guest";} //ONLY USE THIS IF YOU ARE HANDLING ACCOUNT SYSTEMS
      fs.writeFile("gamecreator/thumbnails/" + PlayerName + "/" + UniqueID + ".jpg", data, 'base64', function(err) {
        if(err == null)
        {
          console.log(err);
        }
      });
      var GameNameArray = req.body["game-name"].split(",");
      GameNameArray[0] += 0;
      GameNameArray[1] += 0;
      GameNameArray[2] += 0;
      var GameTextName = NameArray[GameNameArray[0]] + " " + NameArray[GameNameArray[1]] + " " + NameArray[GameNameArray[2]];
      var XMLCacheData = '<?xml version="1.0"?>\n<root>\n<response status="SUCCESS"/>\n<game id="' + UniqueID + '" rating="0" difficulty="0" status="0" timeToBeat="0" createDate="07/01/2010">\n<thumbnail>http://' + ip + ":" + port + "/" + "gamecreator/xml_levels/" + PlayerName + "/" + UniqueID + ".xml" + '</thumbnail>\n<title>' + GameTextName + '</title>\n<creator>' + PlayerName + '</creator>\n<levelData>' + req.body["game-data"] + '</levelData>\n<relatedgames/>\n</game>\n</root>';
      var JsonData = '{"heroId":' + req.body["hero-id"] + ',"goalId":' + req.body["goal-id"] + ',"timeToBeat":0,"gameData":"' + req.body["game-data"] + '","id":"' + UniqueID + '","productName":"gamecreator","gameName":"' + GameTextName + '","playerName":"' + PlayerName + '","timesPlayed":0,"lastTimePlayed":1375410277138,"difficulty":0,"rating":0,"difficultyCount":0,"ratingCount":0,"ratingAverage":0,"featured":' + req.body["featured"] + ',"featuredDate":0,"timesCompleted":0,"flagCount":0,"thumbnailUrl":"http://' + ip + ":" + port + "/" + UniqueID + ".jpg" + '","thumbnailBase64Encoded":"' + req.body["encoded-thumbnail"] + '","approveDate":1375242495523,"rejectDate":0,"approveBy":"TurnOut_GC3","createdBy":"aa41859-1202333211-1375240985621-1","createdDate":1375242400748,"version":1,"versionUUID":"6567c0f0-13c6-4f2b-8cbf-a25918dbb3b9"}';;
      fs.writeFile("gamecreator/json_levels/" + UniqueID + "." + req.body["mode"], JsonData, function(err) {
        if(err == null)
        {
          console.log(err);
        }
      });
      fs.writeFile("gamecreator/xml_levels/" + PlayerName + "/" + UniqueID + ".xml", XMLCacheData, function(err) {
        if(err == null)
        {
          console.log(err);
        }
      });
      res.header("Content-Type: application/json");
      res.send(JsonData);
  }
  else
  {
    res.send('{"code":401,"message":"The user is unauthorized for this action."}');
  }
});

/*app.use('/game-creator/' + GameName + "/:gamename", function(req, res, next) {
  fs.readFile("gamecreator/json_levels/" + req.params.gamename, function(err, data) {
    res.set('Content-Type', 'application/json;charset=utf-8');
    res.send(data);
  });
});*/

app.use('/', function(req, res, next) {
    res.set('Content-Type', 'application/json;charset=utf-8');
    res.send("[]");
});

app.listen(port, ip);