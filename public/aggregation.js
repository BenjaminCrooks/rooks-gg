module.exports = {

	gameVersion: {$concat: [
	    {$substrCP: [
	        "$info.gameVersion",
	        0,
	        {$indexOfCP: [
	            "$info.gameVersion",
	            ".",
	            {$add: [
	                {$indexOfCP: [
	                    "$info.gameVersion",
	                    "."
	                ]},
	                1
	            ]}
	        ]}
	    ]},
	    ".1"
	]}
}