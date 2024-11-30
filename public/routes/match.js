const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

router.use(express.static("public"))

var dd = require("../data-dragon.js")
var tools = require("../tools.js")
var query = require("../controllers/query.js")


let participantsModel = require("../models/participant-schema.js")

const matchVars = JSON.parse(fs.readFileSync("./public/assets/data/match-vars.JSON", "utf8"))



// Live Game
router.get("/live-game", (req, res) => {
	res.render("live-game.ejs", {})
})



// Match Details
router.get("/details/:matchid", (req, res) => { res.redirect("/match/details") })

router.use("/details", (req, res, next) => {

	if (req.query.matchid === undefined) { req.query.matchid = "NA1_5134258009"}

	res.locals.aggregation = [
		{$match: 
			{"matchId": req.query.matchid}
		},
		{$limit: 1},
		{$lookup: {
			from: "match",
			let: {
				matchId: "$matchId"
			},
			pipeline: [
				{$match: {
					$expr: {
						$eq: [
							"$metadata.matchId",
							"$$matchId"
						]
					}
				}}
			],
			as: "player"
		}},
		{$project: {
			matchId: 1,
			participants: 1,
			player: { $arrayElemAt: ["$player", 0] }
		}},
		{$project: {
		  matchId: 1,
		  participants: 1,
		  player: 1,
		  metadata: "$player.metadata",
		  info: "$player.info",
		  gameDateTimestamp: "$player.gameDateTimestamp",
		  gameLength: "$player.gameLength"
		}},
		{$unset: [ "player.metadata", "player.info", "player.gameDateTimestamp", "player.gameLength" ]},
		{$project: {
		  matchId: 1,
		  participants: {
		  	$concatArrays: [
		  		"$participants",
		  		["$player"]
		  	]
		  },
		  metadata: 1,
		  info: 1,
		  gameDateTimestamp: 1,
		  gameLength: 1
		}}
	]
	
 	next()

}, (req, res, next) => {
	participantsModel.aggregate(res.locals.aggregation).exec((err, data) => {
		if (err) {
			next(err)
		} else {
			res.locals.data = data
			next()
		}
	})

}, (req, res, next) => {
	res.locals.data = res.locals.data[0]

	res.locals.data.participants = res.locals.data.participants.sort(function(a, b) {
		return a.participantId - b.participantId
	}).map(function(p) {
		p.champion = dd.champion(p.championName)
		p.summoner1 = dd.summoner(p.summoner1Id)
		p.summoner2 = dd.summoner(p.summoner2Id)
		// p.items = p.items.map(function(item) { return dd.item(item) })
		// p.runes = 
		return p
	})

	// .map(function(e, i) {

	// 	e.version = tools.version(e.gameVersion)
	// 	e.length = tools.gameLength(e.gameDuration)
	// 	e.gameDate = e.gameDateTimestamp.toLocaleDateString("en-US", {
	// 		timeZone: "America/New_York",
	// 		year: "numeric",
	// 		month: "short",
	// 		day: "numeric",
	// 		weekday: "short"
	// 	})
	// 	e.gameEnd = e.gameDateTimestamp.toLocaleTimeString("en-US", {
	// 		timeZone: "America/New_York",
	// 		hour: "numeric",
	// 		minute: "numeric"
	// 	})
	// 	e.gameStart = (new Date(e.gameStartTimestamp)).toLocaleTimeString("en-US", {
	// 		timeZone: "America/New_York",
	// 		hour: "numeric",
	// 		minute: "numeric"
	// 	})

	// 	return e
	// })

	next()
})


router.get("/details", (req, res) => {
	// res.send(res.locals.data)
	res.render("match-details.ejs", { matchVars })
})


module.exports = router