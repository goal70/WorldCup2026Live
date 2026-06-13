/*************************************************
 * WORLD GOAL 2026 - ENTERPRISE APP ENGINE (FINAL FIX GOALS SIDE)
 *************************************************/

let allMatches = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
    setupNavigation();
});

/* =========================
   FLAG SYSTEM
========================= */

function flagUrl(code) {
    if (!code) return "";
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

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

                    status: m.status || "UPCOMING",

                    team1: m.team1,
                    team2: m.team2,

                    flag1: m.flag1,
                    flag2: m.flag2,

                    homeScore: m.homeScore ?? null,
                    awayScore: m.awayScore ?? null,

                    stadium: m.stadium,
                    city: m.city,

                    timeET: m.timeET,
                    timeAR: m.timeAR,

                    links: m.links || [],
                    goals: m.goals || [],
                    redCards: m.redCards || []
                });

            });

        }

        showToday();

    } catch (err) {
        console.error("LOAD ERROR", err);
    }
}

/* =========================
   DATE NORMALIZATION
========================= */

function getLocalDate(offset = 0) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + offset);
    return d.toISOString().split("T")[0];
}

/* =========================
   FILTERS
========================= */

function showToday(){ render("todayMatches", getLocalDate(0)); }
function showYesterday(){ render("yesterdayMatches", getLocalDate(-1)); }
function showTomorrow(){ render("tomorrowMatches", getLocalDate(1)); }

/* =========================
   NAVIGATION
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
    document.getElementById(id)?.classList.add("active");
}

/* =========================
   RENDER ENGINE (FIX GOALS LEFT/RIGHT)
========================= */

function render(containerId, date) {

    const containers = ["yesterdayMatches","todayMatches","tomorrowMatches"];

    containers.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = "none";
        el.innerHTML = "";
    });

    const container = document.getElementById(containerId);
    container.style.display = "grid";

    const matches = allMatches.filter(m => m.date === date);

    if (!matches.length) {
        container.innerHTML = `<div class="no-matches">No matches for this day</div>`;
        return;
    }

    container.innerHTML = matches.map(m => {

        const linksHTML = (m.links || []).map(l => `
            <a class="match-link" href="${l.url}" target="_blank">
                <img src="${l.logo}" alt="">
                <span>${l.name}</span>
            </a>
        `).join("");

        /* 🔥 FIX: separar goles por equipo */
        const homeGoals = (m.goals || []).filter(g => g.team === "home");
        const awayGoals = (m.goals || []).filter(g => g.team === "away");

        const homeGoalsHTML = homeGoals.map(g => `
            <div class="goal left">
                ⚽ ${g.player} <span class="minute">${g.minute}'</span>
            </div>
        `).join("");

        const awayGoalsHTML = awayGoals.map(g => `
            <div class="goal right">
                <span class="minute">${g.minute}'</span> ${g.player} ⚽
            </div>
        `).join("");

        return `
        <div class="match-card">

            <div class="match-status ${m.status.toLowerCase()}">
                ${m.status}
            </div>

            <!-- GRUPO SOLO TEXTO -->
            <div style="text-align:center;font-weight:900;color:#00D26A;margin-bottom:6px;">
                GRUPO ${m.group}
            </div>

            <div class="match-header">

                <div class="team">
                    <img src="${flagUrl(m.flag1)}" class="flag">
                    <span>${m.team1}</span>
                </div>

                <div class="score">
                    ${m.homeScore ?? 0} - ${m.awayScore ?? 0}
                </div>

                <div class="team">
                    <span>${m.team2}</span>
                    <img src="${flagUrl(m.flag2)}" class="flag">
                </div>

            </div>

            <!-- 🔥 GOLES POR LADO -->
            <div class="events">

                <div class="events-column left">
                    ${homeGoalsHTML}
                </div>

                <div class="events-column right">
                    ${awayGoalsHTML}
                </div>

            </div>

            <div class="match-footer">
                🏟 ${m.stadium} • ${m.city} <br>
                🕒 ET ${m.timeET} | AR ${m.timeAR}
            </div>

            <div class="match-links">
                ${linksHTML}
            </div>

        </div>
        `;
    }).join("");
}

/* =========================================================
   MONETIZATION (UNCHANGED SAFE)
========================================================= */

const USER = {
    start: Date.now(),
    engaged: false,
    clicks: 0,
    scroll: 0,
    visits: Number(localStorage.getItem("wg_visits") || 0) + 1
};

localStorage.setItem("wg_visits", USER.visits);

window.addEventListener("scroll", () => {
    USER.scroll = window.scrollY;
    USER.engaged = true;
});

document.addEventListener("click", () => {
    USER.clicks++;
    USER.engaged = true;
});

function getUserScore() {
    let score = 0;

    const time = Date.now() - USER.start;

    if (USER.engaged) score += 25;
    if (USER.scroll > 300) score += 20;
    if (USER.clicks > 1) score += 20;
    if (time > 15000) score += 20;
    if (USER.visits > 2) score += 15;

    return score;
}

function shouldMonetize() {
    return getUserScore() > 60;
}
