# OpenGameCreator

## Usage

This does not come with any assets, you are on your own with that but if you manage to get them, place the files in the "Client" folder.

Open up index.js located in the "Server" folder and there are a few variables to modify.<br />
**ip - IP address used to connect to the server.**<br />
**port - Port used to connect to the server.**<br />
**GameName - Used to handle api requests. Ex: /game-creator/{GAMENAME}/**

If you modify the ip variable, the variables located in "Client/tools/xml/config2.xml" must be updated too.

Once all of this is done, load index.js in Node.Js by calling the command "node Server/index.js".
Finally, host the "Client" folder on a webserver of your choosing and go to index.html to play the game creator.

If you want the levels to save names, you must put the list of string names in "Server/gamecreator_GAMENAME/stringNames.txt"<br/>
This supports multiple game creator folders, just create a new folder named gamecreator_GAMENAME in the server folder and switch
the GameName variable to change to that specific folder.

If levels are not saving, create the following folders in "Server/gamecreator_GAMENAME":<br />
"json_levels"<br />
"thumbnails"<br />
"xml_levels"<br />
