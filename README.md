# OpenGameCreator

## Usage

This does not come with any assets, you are on your own on that but if you manage to get them, place the files in the "Client" folder.

Open up index.js located in the "Server" folder and there are a few variables to modify.
ip - IP address used to connect to the server.
port - Port used to connect to the server.
GameName - Used to handle api requests. Ex: /game-creator/{GAMENAME}/

If you modify the ip variable, the variables located in "Client/tools/xml/config2.xml" must be updated too.

Once all of this is done, load index.js in Node.Js by calling the command "node index.js".
Finally, host the "Client" folder on a webserver of your choosing and go to index.html to play the game creator.