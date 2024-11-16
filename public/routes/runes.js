const express = require("express")
const router = express.Router()

router.use(express.static("public"))

var dd = require("../data-dragon.js")
var tools = require("../tools.js")
var query = require("../controllers/query.js")


router.use("/value-compare", (req, res, next) => {

	if (req.query.champion === undefined) { req.query.champion = "Anivia" }
	if (req.query.datatype === undefined) { req.query.datatype = "damage" }

	if (req.query.rune === undefined) {
		req.query.rune = [8014, 8017, 8299]
	} else if (typeof req.query.rune === "string") {
		req.query.rune = [Number(req.query.rune)]
	}

	req.query.rune = req.query.rune.map(function(rune) {
		rune = dd.rune(rune)
		return rune.id
	}).filter(function(rune) {
		return rune != undefined
	})

	console.log(req.query) // ★ ────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────── ★

	res.locals.queryMatch = [
		{championName: new RegExp(req.query.champion, "i")},

		{$expr: {$anyElementTrue: {
			$map: {
				input: {$concatArrays: [
					{$map: {
						input: "$perks.styles.primaryStyle.selections",
						as: "style",
						in: "$$style.perk"
			        }},
			      	{$map: {
						input: "$perks.styles.subStyle.selections",
						as: "style",
						in: "$$style.perk"
			        }}
			    ]},
				as: "perk",
				in: {$in: [
					"$$perk",
					req.query.rune // ★ ──────────────────────────────────────────────────────────────────────────────────── ★
				]}
			}
		}}}
	]
 
	res.locals.aggregation = [
		{$project: {
			matchId: "$metadata.matchId",
			gameDateTimestamp: 1,
			gameDuration: "$info.gameDuration",
			gameLength: 1,
			championName: 1,
			win: 1,

			totalDamageDealtToChampions: 1,
			goldEarned: 1,

			perk: {$filter: {
				input: {$concatArrays: [
					"$perks.styles.primaryStyle.selections",
					"$perks.styles.subStyle.selections"
				]},
				as: "rune",
				cond: {$in: [
					"$$rune.perk",
					req.query.rune // ★ ──────────────────────────────────────────────────────────────────────────────────── ★
				]}
			}}
		}},

		{$sort: {gameDateTimestamp: -1}},

		{$unwind: "$perk"},

		{$addFields: {
			damage: "$perk.var1",
			dmgMin: {$round: [{$divide: ["$perk.var1", {$divide: ["$gameDuration", 60]}]}, 2]},
			percentTotalDmg: {$round: [{$multiply: [{$divide: ["$perk.var1", "$totalDamageDealtToChampions"]}, 100]}, 2]}
			// percentTotalGold: {$round: [{$multiply: [{$divide: ["$var2", "$goldEarned"]}, 100]}, 0]}
		}},

		{$facet: {

			// Rune stat summary ★ ──────────────────────────────────────────────────────────────────────────────────── ★
			summary: [
				{$group: {
					_id: "$perk.perk",
					avgDmgMin: {$avg: "$dmgMin"},
					avgDmg: {$avg: "$perk.var1"},
					avgPercentTotal: {$avg: "$percentTotalDmg"},
					avgDuration: {$avg: "$gameDuration"},
					wins: {$sum: {$cond: ["$win", 1, 0]}},
					matches: {$sum: 1}
				}},
				{$addFields: {
					winrate: {$round: [{$multiply: [{$divide: ["$wins", "$matches"]}, 100]}, 0]},
					losses: {$subtract: ["$matches", "$wins"]}
				}},
				{$set: {
					perk: "$_id",
					avgDmgMin: {$round: ["$avgDmgMin", 1]},
					avgDmg: {$round: ["$avgDmg", 1]},
					avgPercentTotal: {$round: ["$avgPercentTotal", 2]},
					avgDuration: {$round: ["$avgDuration", 0]}
				}},
				{$sort: {winrate: -1, avgDmgMin: -1}}
			],

			// History of matches ★ ──────────────────────────────────────────────────────────────────────────────────── ★
			history: [
				{$sort: {gameDateTimestamp: -1}}
			]

		}}
	]

	// default to 20 if match count not given
	if (req.query.matches == undefined) { res.locals.aggregation.splice(2, 0, {$limit: 20}) }
	
 	next()
}, query, (req, res, next) => {
	res.locals.matches = res.locals.data[0].history.map(function(match) {
		match.champion = dd.champion(match.championName)
		match.vars = match.perk
		match.perk = dd.rune(match.perk.perk)
		match.gameDuration = tools.gameLength(match.gameDuration)
		if (match.win) { match.outcome = "Victory" } else { match.outcome = "Defeat" }
		return match
	})

	res.locals.summary = res.locals.data[0].summary.map(function(e) {
		e.perk = dd.rune(e.perk)
		e.avgDuration = tools.gameLength(e.avgDuration)
		return e
	})

	next()
})


router.get("/value-compare", (req, res) => {
	// res.send(res.locals.data[0])
	res.render("table-runes.ejs", {
		runeArray: dd.runeData,
		checked: req.query.rune,
		enabled: [ 8112, 8126, 8369, 8014, 8017, 8299, 8214, 8229, 8237 ]
	})
})


module.exports = router