const Discord = require('discord.js');
const bot = new Discord.Client();
var fs = require('fs');
const config = require("./config.json");
var userData = JSON.parse(fs.readFileSync('userData.json', 'utf8'));

bot.on('message', message => {
	const prefix = '!';
	const sender = message.author.id;
	const msg = message.content.toUpperCase();
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const command = args.shift().toLowerCase();
	const award = parseInt(args[3], 10) // award becomes the number
//-------------------------------------------------------------------------------------
//Makes sure bot can't reply to itself
if (sender === '428908837680971786'){
	return;
}
//------------------------------------------------------------------------------------
//Basic ping pong response test
if (msg === prefix + 'PING'){
	message.channel.send('Pong! Haro!')
}
//----------------------------------------------------------------------------------------
//Makes sure usernames are there before writing to file
if (!userData[sender]) userData[sender]={
	Points: 0
}
fs.writeFile('./userData.json', JSON.stringify(userData), (err) =>{
	if (err) console.error(err);
});
//Gives the user their points value
if (msg === prefix+ 'POINTS'){
	message.channel.send('You have ' + userData[sender].Points + ' points, haro!')
}
/*
//------------------------------------------------------------------------------------
//Adds an amount of points to an @user
if (msg === prefix+'GIVE'+ ` <@${bot.user.id}>` +  award){
	if (message.author.id == '191893388990087168' ) {
		userData[sender].Points = userData[sender].Points+award
		fs.writeFile('./userData.json', JSON.stringify(userData), (err) =>{
			if (err) console.error(err);
		});
	}
	else{
		message.channel.send('I`m sorry '+ message.author + ', haro! You can`t give points!')
	}
}

//-------------------------------------------------------------------------------------------
//Subtracts an amount of points to an @user
if (message.author.id === '132680960515768320' ){
	if (msg===prefix+'TAKE'+ ` <@${bot.user.id}>` + award)  {
		userData[sender].Points = userData[sender].Points-award
		fs.writeFile('userData.json', JSON.stringify(userData), (err) =>{
			if (err) console.error(err);
		});
	}
	else{
		message.channel.send('I`m sorry '+ message.author + ', haro! You can`t take points!')
	}
}
*/
if(message.content.toLowerCase().startsWith("!give")) {

				//Check who executed the command
				if(message.author.id !== "191893388990087168") {
						message.reply("You are not allowed to execute this command");
						return;
				}

				//Check if enough arguments were given
				//Split by space, so array for command should be ["!give", "@someone", "5"]
				//Although I'm not sure if mentions are included in the content
				let args = message.content.split(" ");
				if(args.length !== 3) {
						message.reply("Command syntax:\n!give <@user> <points>");
						return;
				}

				//Check what (and if a) user was mentioned
				if(message.mentions.users.length < 1) {
						message.reply("You must provide a user");
						return;
				}

				//Get the mentioned user
				let userMentioned = message.mentions.users.first();

				//Try and parse points
				let points;
				try {
						points = parseInt(args[2]);
				} catch (e) {
						message.reply("You did not provide a valid number");
						return;
				}

				//userData can just be a key-value map (unless you're storing more things than points)
				userData.Points[userMentioned.id] += points;

				//In case you are storing more than points, you'll first have to check if the object has been initialized
				/*if(!userData[userMentioned.id]) userData[userMentioned.id] = {...}*/
				userData.Points[userMentioned.id].points += points;

				//+ Save the data

		}

		if(message.content.toLowerCase().startsWith("!take")) {

						//Check who executed the command
						if(message.author.id !== "191893388990087168") {
								message.reply("You are not allowed to execute this command");
								return;
						}

						//Check if enough arguments were given
						//Split by space, so array for command should be ["!give", "@someone", "5"]
						//Although I'm not sure if mentions are included in the content
						let args = message.content.split(" ");
						if(args.length !== 3) {
								message.reply("Command syntax:\n!take <@user> <points>");
								return;
						}

						//Check what (and if a) user was mentioned
						if(message.mentions.users.length < 1) {
								message.reply("You must provide a user");
								return;
						}

						//Get the mentioned user
						let userMentioned = message.mentions.users.first();

						//Try and parse points
						let points;
						try {
								points = parseInt(args[2]);
						} catch (e) {
								message.reply("You did not provide a valid number");
								return;
						}

						//userData can just be a key-value map (unless you're storing more things than points)
						userData.Points[userMentioned.id] -= points;

						//In case you are storing more than points, you'll first have to check if the object has been initialized
					/*	if(!userData[userMentioned.id]) userData[userMentioned.id] = {...}*/
						userData.Points[userMentioned.id].points -= points;

						//+ Save the data

				}
});
bot.login(config.token);
