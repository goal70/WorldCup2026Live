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

    // 🔥 OCULTAR TODOS LOS CONTENEDORES PRIMERO
    document.getElementById("yesterdayMatches").style.display = "none";
    document.getElementById("todayMatches").style.display = "none";
    document.getElementById("tomorrowMatches").style.display = "none";

    // 🔥 MOSTRAR SOLO EL ACTIVO
    const container = document.getElementById(containerId);
    container.style.display = "block";

    const groups = {};

    matches.forEach(m => {
        if (!groups[m.group]) groups[m.group] = [];
        groups[m.group].push(m);
    });

    container.innerHTML = Object.keys(groups).map(group => `

        <div class="group-title">Group ${group}</div>

        <div class="group-block">

            ${groups[group].map(m => `

                <div class="match-card">

                    <div class="match-header">

                        <div class="team">
                            <img src="${m.homeFlag}" class="flag" />
                            <span>${m.homeTeam}</span>
                        </div>

                        <div class="score">
                            ${m.homeScore ?? "-"} - ${m.awayScore ?? "-"}
                        </div>

                        <div class="team">
                            <span>${m.awayTeam}</span>
                            <img src="${m.awayFlag}" class="flag" />
                        </div>

                    </div>

                    <div class="events">

                        ${m.goals?.length ? m.goals.map(g =>
                            `<div class="goal">⚽ ${g.player} <span>${g.minute}'</span></div>`
                        ).join("") : ""}

                        ${m.redCards?.length ? m.redCards.map(r =>
                            `<div class="red">🟥 ${r.player} <span>${r.minute}'</span></div>`
                        ).join("") : ""}

                    </div>

                    <div class="match-footer">
                        🏟 ${m.stadium} • ${m.city}
                    </div>

                </div>

            `).join("")}

        </div>

    `).join("");
}
