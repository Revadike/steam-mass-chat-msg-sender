const message = `Best wishes for 2018!`;

var credentials = {
    steam: {
        accountName: "Xxx", // your steam username
        password: "Xxx" // your steam password
            /* If you use winauth, uncomment this block by removing this line and the line which is 5 lines below
                },
                winauth: { 
                    deviceid: "android:xxx-xxx-xxx-xxx-xxx",
                    shared_secret: "Xxx+Xxx+Xxx=",
                    identity_secret: "Xxx="
            */
    }
}

const SteamUser = require("steam-user"),
    fs = require("fs"),
    logger = require("datetime-logger"),
    client = new SteamUser();

console.log = logger({ "filename": "log.txt" });
if (credentials.hasOwnProperty("winauth")) {
    const SteamAuth = require("steamauth");
    SteamAuth.Sync(function(error) {
        if (error) console.log(error);
        var auth = new SteamAuth(credentials.winauth);
        auth.once("ready", function() {
            credentials.steam.twoFactorCode = auth.calculateCode();
            steamLogin();
        });
    });
} else {
    steamLogin();
}

function steamLogin() {
    credentials.steam.rememberPassword = true;
    credentials.steam.logonID = Date.now();
    client.logOn(credentials.steam);
    client.on("loggedOn", function(response) {
        console.log("Logged into Steam as " + client.steamID.getSteam3RenderedID());
    });
    client.on("error", function(error) {
        console.log(error);
    });
    client.on("friendsList", function() {
        for (var steamid in client.myFriends) {
            client.chatMessage(steamid, message);
            console.log("Successfully sent a steam chat message to " + steamid);
        }
    })
}