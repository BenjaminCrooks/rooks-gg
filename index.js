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
app.use("/profile-icons", routes.icons)

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
	    	splitVersion: {$split: [{$substrCP: [ "$info.gameVersion", 0, {$indexOfCP: [ "$info.gameVersion", ".", 3 ]} ] }, "."]},
			gameDateTimestamp: 1,
			gameStartTimestamp: "$info.gameStartTimestamp",
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
			// doubleKills: 1,tripleKills: 1,quadraKills: 1,pentaKills: 1,
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
					gameStartTimestamp: 1,
					gameDuration: 1,
					gameLength: 1,
					summonerName: 1,
					riotIdGameName: 1,
					riotIdTagline: 1,
					position: 1,
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
					perks: 1,
					keystone: {$arrayElemAt: ["$perks.styles.primaryStyle.selections", 0]},
					styles: {$slice: [
						{$concatArrays: [
							"$perks.styles.primaryStyle.selections",
							"$perks.styles.subStyle.selections"
						]},
						1,
						5
					]}
				}}
			],

			// My Champions
			champions: [
				// {$match: {$or: [{gameVersion: new RegExp("^14.19")}, {gameVersion: new RegExp("^14.20")}]}},
				{$match: {$and: [
					{$expr: {$gte: [{$toInt: {$arrayElemAt: ["$splitVersion", 0]}}, 14]}},
					{$expr: {$gte: [{$toInt: {$arrayElemAt: ["$splitVersion", 1]}}, 19]}}
				]} },
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

	// HISTORY data mutation
	res.locals.history = res.locals.data[0].history.map(function(e, i) {

		e.version = tools.version(e.gameVersion)
		e.length = tools.gameLength(e.gameDuration)
		e.date = tools.formatDate(e.gameDateTimestamp) + " · " + tools.formatTime(e.gameDateTimestamp)
		e.participants = tools.formatParticipants(e.participants)									// .ally.push({"championName": e.championName, "position": e.position})

		e.champion = dd.champion(e.championName)
		e.summoner1 = dd.summoner(e.summoner1Id)
		e.summoner2 = dd.summoner(e.summoner2Id)
		e.items = e.items.map(function(item) { return dd.item(item) })

		e.keystone = dd.rune(e.keystone)
		e.styles = e.styles.map(function(style) { return dd.rune(style) })
		e.stats = tools.formatRuneStats(e.perks.statPerks)

		return e
	})

	let sessionCount = 0
	res.locals.history.forEach(function(ele, ind, arr) {
		// if not last element
		if (!(ind === arr.length - 1)) {
			// element + next element within an hour of each other
			if (Math.abs(ele.gameDateTimestamp - arr[ind+1].gameDateTimestamp) / (1000*60*60) <= 1) {
				if (ele.session === undefined) {
					sessionCount += 1
					ele.session = sessionCount
				}
				arr[ind+1].session = sessionCount
			}
		}
	})


	// CHAMPIONS data mutation
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
	// console.log(res.locals.history[0].participants)
	res.render("home-page.ejs", {})
})

app.get("/test", (req, res) => { res.render("test.ejs") })
app.get("/test2", (req, res) => { res.render("test2.ejs") })



app.listen(1111, () => {
	console.log("\nRooks.GG\nv1.1.0\n")
})