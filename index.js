const express = require("express")
const app = express()

const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")

mongoose.connect("mongodb://localhost:27017/lol")

app.set("view engine", "ejs")
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static("public"))


const routes = require("./public/routes")
app.use("/runes", routes.runes)
app.use("/win-rates", routes.winrates)
app.use("/match", routes.match)

var dd = require("./public/data-dragon.js")
var tools = require("./public/tools.js")
var query = require("./public/controllers/query.js")



app.get("/", (req, res, next) => {
	res.locals.queryMatch = []

	res.locals.aggregation = [
		{$sort: {gameDateTimestamp: -1}},
	    {$project: {
	    	matchId: "$metadata.matchId",
	    	gameVersion: "$info.gameVersion",
			gameDateTimestamp: 1,
			gameDuration: "$info.gameDuration",
			gameLength: 1,
			championId: 1,
			championName: 1,
			summoner1Id: 1,
			summoner2Id: 1,
			champLevel: 1,
			goldEarned: 1,
			visionScore: 1,
			wardsKilled: 1,
			visionWardsBoughtInGame: 1, // control wards bought (value on op.gg/post game)
			detectorWardsPlaced: 1, // control wards placed
			wardsPlaced: 1, // total number of wards placed (ALL ward types)
			// doubleKills: 1,
			// tripleKills: 1,
			// quadraKills: 1,
			// pentaKills: 1,
			riotIdGameName: 1,
			riotIdTagline: 1,
			summonerName: 1,
			position: 1,
			kills: 1,
			deaths: 1,
			assists: 1,
	        cs: {$add: ["$totalMinionsKilled", "$neutralMinionsKilled"]},
			perks: 1,
			items: 1,
			win: 1,
			gameEndedInEarlySurrender: 1,
			participants: "$info.participants"
		}},
	    {$addFields: {
	    	csMin: {$cond: [
				{$eq: ["$cs", 0]},
				0,
				{$round: [{$divide: ["$cs", {$divide: ["$gameDuration", 60]}]}, 1]}
			]},
	    	kda: {$cond: [
	    		{$eq: ["$deaths", 0]},
	    		{$add: ["$kills", "$assists"]},
	    		{$round: [{$divide: [{$add: ["$kills", "$assists"]}, "$deaths"]}, 2]}
	    	]},
			"participants.ally": {$concatArrays: [
				"$participants.ally", [{
					championId: "$championId",
					championName: "$championName",
					riotIdGameName: "$riotIdGameName",
					riotIdTagline: "$riotIdTagline",
					relationship: "ally",
					position: "$position"
				}]
			]}
	    }},
		{$facet: {

			history: [
				{$limit: 30},
				{$project: {
					matchId: 1,
					gameVersion: 1,
					gameDateTimestamp: 1,
					gameDuration: 1,
					gameLength: 1,
					championName: 1,
					summoner1Id: 1,
					summoner2Id: 1,
					champLevel: 1,
					goldEarned: 1,
					visionScore: 1,
					wardsKilled: 1,
					visionWardsBoughtInGame: 1,
					detectorWardsPlaced: 1,
					wardsPlaced: 1,
					summonerName: 1,
					position: 1,
					kills: 1,
					deaths: 1,
					assists: 1,
					kda: 1,
			        cs: 1,
			        csMin: 1,
					participants: 1,
					items: 1,
					win: 1,
					gameEndedInEarlySurrender: 1,
					perks: 1
				}}
			],

			// My Champions
			champions: [
				{$match: {gameEndedInEarlySurrender: false}},
				{$project: {
					championName: 1,
					kills: 1,
					deaths: 1,
					assists: 1,
					win: 1
				}},
				{$group: {
					_id: "$championName",
					kills: {$sum: "$kills"},
					deaths: {$sum: "$deaths"},
					assists: {$sum: "$assists"},
					wins: {$sum: {$cond: ["$win", 1, 0]}},
					matches: {$sum: 1}
				}},
				{$addFields: {
					championName: "$_id",
					losses: {$subtract: ["$matches", "$wins"]},
					winrate: {$cond: [
						{$eq: ["$matches", 0]},
						0,
						{$round: [{$multiply: [{$divide: ["$wins", "$matches"]}, 100]}, 0]}
					]}
				}},
				{$sort: {matches: -1, wins: -1}},
				{$limit: 6}
			]

		}}
	]

	// check if req.query specifies a champion
	if (req.query.champion !== undefined) { res.locals.aggregation[3]["$facet"].history.unshift({$match: {championName: new RegExp(req.query.champion, "i")}}) }

 	next()

}, query, (req, res, next) => {
	res.locals.history = res.locals.data[0].history.map(function(e, i) {

		e.version = e.gameVersion.substring(0, e.gameVersion.indexOf(".", 3))
		e.length = tools.gameLength(e.gameDuration)
		e.date = tools.formatDate(e.gameDateTimestamp) + " · " + tools.formatTime(e.gameDateTimestamp)
		e.participants = tools.formatParticipants(e.participants)									// .ally.push({"championName": e.championName, "position": e.position})

		e.champion = dd.champion(e.championName)
		e.summoner1 = dd.summoner(e.summoner1Id)
		e.summoner2 = dd.summoner(e.summoner2Id)
		e.items = e.items.map(function(item, index, array) {
			return dd.item(item)
		})
		e.keystone = dd.rune(e.perks.styles.primaryStyle.selections[0].perk)
		e.styles = tools.formatRuneStyles(e.perks.styles)
		e.stats = tools.formatRuneStats(e.perks.statPerks)

		return e
	})

	res.locals.champions = res.locals.data[0].champions.map(function(e, i) {
		e.kda = ((e.kills + e.assists)/e.deaths).toFixed(2)
		e.kills = (e.kills/e.matches).toFixed(1)
		e.deaths = (e.deaths/e.matches).toFixed(1)
		e.assists = (e.assists/e.matches).toFixed(1)

		e.champion = dd.champion(e.championName)
		
		return e
	})

	next()
}, (req, res) => {
	// res.send(res.locals.history)
	res.render("home-page.ejs", {})
})



app.get("/test", (req, res) => { res.render("test.ejs") })
app.get("/test2", (req, res) => { res.render("test2.ejs") })



app.listen(1111, () => {
	console.log("\nRooks.GG\nv1.1.0\n")
})