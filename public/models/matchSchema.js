const mongoose = require("mongoose")

// Teams
var teamParticipantSchema = new mongoose.Schema({
	championName: String,
	position: String,
	killParticipation: String, // undefined
	teamDamagePercentage: Number,
	cs: Number,
	goldEarned: Number
}, {versionKey: false})

var individualTeamSchema = new mongoose.Schema({
	// picks: Array,
	picks: [
		teamParticipantSchema
	],
	// picks: [teamParticipantSchema, teamParticipantSchema, teamParticipantSchema, teamParticipantSchema, teamParticipantSchema],
	bans: Array
}, {versionKey: false})

var teamsSchema = new mongoose.Schema({
	ally: individualTeamSchema,
	enemy: individualTeamSchema
}, {versionKey: false})



// Runes
var runeSlotSchema = new mongoose.Schema({
	perk: String,
	var1: Number,
	var2: Number,
	var3: Number
}, {versionKey: false})

var primaryStyleSchema = new mongoose.Schema({
	keystone: runeSlotSchema,
	slot1: runeSlotSchema,
	slot2: runeSlotSchema,
	slot3: runeSlotSchema
}, {versionKey: false})

var subStyleSchema = new mongoose.Schema({
	slot1: runeSlotSchema,
	slot2: runeSlotSchema
}, {versionKey: false})

var runeStatsSchema = new mongoose.Schema({
	offense: Number,
	flex: Number,
	defense: Number
}, {versionKey: false})

var runesSchema = new mongoose.Schema({
	primaryStyle: primaryStyleSchema,
	subStyle: subStyleSchema,
	stats: runeStatsSchema
}, {versionKey: false})



// Challenges
var challengesSchema = new mongoose.Schema({
	killParticipation: String, // undefined
	killsUnderOwnTurret: Number,
	soloKills: Number,
	outnumberedKills: Number,
	turretPlatesTaken: Number,
	teamDamagePercentage: Number,
	damageTakenOnTeamPercentage: Number,
	goldPerMinute: Number,
	maxLevelLeadLaneOpponent: String, // undefined
	dodgeSkillShotsSmallWindow: Number,
	skillshotsDodged: Number,
	skillshotsHit: Number
}, {versionKey: false})

var matchSchema = new mongoose.Schema({
	matchId: String,
	gameVersion: String,
	gameTimestamp: Date,
	gameLength: String,
	gameStartTimestamp: Number,
	maxTimePlayed: Number,
	gameDuration: Number,
	teams: teamsSchema,
	championName: String,
	summonerName: String,
	position: String,
	kills: Number,
	assists: Number,
	deaths: Number,
	totalMinionsKilled: Number,
	neutralMinionsKilled: Number,
	champLevel: Number,
	champExperience: Number,
	goldEarned: Number,
	spell1Casts: Number,
	spell2Casts: Number,
	spell3Casts: Number,
	spell4Casts: Number,
	summoner1Casts: Number,
	summoner1Id: Number,
	summoner2Casts: Number,
	summoner2Id: Number,
	runes: runesSchema,
	items: Array,
	itemsPurchased: Number,
	consumablesPurchased: Number,
	visionWardsBoughtInGame: Number,
	detectorWardsPlaced: Number,
	visionScore: Number,
	wardsKilled: Number,
	wardsPlaced: Number,
	turretKills: Number,
	turretTakedowns: Number,
	firstTowerAssist: Boolean,
	firstTowerKill: Boolean,
	damageDealtToBuildings: Number,
	damageDealtToObjectives: Number,
	damageDealtToTurrets: Number,
	magicDamageDealtToChampions: Number,
	physicalDamageDealtToChampions: Number,
	trueDamageDealtToChampions: Number,
	totalDamageDealtToChampions: Number,
	magicDamageTaken: Number,
	physicalDamageTaken: Number,
	trueDamageTaken: Number,
	totalDamageTaken: Number,
	damageSelfMitigated: Number,
	totalTimeCCDealt: Number,
	timeCCingOthers: Number,
	longestTimeSpentLiving: Number,
	totalTimeSpentDead: Number,
	timePlayed: Number,
	challenges: challengesSchema,
	teamEarlySurrendered: Boolean,
	gameEndedInEarlySurrender: Boolean,
	gameEndedInSurrender: Boolean,
	win: Boolean
}, {collection: "matches", versionKey: false})

module.exports = mongoose.model("art", matchSchema)