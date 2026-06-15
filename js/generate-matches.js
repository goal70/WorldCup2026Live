const fs = require("fs");
const path = require("path");

const groupsFolder = path.join(__dirname, "../data/groups");

const files = fs.readdirSync(groupsFolder)
  .filter(file =>
    file.startsWith("groups-") &&
    file.endsWith(".json")
  );

let allMatches = [];
let newId = 1;

files.forEach(file => {

  const data = JSON.parse(
    fs.readFileSync(
      path.join(groupsFolder, file),
      "utf8"
    )
  );

  data.forEach(match => {

    allMatches.push({

      id: newId++,

      group: match.group,
      date: match.date,
      status: match.status,

      homeTeam: match.team1,
      awayTeam: match.team2,

      homeFlag: match.flag1,
      awayFlag: match.flag2,

      homeScore: null,
      awayScore: null,

      stadium: match.stadium,
      city: match.city,

      argentinaTime: match.timeAR

    });

  });

});

fs.writeFileSync(
  path.join(__dirname, "../data/matches.json"),
  JSON.stringify(allMatches, null, 2)
);

console.log(
  `Listo. Se generaron ${allMatches.length} partidos.`
);
