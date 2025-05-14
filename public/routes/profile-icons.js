const express = require("express")
const fs = require("fs")
const path = require("path")
const router = express.Router()

router.use(express.static("public"))

var { liveVersion } = require("../data-dragon.js")


var icons = JSON.parse(fs.readFileSync("./public/assets/data/profile-icons.JSON", "utf8")).map(function(element) {
	element.img = `/assets/dragontail/${liveVersion}/profileicon/${element.id}.png`
	"/assets/dragontail/profileicon/" + element.id + ".png"
	return element
})

router.get("/all", (req, res) => {
	res.render("profile-icons.ejs", { icons }) 
})


module.exports = router