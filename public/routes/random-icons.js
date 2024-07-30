const express = require("express")
const router = express.Router()
const fs = require("fs")

router.use(express.static("public"))



router.use("/favorites", (req, res, next) => {
	res.locals.pageTitle = "Icon Randomizer"
	res.locals.path = "assets/dragontail/profileicon/fav"

	res.locals.aggregation = []
 	next()
})

router.use("/all-champies", (req, res, next) => {
	res.locals.pageTitle = "Champie Randomizer"
	res.locals.path = "assets/dragontail/profileicon/champies"

	res.locals.aggregation = []
 	next()
})

router.use("/favorite-champies", (req, res, next) => {
	res.locals.pageTitle = "Fav Champie Randomizer"
	res.locals.path = "assets/dragontail/profileicon/champies/fav"

	res.locals.aggregation = []
 	next()
})



router.use((req, res, next) => {
	fs.readdir("./public/" + res.locals.path, {recursive: true}, (err, files) => { 	// withFileTypes: true
		// remove 'fav' dir
		files.splice(files.indexOf("fav"), 1)

		res.locals.imgsrc = res.locals.path + "/" + files[Math.floor(Math.random()*files.length)]
		
		next()
	})
})



router.get(["/all", "/favorites"], (req, res) => {
	res.render("random-icon.ejs", {
		pageTitle: res.locals.pageTitle,
		imgsrc: res.locals.imgsrc
	})
})


module.exports = router