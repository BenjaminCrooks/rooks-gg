const mongoose = require("mongoose")

// Challenges
var challengesSchema = new mongoose.Schema({
	// 12AssistStreakCount: Number,
	InfernalScalePickup: Number,
	abilityUses: Number,
	acesBefore15Minutes: Number,
	alliedJungleMonsterKills: Number,
	baronTakedowns: Number,
	blastConeOppositeOpponentCount: Number,
	bountyGold: Number,
	buffsStolen: Number,
	completeSupportQuestInTime: Number,
	controlWardsPlaced: Number,
	damagePerMinute: Number,
	damageTakenOnTeamPercentage: Number,
	dancedWithRiftHerald: Number,
	deathsByEnemyChamps: Number,
	dodgeSkillShotsSmallWindow: Number,
	doubleAces: Number,
	dragonTakedowns: Number,
	earlyLaningPhaseGoldExpAdvantage: Number,
	effectiveHealAndShielding: Number,
	elderDragonKillsWithOpposingSoul: Number,
	elderDragonMultikills: Number,
	enemyChampionImmobilizations: Number,
	enemyJungleMonsterKills: Number,
	epicMonsterKillsNearEnemyJungler: Number,
	epicMonsterKillsWithin30SecondsOfSpawn: Number,
	epicMonsterSteals: Number,
	epicMonsterStolenWithoutSmite: Number,
	firstTurretKilled: Number,
	firstTurretKilledTime: Number,
	fistBumpParticipation: Number,
	flawlessAces: Number,
	fullTeamTakedown: Number,
	gameLength: Number,
	getTakedownsInAllLanesEarlyJungleAsLaner: Number,
	goldPerMinute: Number,
	hadOpenNexus: Number,
	highestChampionDamage: Number,
	immobilizeAndKillWithAlly: Number,
	initialBuffCount: Number,
	initialCrabCount: Number,
	jungleCsBefore10Minutes: Number,
	junglerTakedownsNearDamagedEpicMonster: Number,
	kTurretsDestroyedBeforePlatesFall: Number,
	kda: Number,
	killAfterHiddenWithAlly: Number,
	killParticipation: Number,
	killedChampTookFullTeamDamageSurvived: Number,
	killingSprees: Number,
	killsNearEnemyTurret: Number,
	killsOnOtherLanesEarlyJungleAsLaner: Number,
	killsOnRecentlyHealedByAramPack: Number,
	killsUnderOwnTurret: Number,
	killsWithHelpFromEpicMonster: Number,
	knockEnemyIntoTeamAndKill: Number,
	landSkillShotsEarlyGame: Number,
	laneMinionsFirst10Minutes: Number,
	laningPhaseGoldExpAdvantage: Number,
	legendaryCount: Number,
	legendaryItemUsed: Array,
	lostAnInhibitor: Number,
	maxCsAdvantageOnLaneOpponent: Number,
	maxKillDeficit: Number,
	maxLevelLeadLaneOpponent: Number,
	mejaisFullStackInTime: Number,
	moreEnemyJungleThanOpponent: Number,
	multiKillOneSpell: Number,
	multiTurretRiftHeraldCount: Number,
	multikills: Number,
	multikillsAfterAggressiveFlash: Number,
	outerTurretExecutesBefore10Minutes: Number,
	outnumberedKills: Number,
	outnumberedNexusKill: Number,
	perfectDragonSoulsTaken: Number,
	perfectGame: Number,
	pickKillWithAlly: Number,
	playedChampSelectPosition: Number,
	poroExplosions: Number,
	quickCleanse: Number,
	quickFirstTurret: Number,
	quickSoloKills: Number,
	riftHeraldTakedowns: Number,
	saveAllyFromDeath: Number,
	scuttleCrabKills: Number,
	skillshotsDodged: Number,
	skillshotsHit: Number,
	snowballsHit: Number,
	soloBaronKills: Number,
	soloKills: Number,
	soloTurretsLategame: Number,
	stealthWardsPlaced: Number,
	survivedSingleDigitHpCount: Number,
	survivedThreeImmobilizesInFight: Number,
	takedownOnFirstTurret: Number,
	takedowns: Number,
	takedownsAfterGainingLevelAdvantage: Number,
	takedownsBeforeJungleMinionSpawn: Number,
	takedownsFirstXMinutes: Number,
	takedownsInAlcove: Number,
	takedownsInEnemyFountain: Number,
	teamBaronKills: Number,
	teamDamagePercentage: Number,
	teamElderDragonKills: Number,
	teamRiftHeraldKills: Number,
	tookLargeDamageSurvived: Number,
	turretPlatesTaken: Number,
	turretTakedowns: Number,
	turretsTakenWithRiftHerald: Number,
	twentyMinionsIn3SecondsCount: Number,
	twoWardsOneSweeperCount: Number,
	unseenRecalls: Number,
	visionScoreAdvantageLaneOpponent: Number,
	visionScorePerMinute: Number,
	voidMonsterKill: Number,
	wardTakedowns: Number,
	wardTakedownsBefore20M: Number,
	wardsGuarded: Number
}, {versionKey: false})



// Perks
var statPerksSchema = new mongoose.Schema({
	defense: Number,
	flex: Number,
	offense: Number
}, {versionKey: false})

var selectionSchema = new mongoose.Schema({
	perk: Number,
	var1: Number,
	var2: Number,
	var3: Number
}, {versionKey: false})

var styleTypeSchema = new mongoose.Schema({
	description: String,
	selections: [
		selectionSchema
	],
	style: Number
}, {versionKey: false})

var stylesSchema = new mongoose.Schema({
	primaryStyle: styleTypeSchema,
	subStyle: styleTypeSchema
}, {versionKey: false})

var perksSchema = new mongoose.Schema({
	statPerks: statPerksSchema,
	styles: stylesSchema
}, {versionKey: false})



// Metadata
var metadataSchema = new mongoose.Schema({
	dataVersion: Number,
	matchId: String,
	participants: Array
}, {versionKey: false})


// Info
var participantSchema = new mongoose.Schema({
	dataVersion: Number,
	matchId: String,
	participants: Array
}, {versionKey: false})

var banSchema = new mongoose.Schema({
	championId: Number,
	pickTurn: Number
}, {versionKey: false})

var objValueSchema = new mongoose.Schema({
	first: Boolean,
	kills: Number
}, {versionKey: false})

var objectiveSchema = new mongoose.Schema({
	baron: objValueSchema,
	champion: objValueSchema,
	dragon: objValueSchema,
	horde: objValueSchema,
	inhibitor: objValueSchema,
	riftHerald: objValueSchema,
	tower: objValueSchema
}, {versionKey: false})

var teamSchema = new mongoose.Schema({
	bans: [
		banSchema
	],
	objectives: objectiveSchema,
	teamId: Number,
	win: Boolean
}, {versionKey: false})

var infoSchema = new mongoose.Schema({
	endOfGameResult: String,
	gameCreation: Number,
	gameDuration: Number,
	gameEndTimestamp: Number,
	gameId: Number,
	gameMode: String,
	gameName: String,
	gameStartTimestamp: Number,
	gameType: String,
	gameVersion: String,
	mapId: Number,
	participants: participantSchema,
	platformId: String,
	queueId: Number,
	teams: [
		teamSchema
	],
	tournamentCode: String
}, {versionKey: false})


// Game Length Delta
var gameLengthSchema = new mongoose.Schema({
	h: Number,
	m: Number,
	s: Number
}, {versionKey: false})



var matchSchema = new mongoose.Schema({
	allInPings: Number,
	assistMePings: Number,
	assists: Number,
	baronKills: Number,
	basicPings: Number,
	bountyLevel: Number,
	challenges: challengesSchema,
	champExperience: Number,
	champLevel: Number,
	championId: Number,
	championName: String,
	championTransform: Number,
	commandPings: Number,
	consumablesPurchased: Number,
	damageDealtToBuildings: Number,
	damageDealtToObjectives: Number,
	damageDealtToTurrets: Number,
	damageSelfMitigated: Number,
	dangerPings: Number,
	deaths: Number,
	detectorWardsPlaced: Number,
	doubleKills: Number,
	dragonKills: Number,
	eligibleForProgression: Boolean,
	enemyMissingPings: Number,
	enemyVisionPings: Number,
	firstBloodAssist: Boolean,
	firstBloodKill: Boolean,
	firstTowerAssist: Boolean,
	firstTowerKill: Boolean,
	gameEndedInEarlySurrender: Boolean,
	gameEndedInSurrender: Boolean,
	getBackPings: Number,
	goldEarned: Number,
	goldSpent: Number,
	holdPings: Number,
	individualPosition: String,
	inhibitorKills: Number,
	inhibitorTakedowns: Number,
	inhibitorsLost: Number,
	item0: Number,
	item1: Number,
	item2: Number,
	item3: Number,
	item4: Number,
	item5: Number,
	item6: Number,
	itemsPurchased: Number,
	killingSprees: Number,
	kills: Number,
	lane: String,
	largestCriticalStrike: Number,
	largestKillingSpree: Number,
	largestMultiKill: Number,
	longestTimeSpentLiving: Number,
	magicDamageDealt: Number,
	magicDamageDealtToChampions: Number,
	magicDamageTaken: Number,
	needVisionPings: Number,
	neutralMinionsKilled: Number,
	nexusKills: Number,
	nexusLost: Number,
	nexusTakedowns: Number,
	objectivesStolen: Number,
	objectivesStolenAssists: Number,
	onMyWayPings: Number,
	participantId: Number,
	pentaKills: Number,
	perks: perksSchema,
	physicalDamageDealt: Number,
	physicalDamageDealtToChampions: Number,
	physicalDamageTaken: Number,
	profileIcon: Number,
	pushPings: Number,
	puuid: String,
	quadraKills: Number,
	riotIdGameName: String,
	riotIdTagline: String,
	role: String,
	sightWardsBoughtInGame: Number,
	spell1Casts: Number,
	spell2Casts: Number,
	spell3Casts: Number,
	spell4Casts: Number,
	summoner1Casts: Number,
	summoner1Id: Number,
	summoner2Casts: Number,
	summoner2Id: Number,
	summonerId: String,
	summonerLevel: Number,
	summonerName: String,
	teamEarlySurrendered: Boolean,
	teamId: Number,
	teamPosition: String,
	timeCCingOthers: Number,
	timePlayed: Number,
	totalAllyJungleMinionsKilled: Number,
	totalDamageDealt: Number,
	totalDamageDealtToChampions: Number,
	totalDamageShieldedOnTeammates: Number,
	totalDamageTaken: Number,
	totalEnemyJungleMinionsKilled: Number,
	totalHeal: Number,
	totalHealsOnTeammates: Number,
	totalMinionsKilled: Number,
	totalTimeCCDealt: Number,
	totalTimeSpentDead: Number,
	totalUnitsHealed: Number,
	tripleKills: Number,
	trueDamageDealt: Number,
	trueDamageDealtToChampions: Number,
	trueDamageTaken: Number,
	turretKills: Number,
	turretTakedowns: Number,
	turretsLost: Number,
	unrealKills: Number,
	visionClearedPings: Number,
	visionScore: Number,
	visionWardsBoughtInGame: Number,
	wardsKilled: Number,
	wardsPlaced: Number,
	win: Boolean,
	position: String,
	metadata: metadataSchema,
	info: infoSchema,
	gameDateTimestamp: Date,
	gameLength: gameLengthSchema,
	items: [Number]
}, {collection: "match", versionKey: false})

module.exports = mongoose.model("matches", matchSchema)