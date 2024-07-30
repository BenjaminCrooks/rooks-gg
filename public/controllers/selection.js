const express = require("express")
const router = express.Router()

router.get("*", (req, res) => {
	res.render("selection-navigation", {
		pageTitle: res.locals.pageTitle,
		urlPath: res.locals.path,
		champions: res.locals.champions
	})
})


module.exports = router