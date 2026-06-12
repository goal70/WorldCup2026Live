let allMatches = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
    setupNavigation();
});

/* =========================
   LOAD MATCHES
========================= */

async function loadMatches() {

    try {

        const groups = ["a","b","c","d","e","f","g","h","i","j","k","l"];

        allMatches = [];

        for (const group of groups) {

            const res = await fetch(`data/groups/groups-${group}.json`);
            const matches = await res.json();

            matches.forEach(m => {

                allMatches.push({
                    id: m.id,
                    group: m.group,
                    date: m.date,

                    homeTeam: m.team1,
                    awayTeam: m.team2,

                    homeFlag: m.flag1,
                    awayFlag: m.flag2,

                    homeScore: m.homeScore,
                    awayScore: m.awayScore,

                    goals: m.goals || [],
                    redCards: m.redCards || [],

                    stadium: m.stadium,
                    city: m.city
                });

            });

        }

        showToday();

    } catch (err) {
        console.error("LOAD ERROR", err);
    }
}

/* =========================
   DATE FIX (IMPORTANT)
========================= */

function getLocalDate(offset = 0) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + offset);

    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,"0");
    const day = String(d.getDate()).padStart(2,"0");

    return `${y}-${m}-${day}`;
}

/* =========================
   FILTERS
========================= */

function showToday() {
    render("todayMatches", getLocalDate(0));
}

function showYesterday() {
    render("yesterdayMatches", getLocalDate(-1));
}

function showTomorrow() {
    render("tomorrowMatches", getLocalDate(1));
}

/* =========================
   NAV
========================= */

function setupNavigation() {

    document.getElementById("yesterdayBtn").onclick = () => {
        setActive("yesterdayBtn");
        showYesterday();
    };

    document.getElementById("todayBtn").onclick = () => {
        setActive("todayBtn");
        showToday();
    };

    document.getElementById("tomorrowBtn").onclick = () => {
        setActive("tomorrowBtn");
        showTomorrow();
    };
}

function setActive(id) {
    document.querySelectorAll(".day-btn").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

/* =========================
   RENDER
========================= */

function render(containerId, date) {

    document.getElementById("yesterdayMatches").style.display = "none";
    document.getElementById("todayMatches").style.display = "none";
    document.getElementById("tomorrowMatches").style.display = "none";

    const container = document.getElementById(containerId);
    container.style.display = "grid";

    const matches = allMatches.filter(m => m.date === date);

    if (!matches.length) {
        container.innerHTML = `<div style="text-align:center;opacity:.6;padding:20px;">
            No matches for this day
        </div>`;
        return;
    }

    const groups = {};
    matches.forEach(m => {
        if (!groups[m.group]) groups[m.group] = [];
        groups[m.group].push(m);
    });

    container.innerHTML = Object.keys(groups).map(g => `

        <div class="group-title">Group ${g}</div>

        ${groups[g].map(m => `

            <div class="match-card">

                <div class="match-header">

                    <div class="team">
                        ${m.homeFlag ? `<img src="${m.homeFlag}" class="flag">` : `<div class="flag"></div>`}
                        <span>${m.homeTeam}</span>
                    </div>

                    <div class="score">
                        ${m.homeScore ?? "-"} - ${m.awayScore ?? "-"}
                    </div>

                    <div class="team">
                        <span>${m.awayTeam}</span>
                        ${m.awayFlag ? `<img src="${m.awayFlag}" class="flag">` : `<div class="flag"></div>`}
                    </div>

                </div>

                <div class="events">

                    ${(m.goals || []).map(g =>
                        `<div class="goal">⚽ ${g.player} ${g.minute}'</div>`
                    ).join("")}

                    ${(m.redCards || []).map(r =>
                        `<div class="red">🟥 ${r.player} ${r.minute}'</div>`
                    ).join("")}

                </div>

                <div class="match-footer">
                    🏟 ${m.stadium || ""} • ${m.city || ""}
                </div>

            </div>

        `).join("")}

    `).join("");
}
