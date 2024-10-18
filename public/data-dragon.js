const fs = require("fs")
const path = require("path")


function imgPath(root, file) {
	return path.join("/assets/dragontail", root, file).replace(/\\/g,"/")
}


// Champions
var champion = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/champion.JSON", "utf8")).data
Object.entries(champion).forEach(function([key, value]) {
	value["img"] = {
		"centered": imgPath("/champion/centered", value["id"]+"_0.jpg"),
		"loading": imgPath("/champion/loading", value["id"]+"_0.jpg"),
		"loadingcrop": imgPath("/champion/loadingcrop", value["id"]+"_0.jpg"),
		"splash": imgPath("/champion/splash", value["id"]+"_0.jpg"),
		"square": imgPath("/champion/square", value["id"]+".png"),
		"squarecrop": imgPath("/champion/squarecrop", value["id"]+".png"),
		"tiles": imgPath("/champion/tiles", value["id"]+"_0.jpg")
	}
	champion[value.key] = value
})


// Runes
var runesReforged = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/runesReforged.JSON", "utf8"))
var runes = {}
runesReforged.forEach(function(element) {
	runes[element.id] = { "id": element.id, "key": element.key, "icon": element.icon, "name": element.name, "img": path.join("/assets/dragontail", element.icon) }
	element.slots.forEach(function(slot) {
		slot.runes.forEach(function(item) {
			item.img = path.join("/assets/dragontail", item.icon)
			runes[item.id] = item
		}) 
	})
})


// Items
var item = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/item.JSON", "utf8")).data
Object.entries(item).forEach(function([key, value]) {
	value["img"] = imgPath(value["image"]["group"], value["image"]["full"])
	item[value.key] = value
})


// Summoner Spells
var summoner = JSON.parse(fs.readFileSync("./public/assets/dragontail/data/summoner.JSON", "utf8")).data
Object.entries(summoner).forEach(function([key, value]) {
	value["img"] = imgPath(value["image"]["group"], value["image"]["full"])
	summoner[value.key] = value
})



module.exports = {
	rune: function (id) {
		/**
		 * Obtains rune data object by id
		 * 
		 * @param {number} id
		 * @returns {Object} - rune data object
		 */

		return runes[id]
	},

	champion: function (input) {
		/**
		 * Obtains champion data object by key OR id
		 * 
		 * @param {string} key
		 * @returns {Object} - champion data object
		 */

		return champion[input]
	},

	item: function (id) {
		/**
		 * Obtains item data object by key
		 * 
		 * @param {number} id
		 * @returns {Object} - item data object
		 */

		return item[id]
	},

	summoner: function (key) {
		/**
		 * Obtains summoner spell data object by key
		 * 
		 * @param {number} key
		 * @returns {Object} - summoner spell data object
		 */

		return summoner[key]
	}
}