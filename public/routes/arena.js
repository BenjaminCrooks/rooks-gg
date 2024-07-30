const express = require("express")
const router = express.Router()

router.use(express.static("public"))



// Augments Router
const augments = require("express").Router()
router.use("/augments", augments)
augments.use(express.static("public"))

// augments.use("/CHAMPION", (req, res, next) => {
// 	res.locals.champion = "CHAMPION"

// 	res.locals.silver = []
// 	res.locals.gold = []
// 	res.locals.prismatic = []

// 	res.locals.early = []
//  	next()
// })

augments.use("/anivia", (req, res, next) => {
	res.locals.champion = "Anivia"

	res.locals.silver = ["Witchful Thinking", "Don't Blink", "ADAPt", "Contract Killer", "Executioner", "Slap Around", "Mind to Matter", "Ice Cold", "Ultimate Unstoppable", "Homeguard", "Erosion", "Dematerialize", "Infernal Soul", "Goredrink", "Tormentor", "Vulnerability", "Buff Buddies", "Warmup Routine", "Flashy", "Juice Box", "Ocean Soul", "Fallen Aegis", "Frost Wraith", "Repulsor", "Serve Beyond Death", "Guilty Pleasure", "Mirror Image", "Flashbang", "Clothesline", "Self Destruct", "Snowball Fight!", "Hold Very Still", "Castle", "Frozen Foundations", "Heavy Hitter", "Mountain Soul", "Tank It Or Leave It", "Deft", "Light 'em Up!", "Typhoon", "Scoped Weapons", "First-Aid Kit", "Sonic Boom", "Fully Automated"]
	res.locals.gold = ["Magic Missile", "Bread And Cheese", "Recursion", "Bread And Butter", "It's Killing Time", "Marksmage", "Combo Master", "Keystone Conjurer", "Big Brain", "With Haste", "Thread the Needle", "Bread And Jam", "Restart", "Phenomenal Evil", "Skilled Sniper", "OK Boomerang", "Vanish", "Vengeance", "Restless Restoration", "Perseverance", "Rabble Rousing", "Celestial Body", "Die Another Day", "Apex Inventor", "Quest Urf's Champion", "From Beginning to End", "It's Critical", "Searing Dawn", "Parasitic Relationship", "Minionmancer", "Oathsworn", "Holy Fire", "Impassable", "Dive Bomber", "Ethereal Weapon", "Extendo-Arm", "Banner of Command", "Cannon Fodder", "Willing Sacrifice", "Soul Siphon", "Quest Steel Your Heart", "Demon's Dance", "Scopier Weapons", "Twice Thrice", "Shrink Ray", "Firebrand", "Quest Angel of Retribution", "Critical Healing", "Dawnbringer's Resolve", "Defensive Maneuvers", "All For You"]
	res.locals.prismatic = ["Jeweled Gauntlet", "Spellwake", "Trueshot Prodigy", "Quest Wooglet's Witchcap", "Fey Magic", "Wisdom of Ages", "Infernal Conduit", "Eureka", "Accelerating Sorcery", "Orbital Laser", "Can't Touch This", "Feel the Burn", "Center of the Universe", "Chain Lightning", "Giant Slayer", "Goliath", "Omni Soul", "Blade Waltz", "Summoner's Roulette", "Gamba Anvil", "Courage of the Colossus", "Laser Eyes", "Mad Scientist", "Master of Duality", "Mystic Punch", "Quantum Computing", "Raid Boss", "Scopiest Weapons", "Slow Cooker", "Spirit Link", "Symphony of War", "Tap Dancer", "Chauffeur", "Circle of Death", "Back To Basics"]

	res.locals.early = ["Witchful Thinking", "Contract Killer", "Slap Around", "Dematerialize", "Infernal Soul", "Tormentor", "Buff Buddies", "Warmup Routine", "Juice Box", "Ocean Soul", "Guilty Pleasure", "Magic Missile", "Bread And Cheese", "Recursion", "Bread And Butter", "Marksmage", "Keystone Conjurer", "Phenomenal Evil", "Restless Restoration", "Perseverance", "Quest Urf's Champion", "From Beginning to End", "Spellwake", "Trueshot Prodigy", "Quest Wooglet's Witchcap", "Wisdom of Ages", "Infernal Conduit", "Orbital Laser", "Center of the Universe", "Chain Lightning", "Goliath"]
 	next()
})

augments.use("/vex", (req, res, next) => {
	res.locals.champion = "Vex"

	res.locals.silver = ["Witchful Thinking", "Flashbang", "ADAPt", "Slap Around", "Dematerialize", "Executioner", "Contract Killer", "Mind to Matter", "Flashy", "Buff Buddies", "Homeguard", "Erosion", "Infernal Soul", "Ice Cold", "Ocean Soul", "Tormentor", "Goredrink", "Juice Box", "Snowball Fight!", "Warmup Routine", "Ultimate Unstoppable", "Serve Beyond Death", "Repulsor", "Fallen Aegis", "Mirror Image", "Frost Wraith", "Don't Blink", "Mountain Soul", "Clothesline", "Self Destruct", "Sonic Boom", "Vulnerability", "Heavy Hitter", "Guilty Pleasure", "Tank It Or Leave It", "Typhoon", "Light 'em Up!", "Deft", "Scoped Weapons", "First-Aid Kit", "Frozen Foundations", "Fully Automated", "Hold Very Still", "Castle"]
	res.locals.gold = ["Holy Fire", "Bread And Butter", "Bread And Cheese", "Recursion", "Magic Missile", "Marksmage", "Big Brain", "Bread And Jam", "Restart", "Thread the Needle", "Combo Master", "With Haste", "It's Killing Time", "Skilled Sniper", "Keystone Conjurer", "Phenomenal Evil", "From Beginning to End", "OK Boomerang", "Quest Urf's Champion", "Die Another Day", "Perseverance", "Restless Restoration", "Apex Inventor", "Vanish", "Vengeance", "Celestial Body", "Dive Bomber", "Impassable", "It's Critical", "Oathsworn", "Parasitic Relationship", "Rabble Rousing", "Ethereal Weapon", "Searing Dawn", "Cannon Fodder", "Shrink Ray", "Twice Thrice", "Scopier Weapons", "Firebrand", "Soul Siphon", "Quest Steel Your Heart", "Willing Sacrifice", "Demon's Dance", "Dawnbringer's Resolve", "Defensive Maneuvers", "Quest Angel of Retribution", "All For You", "Critical Healing", "Banner of Command", "Minionmancer", "Extendo-Arm"]
	res.locals.prismatic = ["Quest Wooglet's Witchcap", "Jeweled Gauntlet", "Spellwake", "Eureka", "Accelerating Sorcery", "Trueshot Prodigy", "Infernal Conduit", "Center of the Universe", "Giant Slayer", "Feel the Burn", "Fey Magic", "Chain Lightning", "Orbital Laser", "Wisdom of Ages", "Omni Soul", "Goliath", "Mystic Punch", "Master of Duality", "Blade Waltz", "Gamba Anvil", "Can't Touch This", "Quantum Computing", "Summoner's Roulette", "Courage of the Colossus", "Laser Eyes", "Mad Scientist", "Raid Boss", "Scopiest Weapons", "Slow Cooker", "Spirit Link", "Symphony of War", "Tap Dancer", "Chauffeur", "Circle of Death", "Back To Basics"]

	res.locals.early = ["Witchful Thinking", "Flashbang", "Slap Around", "Dematerialize", "Executioner", "Contract Killer", "Infernal Soul", "Ocean Soul", "Juice Box", "Warmup Routine", "Holy Fire", "Bread And Butter", "Bread And Cheese", "Recursion", "Magic Missile", "Marksmage", "Bread And Jam", "Restart", "Keystone Conjurer", "Phenomenal Evil", "From Beginning to End", "Quest Urf's Champion", "Perseverance", "Quest Wooglet's Witchcap", "Spellwake", "Trueshot Prodigy", "Center of the Universe", "Wisdom of Ages"]
 	next()
})

augments.use("/ziggs", (req, res, next) => {
	res.locals.champion = "Ziggs"

	res.locals.silver = ["Witchful Thinking", "ADAPt", "Executioner", "Contract Killer", "Slap Around", "Ice Cold", "Mind to Matter", "Homeguard", "Goredrink", "Serve Beyond Death", "Dematerialize", "Infernal Soul", "Ocean Soul", "Buff Buddies", "Erosion", "Don't Blink", "Tormentor", "Guilty Pleasure", "Warmup Routine", "Flashy", "Flashbang", "Juice Box", "Fallen Aegis", "Repulsor", "Mirror Image", "Clothesline", "Mountain Soul", "Ultimate Unstoppable", "Castle", "Fully Automated", "Frost Wraith", "Frozen Foundations", "Hold Very Still", "Vulnerability", "Scoped Weapons", "Deft", "Light 'em Up!", "Typhoon", "Self Destruct", "Tank It Or Leave It", "Heavy Hitter", "Snowball Fight!", "First-Aid Kit", "Sonic Boom"]
	res.locals.gold = ["Ethereal Weapon", "Bread And Butter", "Magic Missile", "Marksmage", "Recursion", "Bread And Cheese", "Keystone Conjurer", "Big Brain", "Bread And Jam", "Thread the Needle", "With Haste", "From Beginning to End", "Skilled Sniper", "Rabble Rousing", "Phenomenal Evil", "Restart", "OK Boomerang", "Perseverance", "Restless Restoration", "Dawnbringer's Resolve", "Defensive Maneuvers", "Vengeance", "Celestial Body", "Die Another Day", "It's Killing Time", "Apex Inventor", "Quest Urf's Champion", "Parasitic Relationship", "Banner of Command", "Cannon Fodder", "Combo Master", "Dive Bomber", "It's Critical", "Quest Steel Your Heart", "Searing Dawn", "Vanish", "Impassable", "Oathsworn", "Shrink Ray", "Scopier Weapons", "Extendo-Arm", "Demon's Dance", "Firebrand", "Soul Siphon", "Twice Thrice", "Willing Sacrifice", "Quest Angel of Retribution", "Holy Fire", "All For You", "Critical Healing", "Minionmancer"]
	res.locals.prismatic = ["Quest Wooglet's Witchcap", "Jeweled Gauntlet", "Spellwake", "Infernal Conduit", "Accelerating Sorcery", "Eureka", "Trueshot Prodigy", "Chain Lightning", "Giant Slayer", "Wisdom of Ages", "Feel the Burn", "Center of the Universe", "Fey Magic", "Omni Soul", "Gamba Anvil", "Goliath", "Master of Duality", "Orbital Laser", "Summoner's Roulette", "Blade Waltz", "Quantum Computing", "Mad Scientist", "Back To Basics", "Can't Touch This", "Laser Eyes", "Mystic Punch", "Chauffeur", "Courage of the Colossus", "Slow Cooker", "Raid Boss", "Scopiest Weapons", "Tap Dancer", "Symphony of War", "Circle of Death", "Spirit Link"]

	res.locals.early = ["Witchful Thinking", "Executioner", "Contract Killer", "Slap Around", "Dematerialize", "Infernal Soul", "Ocean Soul", "Buff Buddies", "Warmup Routine", "Juice Box", "Ethereal Weapon", "Bread And Butter", "Magic Missile", "Marksmage", "Recursion", "Bread And Cheese", "Keystone Conjurer", "Bread And Jam", "From Beginning to End", "Phenomenal Evil", "Perseverance", "Restless Restoration", "Quest Urf's Champion", "Quest Wooglet's Witchcap", "Spellwake", "Infernal Conduit", "Accelerating Sorcery", "Trueshot Prodigy", "Chain Lightning", "Wisdom of Ages", "Center of the Universe"]
 	next()
})

augments.use("/hwei", (req, res, next) => {
	res.locals.champion = "Hwei"

	res.locals.silver = ["Witchful Thinking", "Flashbang", "ADAPt", "Slap Around", "Dematerialize", "Executioner", "Contract Killer", "Mind to Matter", "Flashy", "Buff Buddies", "Homeguard", "Erosion", "Infernal Soul", "Ice Cold", "Ocean Soul", "Tormentor", "Goredrink", "Juice Box", "Snowball Fight!", "Warmup Routine", "Ultimate Unstoppable", "Serve Beyond Death", "Repulsor", "Fallen Aegis", "Mirror Image", "Frost Wraith", "Don't Blink", "Mountain Soul", "Clothesline", "Self Destruct", "Sonic Boom", "Vulnerability", "Heavy Hitter", "Guilty Pleasure", "Tank It Or Leave It", "Typhoon", "Light 'em Up!", "Deft", "Scoped Weapons", "First-Aid Kit", "Frozen Foundations", "Fully Automated", "Hold Very Still", "Castle"]
	res.locals.gold = ["Bread And Butter", "Bread And Cheese", "Recursion", "Magic Missile", "Marksmage", "Big Brain", "Bread And Jam", "Restart", "Thread the Needle", "Combo Master", "With Haste", "It's Killing Time", "Skilled Sniper", "Keystone Conjurer", "Phenomenal Evil", "From Beginning to End", "OK Boomerang", "Quest Urf's Champion", "Holy Fire", "Die Another Day", "Perseverance", "Restless Restoration", "Apex Inventor", "Vanish", "Vengeance", "Celestial Body", "Dive Bomber", "Impassable", "It's Critical", "Oathsworn", "Parasitic Relationship", "Rabble Rousing", "Ethereal Weapon", "Searing Dawn", "Cannon Fodder", "Shrink Ray", "Twice Thrice", "Scopier Weapons", "Firebrand", "Soul Siphon", "Quest Steel Your Heart", "Willing Sacrifice", "Demon's Dance", "Dawnbringer's Resolve", "Defensive Maneuvers", "Quest Angel of Retribution", "All For You", "Critical Healing", "Banner of Command", "Minionmancer", "Extendo-Arm"]
	res.locals.prismatic = ["Quest Wooglet's Witchcap", "Jeweled Gauntlet", "Spellwake", "Eureka", "Accelerating Sorcery", "Trueshot Prodigy", "Infernal Conduit", "Center of the Universe", "Giant Slayer", "Feel the Burn", "Fey Magic", "Chain Lightning", "Orbital Laser", "Wisdom of Ages", "Omni Soul", "Goliath", "Mystic Punch", "Master of Duality", "Blade Waltz", "Gamba Anvil", "Can't Touch This", "Quantum Computing", "Summoner's Roulette", "Courage of the Colossus", "Laser Eyes", "Mad Scientist", "Raid Boss", "Scopiest Weapons", "Slow Cooker", "Spirit Link", "Symphony of War", "Tap Dancer", "Chauffeur", "Circle of Death", "Back To Basics"]

	res.locals.early = ["Witchful Thinking", "Flashbang", "Slap Around", "Dematerialize", "Executioner", "Contract Killer", "Infernal Soul", "Ocean Soul", "Juice Box", "Warmup Routine", "Holy Fire", "Bread And Butter", "Bread And Cheese", "Recursion", "Magic Missile", "Marksmage", "Bread And Jam", "Restart", "Keystone Conjurer", "Phenomenal Evil", "From Beginning to End", "Quest Urf's Champion", "Perseverance", "Quest Wooglet's Witchcap", "Spellwake", "Trueshot Prodigy", "Center of the Universe", "Wisdom of Ages"]
 	next()
})

augments.use("/ashe", (req, res, next) => {
	res.locals.champion = "Ashe"

	res.locals.silver = ["Deft", "Scoped Weapons", "Blunt Force", "Light 'em Up!", "Ice Cold","Typhoon", "Vulnerability", "Goredrink", "Serve Beyond Death", "Executioner", "Contract Killer", "Dematerialize", "Infernal Soul", "Flashy", "Don't Blink", "Fallen Aegis", "Tank It Or Leave It", "Ocean Soul", "Juice Box", "escAPADe", "Repulsor", "Mind to Matter", "Homeguard", "Flashbang", "Frozen Foundations", "Erosion", "Heavy Hitter", "Buff Buddies", "Warmup Routine", "Mirror Image", "Mountain Soul", "Now You See Me", "Hold Very Still", "Frost Wraith", "Ultimate Unstoppable", "Don't Chase", "Self Destruct", "Snowball Fight!", "Shadow Runner", "Clothesline", "Castle", "Slap Around", "Tormentor", "Guilty Pleasure", "Fully Automated", "First-Aid Kit", "Witchful Thinking"]
	res.locals.gold = ["Scopier Weapons", "Lightning Strikes", "Twice Thrice", "Shrink Ray", "Soul Siphon", "It's Critical", "Firebrand", "Demon's Dance", "Thread the Needle", "The Brutalizer", "Dawnbringer's Resolve", "From Beginning to End", "Impassable", "Dive Bomber", "OK Boomerang", "With Haste", "Vengeance", "Quest Urf's Champion", "Perseverance", "Bread And Cheese", "Die Another Day", "Defensive Maneuvers", "Parasitic Relationship", "Combo Master", "Outlaw's Grit", "Vanish", "It's Killing Time", "Celestial Body", "Searing Dawn", "Skilled Sniper", "Banner of Command", "Apex Inventor", "Bread And Jam", "Critical Healing", "Extendo-Arm", "Bread And Butter", "Oathsworn", "Magic Missile", "Recursion", "Restless Restoration", "Cannon Fodder", "All For You", "Keystone Conjurer", "Willing Sacrifice", "Ethereal Weapon", "Restart", "Rabble Rousing", "Phenomenal Evil", "Minionmancer", "Quest Steel Your Heart", "Quest Angel of Retribution", "Holy Fire"]
	res.locals.prismatic = ["Scopiest Weapons", "Tap Dancer", "Symphony of War", "Giant Slayer", "Chain Lightning", "Mystic Punch", "Feel the Burn", "Master of Duality", "Draw Your Sword", "Trueshot Prodigy", "Jeweled Gauntlet", "Dashing", "Omni Soul", "Mad Scientist", "Ultimate Revolution", "Nesting Doll", "Back To Basics", "Slow Cooker", "Orbital Laser", "Wisdom of Ages", "Goliath", "Chauffeur", "Center of the Universe", "Can't Touch This", "Quantum Computing", "Blade Waltz", "Circle of Death", "Gamba Anvil", "Earthwake", "Raid Boss", "Infernal Conduit", "Fey Magic", "Accelerating Sorcery", "Spellwake", "Laser Eyes", "Summoner's Roulette", "Courage of the Colossus", "Spirit Link"]

	res.locals.early = ["Deft", "Scoped Weapons", "Blunt Force", "Light 'em Up!", "Typhoon", "Vulnerability", "Goredrink", "Serve Beyond Death", "Executioner", "Contract Killer", "Dematerialize", "Infernal Soul", "Ocean Soul", "Buff Buddies", "Warmup Routine", "Scopier Weapons", "Lightning Strikes", "Shrink Ray", "Soul Siphon", "It's Critical", "Twice Thrice", "Firebrand", "Demon's Dance", "OK Boomerang", "Perseverance", "Scopiest Weapons", "Tap Dancer", "Symphony of War", "Giant Slayer", "Chain Lightning", "Mystic Punch", "Feel the Burn", "Jeweled Gauntlet", "Center of the Universe", "Wisdom of Ages"]
 	next()
})

augments.use("/caitlyn", (req, res, next) => {
	res.locals.champion = "Caitlyn"

	res.locals.silver = ["Deft", "Scoped Weapons", "Blunt Force", "Light 'em Up!", "Typhoon", "Vulnerability", "Goredrink", "Serve Beyond Death", "Executioner", "Contract Killer", "Dematerialize", "Infernal Soul", "Flashy", "Don't Blink", "Fallen Aegis", "Tank It Or Leave It", "Ocean Soul", "Juice Box", "escAPADe", "Repulsor", "Ice Cold", "Mind to Matter", "Homeguard", "Flashbang", "Frozen Foundations", "Erosion", "Heavy Hitter", "Buff Buddies", "Warmup Routine", "Mirror Image", "Mountain Soul", "Now You See Me", "Hold Very Still", "Frost Wraith", "Ultimate Unstoppable", "Don't Chase", "Self Destruct", "Snowball Fight!", "Shadow Runner", "Clothesline", "Castle", "Slap Around", "Tormentor", "Guilty Pleasure", "Fully Automated", "First-Aid Kit", "Witchful Thinking"]
	res.locals.gold = ["Scopier Weapons", "Lightning Strikes", "Shrink Ray", "Soul Siphon", "It's Critical", "Twice Thrice", "Firebrand", "Demon's Dance", "Thread the Needle", "The Brutalizer", "Dawnbringer's Resolve", "From Beginning to End", "Impassable", "Dive Bomber", "OK Boomerang", "With Haste", "Vengeance", "Quest Urf's Champion", "Perseverance", "Bread And Cheese", "Die Another Day", "Defensive Maneuvers", "Parasitic Relationship", "Combo Master", "Outlaw's Grit", "Vanish", "It's Killing Time", "Celestial Body", "Searing Dawn", "Skilled Sniper", "Banner of Command", "Apex Inventor", "Bread And Jam", "Critical Healing", "Extendo-Arm", "Bread And Butter", "Oathsworn", "Magic Missile", "Recursion", "Restless Restoration", "Cannon Fodder", "All For You", "Keystone Conjurer", "Willing Sacrifice", "Ethereal Weapon", "Restart", "Rabble Rousing", "Phenomenal Evil", "Minionmancer", "Quest Steel Your Heart", "Quest Angel of Retribution", "Holy Fire"]
	res.locals.prismatic = ["Scopiest Weapons", "Tap Dancer", "Symphony of War", "Giant Slayer", "Chain Lightning", "Mystic Punch", "Feel the Burn", "Master of Duality", "Draw Your Sword", "Trueshot Prodigy", "Jeweled Gauntlet", "Dashing", "Omni Soul", "Mad Scientist", "Ultimate Revolution", "Nesting Doll", "Back To Basics", "Slow Cooker", "Orbital Laser", "Wisdom of Ages", "Goliath", "Chauffeur", "Center of the Universe", "Can't Touch This", "Quantum Computing", "Blade Waltz", "Circle of Death", "Gamba Anvil", "Earthwake", "Raid Boss", "Infernal Conduit", "Fey Magic", "Accelerating Sorcery", "Spellwake", "Laser Eyes", "Summoner's Roulette", "Courage of the Colossus", "Spirit Link"]

	res.locals.early = ["Deft", "Scoped Weapons", "Blunt Force", "Light 'em Up!", "Typhoon", "Vulnerability", "Goredrink", "Serve Beyond Death", "Executioner", "Contract Killer", "Dematerialize", "Infernal Soul", "Ocean Soul", "Buff Buddies", "Warmup Routine", "Scopier Weapons", "Lightning Strikes", "Shrink Ray", "Soul Siphon", "It's Critical", "Twice Thrice", "Firebrand", "Demon's Dance", "OK Boomerang", "Perseverance", "Scopiest Weapons", "Tap Dancer", "Symphony of War", "Giant Slayer", "Chain Lightning", "Mystic Punch", "Feel the Burn", "Jeweled Gauntlet", "Center of the Universe", "Wisdom of Ages"]
 	next()
})

augments.use("/vayne", (req, res, next) => {
	res.locals.champion = "Vayne"

	res.locals.silver = ["Deft", "Scoped Weapons", "Blunt Force", "Light 'em Up!", "Typhoon", "Vulnerability", "Goredrink", "Serve Beyond Death", "Executioner", "Contract Killer", "Dematerialize", "Infernal Soul", "Flashy", "Don't Blink", "Fallen Aegis", "Tank It Or Leave It", "Ocean Soul", "Juice Box", "escAPADe", "Repulsor", "Ice Cold", "Mind to Matter", "Homeguard", "Flashbang", "Frozen Foundations", "Erosion", "Heavy Hitter", "Buff Buddies", "Warmup Routine", "Mirror Image", "Mountain Soul", "Now You See Me", "Hold Very Still", "Frost Wraith", "Ultimate Unstoppable", "Don't Chase", "Self Destruct", "Snowball Fight!", "Shadow Runner", "Clothesline", "Castle", "Slap Around", "Tormentor", "Guilty Pleasure", "Fully Automated", "First-Aid Kit", "Witchful Thinking"]
	res.locals.gold = ["Scopier Weapons", "Lightning Strikes", "Twice Thrice", "Shrink Ray", "Soul Siphon", "It's Critical", "Firebrand", "Demon's Dance", "Thread the Needle", "The Brutalizer", "Dawnbringer's Resolve", "From Beginning to End", "Impassable", "Dive Bomber", "OK Boomerang", "With Haste", "Vengeance", "Quest Urf's Champion", "Perseverance", "Bread And Cheese", "Die Another Day", "Defensive Maneuvers", "Parasitic Relationship", "Combo Master", "Outlaw's Grit", "Vanish", "It's Killing Time", "Celestial Body", "Searing Dawn", "Skilled Sniper", "Banner of Command", "Apex Inventor", "Bread And Jam", "Critical Healing", "Extendo-Arm", "Bread And Butter", "Oathsworn", "Magic Missile", "Recursion", "Restless Restoration", "Cannon Fodder", "All For You", "Keystone Conjurer", "Willing Sacrifice", "Ethereal Weapon", "Restart", "Rabble Rousing", "Phenomenal Evil", "Minionmancer", "Quest Steel Your Heart", "Quest Angel of Retribution", "Holy Fire"]
	res.locals.prismatic = ["Scopiest Weapons", "Tap Dancer", "Symphony of War", "Giant Slayer", "Chain Lightning", "Mystic Punch", "Feel the Burn", "Master of Duality", "Draw Your Sword", "Trueshot Prodigy", "Jeweled Gauntlet", "Dashing", "Omni Soul", "Mad Scientist", "Ultimate Revolution", "Nesting Doll", "Back To Basics", "Slow Cooker", "Orbital Laser", "Wisdom of Ages", "Goliath", "Chauffeur", "Center of the Universe", "Can't Touch This", "Quantum Computing", "Blade Waltz", "Circle of Death", "Gamba Anvil", "Earthwake", "Raid Boss", "Infernal Conduit", "Fey Magic", "Accelerating Sorcery", "Spellwake", "Laser Eyes", "Summoner's Roulette", "Courage of the Colossus", "Spirit Link"]

	res.locals.early = ["Deft", "Scoped Weapons", "Blunt Force", "Light 'em Up!", "Typhoon", "Vulnerability", "Goredrink", "Serve Beyond Death", "Executioner", "Contract Killer", "Dematerialize", "Infernal Soul", "Ocean Soul", "Buff Buddies", "Warmup Routine", "Scopier Weapons", "Lightning Strikes", "Shrink Ray", "Soul Siphon", "It's Critical", "Twice Thrice", "Firebrand", "Demon's Dance", "OK Boomerang", "Perseverance", "Scopiest Weapons", "Tap Dancer", "Symphony of War", "Giant Slayer", "Chain Lightning", "Mystic Punch", "Feel the Burn", "Jeweled Gauntlet", "Center of the Universe", "Wisdom of Ages"]
 	next()
})



augments.use((req, res, next) => {
	res.locals.silver = res.locals.silver.map(function(element, index) { return {name: element, src: "assets/augments/test/silver/" + element + ".png"} })
	res.locals.gold = res.locals.gold.map(function(element, index) { return {name: element, src: "assets/augments/test/gold/" + element + ".png"} })
	res.locals.prismatic = res.locals.prismatic.map(function(element, index) { return {name: element, src: "assets/augments/test/prismatic/" + element + ".png"} })
	
	next()
})

// augments.get(["/anivia", "/vex", "/ziggs"], (req, res) => {
augments.get("*", (req, res) => {
	res.render("augments.ejs", {
		champion: res.locals.champion,
		square: "assets/dragontail/champion/square/" + res.locals.champion + ".png",
		prismatic: res.locals.prismatic,
		gold: res.locals.gold,
		silver: res.locals.silver,
		early: res.locals.early
	})
})



// Selection Screen
const selection = require("../controllers/selection.js")

router.use((req, res, next) => {
	res.locals = {
		pageTitle: "Augments",
		path: "/arena/augments/",
		champions: ["Anivia", "Vex", "Ziggs", "Hwei", "Ashe", "Caitlyn", "Vayne"]
	}
	next()
})

router.use("/selection", selection)


module.exports = router