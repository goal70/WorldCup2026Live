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

/*
=================================
LOAD MATCHES
=================================
*/

async function loadMatches(){

    try {

        const groups = [
            "a","b","c","d","e","f",
            "g","h","i","j","k","l"
        ];

        allMatches = [];

        for(const group of groups){

            const res =
            await fetch(
                `data/groups/groups-${group}.json`
            );

            const matches =
            await res.json();

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

                    score: match.score || "-",

                    localTime: match.timeET,
                    argentinaTime: match.timeAR,

                    stadium: match.stadium,
                    city: match.city,

                    links: match.links || []

                });

            });

        }

        showToday();

    }

    catch(err){

        console.error(
            "LOAD MATCHES ERROR",
            err
        );

    }

}

/*
=================================
DATE FILTERS
=================================
*/

function showToday(){

    const today =
    new Date()
    .toISOString()
    .split("T")[0];

    const matches =
    allMatches.filter(
        m => m.date === today
    );

    renderMatches(matches);

}

function showYesterday(){

    const d = new Date();

    d.setDate(
        d.getDate() - 1
    );

    const target =
    d.toISOString()
    .split("T")[0];

    const matches =
    allMatches.filter(
        m => m.date === target
    );

    renderMatches(matches);

}

function showTomorrow(){

    const d = new Date();

    d.setDate(
        d.getDate() + 1
    );

    const target =
    d.toISOString()
    .split("T")[0];

    const matches =
    allMatches.filter(
        m => m.date === target
    );

    renderMatches(matches);

}

/*
=================================
NAVIGATION
=================================
*/

function setupNavigation(){

    document
    .getElementById("yesterdayBtn")
    ?.addEventListener(
        "click",
        () => {

            setActiveButton(
                document.getElementById(
                    "yesterdayBtn"
                )
            );

            showYesterday();

        }
    );

    document
    .getElementById("todayBtn")
    ?.addEventListener(
        "click",
        () => {

            setActiveButton(
                document.getElementById(
                    "todayBtn"
                )
            );

            showToday();

        }
    );

    document
    .getElementById("tomorrowBtn")
    ?.addEventListener(
        "click",
        () => {

            setActiveButton(
                document.getElementById(
                    "tomorrowBtn"
                )
            );

            showTomorrow();

        }
    );

}

function setActiveButton(button){

    document
    .querySelectorAll(".day-btn")
    .forEach(btn =>
        btn.classList.remove("active")
    );

    button.classList.add("active");

}

/*
=================================
RENDER MATCHES
=================================
*/

function renderMatches(matches){

    const container =
    document.getElementById(
        "todayMatches"
    );

    container.innerHTML = "";

    if(!matches.length){

        container.innerHTML = `

        <article class="match-card">

            <div class="match-status">
                NO MATCHES FOUND
            </div>

        </article>

        `;

        return;

    }

    matches.forEach(match => {

        let statusClass = "";

        if(match.status === "LIVE")
            statusClass = "live";

        if(match.status === "FINISHED")
            statusClass = "final";

        if(match.status === "UPCOMING")
            statusClass = "upcoming";

        container.innerHTML += `

        <article
            class="match-card"
            data-id="${match.id}"
        >

            <div class="match-top">

                <div
                    class="match-status ${statusClass}"
                >
                    ${match.status}
                </div>

            </div>

            <div class="match-center">

                <div class="team">

                    <img
                        class="flag"
                        src="https://flagcdn.com/w80/${match.homeFlag}.png"
                    >

                    <div class="team-name">
                        ${match.homeTeam}
                    </div>

                </div>

                <div class="score">

                    <div class="score-number">

                        ${
                            match.score &&
                            match.score !== "-"
                            ? match.score
                            : "VS"
                        }

                    </div>

                </div>

                <div class="team">

                    <img
                        class="flag"
                        src="https://flagcdn.com/w80/${match.awayFlag}.png"
                    >

                    <div class="team-name">
                        ${match.awayTeam}
                    </div>

                </div>

            </div>

            <div class="match-details">

                <div>
                    Group ${match.group}
                </div>

                <div>
                    🕒 ET ${match.localTime}
                </div>

                <div>
                    🇦🇷 AR ${match.argentinaTime}
                </div>

                <div>
                    🏟 ${match.stadium}
                </div>

                <div>
                    📍 ${match.city}
                </div>

            </div>

            ${
                match.links.length
                ?
                `
                <div class="match-actions">

                    ${match.links.map(link => `

                        <a
                            href="${link.url}"
                            target="_blank"
                        >

                            <img
                                src="${link.logo}"
                                alt="${link.name}"
                            >

                        </a>

                    `).join("")}

                </div>
                `
                :
                ""
            }

        </article>

        `;

    });

}
