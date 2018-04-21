const prefix = "!";
const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
const config = require("./config.json");
var userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'));
bot.on("message", message => {

    //In case you are storing more than points, you'll first have to check if the object has been initialized
    if(!userData[message.author.id]) userData[message.author.id] = {
        points: 0
    };

    if(!message.content.startsWith(prefix)) {
        //Ignore messages that do not start with our prefix
        return;
    }

    if(message.author.id === '428908837680971786') {
        //Don't let bot react to own messages
         return;
    }
    //Makes sure usernames are there before writing to file

    let args = message.content.split(" ");
    let command = args.shift().toLowerCase(); //Removes first element from args and returns it
    //command.substr(prefix.length); //Remove prefix
    command=command.substr(prefix.length);
    //Keep in mind that the value of command is in lower case here
    switch(command) {
        case "ping":
            executePingCommand(message, args);
            break;
        case "points":
            executePointsCommand(message, args);
            break;
        case "give":
          executeChangePointsCommand(message,args, true);
          break;
        case "take":
          executeChangePointsCommand(message, args, false);
          break;
        default:
            //message.channel.send(`Error! I don't know the command '${command}'`);
            return;
    }

});

function executePingCommand(message, args) {
    message.channel.send("pong!");
}

function executePointsCommand(message, args) {
    message.author.send('You have ' + userData[message.author.id].points + ' points, haro!');
}

function getPoints(id){
    if (!userData[id]){
        userData[id]= {points: 0};
        fs.writeFileSync("userData.json", JSON.stringify(userData));
    }
    return userData[id].points;
}
function updatePoints(id, newPoints){
    if (!userData[id]) {
        userData[id] = {points: 0};
    }
    userData[id].points= newPoints;
    fs.writeFileSync("userData.json", JSON.stringify(userData));
}
//allows adding and subtracting via a - prefix
function executeChangePointsCommand(message, args, add){
    if (message.author.id !== '132680960515768320' && message.author.id !== '191893388990087168'){
    message.channel.send("I'm sorry, haro,  "+ message.author+ " ,you can't use that command, haro!")
        return;
}
    if (message.mentions.users.size <1){
        message.channel.send("You forgot to give a user, haro!");
        return;
    }
    //get mentioned user
    let userMentioned=message.mentions.users.first();
    //try and parse points
    let points=parseInt(args[1]);
    if (isNaN(points)){
        message.channel.send("Please give a valid number, haro!");
        return;
    }
    if (!add) points = -points;
    //userData can be key value map, unless storing more than points
    updatePoints(userMentioned.id, getPoints(userMentioned.id)+points);
    message.channel.send(userMentioned +' has '+ getPoints(userMentioned.id) +' points, haro!')
}

bot.login(config.token);
