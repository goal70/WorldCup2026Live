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

async function loadMatches() {

    try {

        const groups = [
            "a","b","c","d","e","f",
            "g","h","i","j","k","l"
        ];

        allMatches = [];

        for (const group of groups) {

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
                    homeScore: match.homeScore ?? null,
                    awayScore: match.awayScore ?? null,
                    played: match.played ?? false,
                    goals: match.goals ?? [],
                    redCards: match.redCards ?? [],
                    localTime: match.timeET,
                    argentinaTime: match.timeAR,
                    stadium: match.stadium,
                    city: match.city,
                    links: match.links || []
                });

            });

        }

        showToday();

    } catch (err) {
        console.error("LOAD MATCHES ERROR", err);
    }
}

/*
=================================
DATE HELPERS (LOCAL SAFE)
=================================
*/

function getLocalDate(offset = 0) {
    const d = new Date();
    d.setDate(d.getDate() + offset);
    return d.toLocaleDateString("en-CA"); // YYYY-MM-DD local safe
}

/*
=================================
FILTERS
=================================
*/

function showToday() {
    const target = getLocalDate(0);
    const matches = allMatches.filter(m => m.date === target);
    renderMatches(matches, "todayMatches");
}

function showYesterday() {
    const target = getLocalDate(-1);
    const matches = allMatches.filter(m => m.date === target);
    renderMatches(matches, "yesterdayMatches");
}

function showTomorrow() {
    const target = getLocalDate(1);
    const matches = allMatches.filter(m => m.date === target);
    renderMatches(matches, "tomorrowMatches");
}

/*
=================================
NAVIGATION
=================================
*/

function setupNavigation() {

    document.getElementById("yesterdayBtn")
    ?.addEventListener("click", () => {
        setActiveButton("yesterdayBtn");
        showYesterday();
    });

    document.getElementById("todayBtn")
    ?.addEventListener("click", () => {
        setActiveButton("todayBtn");
        showToday();
    });

    document.getElementById("tomorrowBtn")
    ?.addEventListener("click", () => {
        setActiveButton("tomorrowBtn");
        showTomorrow();
    });
}

function setActiveButton(activeId) {

    document.querySelectorAll(".day-btn")
    .forEach(btn => btn.classList.remove("active"));

    document.getElementById(activeId)?.classList.add("active");
}

/*
=================================
RENDER
=================================
*/

function renderMatches(matches, containerId) {

    const container = document.getElementById(containerId);

    if (!container) return;

    const groups = {};

    matches.forEach(m => {
        if (!groups[m.group]) groups[m.group] = [];
        groups[m.group].push(m);
    });

    container.innerHTML = Object.keys(groups).map(group => `

        <h2>Group ${group}</h2>

        ${groups[group].map(m => `

            <div class="match-card">

                <b>${m.homeTeam}</b>
                ${m.homeScore ?? "-"} - ${m.awayScore ?? "-"}
                <b>${m.awayTeam}</b>

                <div class="match-details">

                    ${m.goals?.map(g =>
                        `⚽ ${g.player} (${g.minute}')`
                    ).join("<br>") || ""}

                </div>

                <div class="match-cards">

                    ${m.redCards?.map(r =>
                        `🟥 ${r.player} (${r.minute}')`
                    ).join("<br>") || ""}

                </div>

            </div>

        `).join("")}

    `).join("");
}
