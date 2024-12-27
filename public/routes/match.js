const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

router.use(express.static("public"))

var dd = require("../data-dragon.js")
var tools = require("../tools.js")
var { liveGame, league } = require("../controllers/axios.js")


let participantsModel = require("../models/participant-schema.js")

const matchVars = JSON.parse(fs.readFileSync("./public/assets/data/match-vars.JSON", "utf8"))




router.get("/live-game", (req, res) => {
	res.render("partials/player-search.ejs", {})
})


var liveData = {
	info: {
		// dummy gameId
		gameId: 1111111111
	}
}

router.get("/live-game/:gameName/:tagLine",
liveGame,
async (req, res, next) => {
	if (res.locals.info.gameId === liveData.info.gameId) {
		console.log(`Data reused: ${liveData.account.gameName}#${liveData.account.tagLine}\t${liveData.info.gameId}`)
		res.locals = liveData
		next()
	} else {
		const requests = await Promise.all(
			res.locals.participants.map(async function(player) {
				return league(player)
			})
		)

		res.locals.participants = requests.map(function(response, index) {
			const player = res.locals.participants[index]
			const rankedSolo = response.filter(league => {
				return league.queueType === "RANKED_SOLO_5x5"
			})

			if (rankedSolo.length > 0) {
				const league = rankedSolo.at(0)
				player.league = {
					tier: league.tier.charAt(0).toUpperCase() + league.tier.substring(1).toLowerCase(),
					img: path.join("/assets/icons/svgs/rank", league.tier.toLowerCase() + ".svg").replace(/\\/g,"/"),
					rank: league.rank,
					leaguePoints: league.leaguePoints,
					wins: league.wins,
					losses: league.losses,
					played: league.wins+league.losses,
					winrate: tools.winRate((league.wins/(league.wins+league.losses))*100),
					veteran: league.veteran,
					inactive: league.inactive,
					freshBlood: league.freshBlood,
					hotStreak: league.hotStreak
				}
			} else {
				player.league = null
			}

			// return player

			const runes = {
				keystone: dd.rune(player.perks.perkIds.shift()),
				styles: player.perks.perkIds.toSpliced(5, 3).map(function(styleId) {
					return dd.rune(styleId)
				}),
				stats: player.perks.perkIds.toSpliced(0, 5).map(function(statId) {
					return dd.statmod(statId)
				})
			}

			return {
				teamId: player.teamId,
				profileIconId: player.profileIconId,
				puuid: player.puuid,
				summonerId: player.summonerId,
				riotId: player.riotId,
				gameName: player.riotId.split("#").at(0),
				tagLine: player.riotId.split("#").at(1),
				opgg: `https://www.op.gg/summoners/na/${player.riotId.replace("#", "-").replaceAll(" ", "%20")}`,
				spell1: dd.summoner(player.spell1Id),
				spell2: dd.summoner(player.spell2Id),
				champion: dd.champion(player.championId),
				runes,
				league: player.league
			}
		})

		// Match Info
		// res.locals.info.gameLength
		res.locals.info.map = dd.maps(res.locals.info.mapId)
		res.locals.info.queue = dd.queue(res.locals.info.gameQueueConfigId)

		// Bans
		res.locals.bans.bannedChampions.forEach(function(ban) {
			res.locals.bans[ban.teamId.toString()].push({
				pickTurn: ban.pickTurn,
				champion: dd.champion(ban.championId)
			})
		})

		next()
	}
}, (req, res) => {
	liveData = res.locals
	res.render("live-game.ejs", res.locals)
})

router.get("/live-game/:gameName/:tagLine", (req, res) => {
	res.send(res.locals)
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

	next()
})


router.get("/details", (req, res) => {
	res.render("match-details.ejs", { matchVars })
})


module.exports = router