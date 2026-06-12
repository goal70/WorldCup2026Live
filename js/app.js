/*
=================================
WORLD GOAL 2026
APP
=================================
*/

let allMatches = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
    setupNavigation();
});

async function loadMatches(){

    try {

        const groups = ["a","b","c","d","e","f","g","h","i","j","k","l"];

        allMatches = [];

        for(const group of groups){

            const res = await fetch(`data/groups/groups-${group}.json`);
            const matches = await res.json();

            matches.forEach(match => {

                allMatches.push({

                    id: match.id,
                    group: match.group,
                    date: match.date,
                    status: match.status,

                    homeTeam: match.team1,
                    awayTeam: match.team2,

                    homeFlag: match.flag1,
                    awayFlag: match.flag2,

                    localTime: match.timeET,
                    argentinaTime: match.timeAR,

                    homeScore: null,
                    awayScore: null,

                    stadium: match.stadium,
                    city: match.city,

                    links: match.links || []
                });

            });

        }

        showToday();

    } catch(err){
        console.error(err);
    }
}

function showToday(){

    const firstDate =
        [...allMatches].sort((a,b)=> new Date(a.date)-new Date(b.date))[0].date;

    renderMatches(allMatches.filter(m => m.date === firstDate));
}

function renderMatches(matches){

    const container = document.getElementById("todayMatches");
    container.innerHTML = "";

    matches.forEach(match => {

        container.innerHTML += `
        <article class="match-card" data-id="${match.id}">

            <div class="match-top">
                <div class="match-status">${match.status}</div>
            </div>

            <div class="match-center">

                <div class="team">
                    <img class="flag" src="https://flagcdn.com/w80/${match.homeFlag}.png">
                    <div class="team-name">${match.homeTeam}</div>
                </div>

                <div class="score">
                    <div class="score-number">vs</div>
                </div>

                <div class="team">
                    <img class="flag" src="https://flagcdn.com/w80/${match.awayFlag}.png">
                    <div class="team-name">${match.awayTeam}</div>
                </div>

            </div>

            <div class="match-details">
                <div>Group ${match.group}</div>
                <div>🕒 ${match.localTime}</div>
                <div>🏟 ${match.stadium}</div>
            </div>

            ${match.links.length ? `
            <div class="match-actions">
                ${match.links.map(link => `
                    <a href="${link.url}" target="_blank">
                        <img src="${link.logo}" alt="${link.name}">
                    </a>
                `).join("")}
            </div>
            ` : ""}

        </article>
        `;
    });
}
