const fetch = require("node-fetch");
const sqlite3 = require('sqlite3');
const open = require('sqlite').open;

(async () => {
	const db = await open({
		filename: './database.db',
		driver: sqlite3.Database
	})

	await db.exec('create table if not exists codes\n' +
		'(\n' +
		'\tcode varchar(10) not null\n' +
		'\t\tconstraint codes_pk\n' +
		'\t\t\tprimary key,\n' +
		'\ttime timestamp default CURRENT_TIMESTAMP not null\n' +
		');\n' +
		'\n' +
		'create index if not exists codes_code_index\n' +
		'\ton codes (code);\n' +
		'\n');

	async function randomCode() {
		let result = '';

		while(result === '') {
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
			const charactersLength = characters.length;

			for (var i = 0; i < 10; i++) {
				result += characters.charAt(Math.floor(Math.random() *
					charactersLength));
			}

			const a = await db.get("SELECT COUNT(code) as count FROM codes WHERE code = '" + result + "'")
			if(a.count > 0) {
				result = ''
			}
		}

		return result;
	}

	let limit = 10

	while(limit > 0) {
		const code = await randomCode()

		console.log("Trying code: " + code)

		const response = await fetch("https://oetker-gewinnspiel.de/", {
			"headers": {
				"accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
				"accept-language": "en-US,en;q=0.9,de;q=0.8",
				"cache-control": "max-age=0",
				"content-type": "application/x-www-form-urlencoded",
				"sec-ch-ua": "\"Chromium\";v=\"92\", \" Not A;Brand\";v=\"99\", \"Google Chrome\";v=\"92\"",
				"sec-ch-ua-mobile": "?0",
				"sec-fetch-dest": "document",
				"sec-fetch-mode": "navigate",
				"sec-fetch-site": "same-origin",
				"sec-fetch-user": "?1",
				"upgrade-insecure-requests": "1",
				"cookie": "cookies=OK"
			},
			"referrer": "https://oetker-gewinnspiel.de/",
			"referrerPolicy": "strict-origin-when-cross-origin",
			"body": "code=" + code + "&bundesland=",
			"method": "POST",
			"mode": "cors"
		})

		const body = await response.text()

		if (body.includes("Der eingegebene Code ist nicht gültig oder bereits verwendet worden.")) {
			console.error("Code is invalid.")
			await db.exec('INSERT INTO `codes` (`code`) VALUES(\'' + code + '\');');
		} else {
			console.log("Unexpected code state!")
			console.log(body)
			return
		}

		limit--
	}
})();