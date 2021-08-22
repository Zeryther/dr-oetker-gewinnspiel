const fetch = require("node-fetch");

function randomCode() {
    let result = '';

    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;

    for (var i = 0; i < 10; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }

    return result;
}

const code = randomCode()

console.log("Trying code: " + code)

fetch("https://oetker-gewinnspiel.de/", {
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
}).then(res => res.text())
    .then(body => {
        if (body.includes("Der eingegebene Code ist nicht gültig oder bereits verwendet worden.")) {
            console.error("Code is invalid.")
        } else {
            console.log("Unexpected code state!")
            console.log(body)
        }
    })