const colors = {
	reset : "0",
	bright : "1",
	di : "2",
	underscore : "4",
	blink : "5",
	reverse : "7",
	hidden : "8",

	fgBlack : "30",
	fgRed : "31",
	fgGreen : "32",
	fgYellow : "33",
	fgBlue : "34",
	fgMagenta : "35",
	fgCyan : "36",
	fgWhite : "37",

	bgBlack : "40",
	bgBed : "41",
	bgGreen : "42",
	bgYellow : "43",
	bgBlue : "44",
	bgMagenta : "45",
	bgCyan : "46",
	bgWhite : "47",
	
	black : "0",
	red : "1",
	green : "2",
	yellow : "3",
	blue : "4",
	magenta : "5",
	cyan : "6",
	white : "7",
	
}

//AJOUTER LES return
//GERER LE MULTI OTPIONS

exports.consoleFormat = function(text, options){
	let param = 0;
	if (typeof options == "number") console.log('\x1b[%dm%s\x1b[0m', options, text);
	else if (typeof options == "string");
	else if (typeof options != "object"){
	} else {
		if (typeof options.color == "number") param = 30 + options.color;
		else if (typeof options.color == "string") param = 30 + colors[text]
 		else if (typeof options.backColor == "number") param = 40 + options.backColor;   
	}
}

exports.log = function(text, options){
	let param = 0;
	if (typeof options == "number") console.log('\x1b[%dm%s\x1b[0m', options, text);
	else if (typeof options != "object"){
		console.log(text)
	} else {
		if (typeof options.color == "number") param = 30 + options.color;
		else if (typeof options.backColor == "number") param = 40 + options.backColor;
		console.log('\x1b[%dm%s\x1b[0m', param, text)
	}
}
