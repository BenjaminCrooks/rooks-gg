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


const champions = require("./public/routes/champions")
const teams = require("./public/routes/teams")
const stats = require("./public/routes/stats")
const champies = require("./public/routes/random-icons")
const arena = require("./public/routes/arena")
const runes = require("./public/routes/runes")
app.use("/champions", champions)
app.use("/teams", teams)
app.use("/stats", stats)
app.use("/random-icon", champies)
app.use("/arena", arena)
app.use("/runes", runes)

var tools = require("./public/tools.js")
var query = require("./public/controllers/query.js")




app.get("/", (req, res, next) => {
	res.locals.aggregation = [
		{$sort: {gameTimestamp: -1}},
	    {$project: {
	    	gameVersion: 1,
			gameTimestamp: 1,
			maxTimePlayed: 1,
			championName: 1,
			summonerName: 1,
			position: 1,
			kills: 1,
			deaths: 1,
			assists: 1,
			runes: 1,
			items: 1,
			win: 1,
			gameEndedInEarlySurrender: 1,
			"teams.ally": {$map: {
	            input: "$teams.ally.picks",
	            as: "pick",
	            in: {
	                championName: "$$pick.championName",
	                position: "$$pick.position"
	            }
	        }},
			"teams.enemy": {$map: {
	            input: "$teams.enemy.picks",
	            as: "pick",
	            in: {
	                championName: "$$pick.championName",
	                position: "$$pick.position"
	            }
	        }}
		}},
		{$facet: {


			// Match History
			history: [
				{$limit: 20},
				{$project: {
					gameVersion: 1,
					gameTimestamp: 1,
					maxTimePlayed: 1,
					championName: 1,
					summonerName: 1,
					position: 1,
					teams: 1,
					items: 1,
					win: 1,
					gameEndedInEarlySurrender: 1,
					"runes.keystone": "$runes.primaryStyle.keystone.perk",
					"runes.styles": [
						"$runes.primaryStyle.slot1.perk",
						"$runes.primaryStyle.slot2.perk",
						"$runes.primaryStyle.slot3.perk",
						"$runes.subStyle.slot1.perk",
						"$runes.subStyle.slot2.perk"
					],
					"runes.stats": 1
				}}
			],

			// My Champions
			champions: [
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
					losses: {$subtract: ["$matches", "$wins"]},
					winrate: {$cond: [{$eq: ["$matches", 0]}, 0, {$divide: ["$wins", "$matches"]}]}
				}},
				// {$match: {$expr: {$gte: ["$matches", 3]}}},
				{$sort: {matches: -1, wins: -1}},
				{$limit: 6}
			],

			// "Losing To..."
			losingTo: [
				{$project: {
					enemy: "$teams.enemy",
					win: 1
				}},
				{$unwind: "$enemy"},
				{$set: {
					championName: "$enemy.championName",
				}},
				{$group: {
					_id: "$championName",
					wins: {$sum: {$cond: ["$win", 1, 0]}},
					matches: {$sum: 1}
				}},
				{$match: {$expr: {$gte: ["$matches", 3]}}},
				{$addFields: {
					losses: {$subtract: ["$matches", "$wins"]},
					winrate: {$cond: [{$eq: ["$matches", 0]}, 0, {$divide: ["$wins", "$matches"]}]}
				}},
				// {$match: {$expr: {$gt: ["$matches", 3]}}},
				{$match: {$and: [{$expr: {$gt: ["$matches", 3]}}, {$expr: {$lt: ["$winrate", 0.5]}}]}},
				{$sort: {winrate: 1, losses: -1, _id: 1}},
				{$limit: 4},
			]


		}}
	]
 	next()
}, query, (req, res, next) => {
	res.locals.history = res.locals.data[0].history.map(function(element, index) {
		return {
			summoner: element.summonerName,
			role: element.position,
			champion: element.championName,
			win: element.win,
			length: tools.gameLength(element.maxTimePlayed),
			version: element.gameVersion.substring(0, 5),
			// date: tools.formatDate(element.gameTimestamp),
			date: tools.formatDate(element.gameTimestamp) + " · " + tools.formatTime(element.gameTimestamp),
			keystone: element.runes.keystone.replaceAll(" ", ""),
			styles: element.runes.styles.map(function(element) { return element.replaceAll(" ", "").replaceAll(":", "") }),
			stats: tools.formatRuneStats(element.runes.stats),
			items: tools.formatItems(element.items),
			participants: tools.formatParticipants(element.teams),
			remake: element.gameEndedInEarlySurrender
		}
	})
	
	res.locals.champions = res.locals.data[0].champions.map(function(element, index) {
		return {
			champion: element._id,
			wins: element.wins,
			losses: element.losses,
			winrate: Math.round(element.winrate*100),
			played: element.matches,
			kda: ((element.kills + element.assists)/element.deaths).toFixed(2),
			kills: (element.kills/element.matches).toFixed(1),
			deaths: (element.deaths/element.matches).toFixed(1),
			assists: (element.assists/element.matches).toFixed(1)
		}
	})

	res.locals.matchups = res.locals.data[0].losingTo.map(function(element, index) {
		return {
			champion: element._id,
			wins: element.wins,
			losses: element.losses,
			winrate: Math.round(element.winrate*100),
			played: element.matches
		}
	})

	next()
}, (req, res) => {
	res.render("overview.ejs", {
		pageTitle: "Recent Overview"
	})
})





// Error Handling
app.use("/204", (req, res, next) => {
	res.locals.type = "NO CONTENT FOUND"
	res.locals.details = "No documents matched the query parameters."
	next()
})

app.use("/400", (req, res, next) => {
	res.locals.type = "BAD REQUEST"
	res.locals.details = "No query parameters given."
	next()
})

app.use("/404", (req, res, next) => {
	res.locals.type = "PAGE NOT FOUND"
	res.locals.details = "The requested URL does not exist on this server."
	next()
})

app.use((req, res, next) => {
	res.status(parseInt(req.originalUrl.replace("/", "")))
	next()
})

app.get(["/204", "/400", "/404"], (req, res) => {
	res.render("error.ejs", {
		statusCode: res.statusCode,
		statusType: res.locals.type,
		statusDetails: res.locals.details
	})
})

app.use("*", (req, res) => {
	res.status(404).redirect("/404")
})



app.listen(1111, () => {
	console.log("\nRooks.GG\nv1.1.0\n")
})