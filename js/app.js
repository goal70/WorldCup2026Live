/*************************************************
 * WORLD GOAL 2026 - ENTERPRISE APP ENGINE (FIXED FIFA RESTORE)
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
   LOAD MATCHES (FIXED FULL MODEL)
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

                    score: m.score || "-",

                    stadium: m.stadium,
                    city: m.city,

                    timeET: m.timeET,
                    timeAR: m.timeAR,

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
   RENDER ENGINE (FIFA BROADCAST RESTORED)
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
        container.innerHTML = `
            <div style="text-align:center;opacity:.6;padding:20px;">
                No matches for this day
            </div>`;
        return;
    }

    /* GROUP FIX */
    const groups = {};
    matches.forEach(m => {
        if (!groups[m.group]) groups[m.group] = [];
        groups[m.group].push(m);
    });

    container.innerHTML = Object.keys(groups).map(g => `

        <div class="group-title">Group ${g}</div>

        ${groups[g].map(m => `

            <div class="match-card">

                <!-- STATUS -->
                <div style="display:flex;justify-content:center;margin-bottom:8px;">
                    <span class="${m.status === "FINISHED" ? "final" : m.status === "LIVE" ? "live" : "upcoming"}">
                        ${m.status}
                    </span>
                </div>

                <!-- MATCH HEADER -->
                <div class="match-header">

                    <div class="team">
                        <img src="${flagUrl(m.flag1)}" class="flag">
                        <span>${m.team1}</span>
                    </div>

                    <div class="score">
                        ${m.score}
                    </div>

                    <div class="team">
                        <span>${m.team2}</span>
                        <img src="${flagUrl(m.flag2)}" class="flag">
                    </div>

                </div>

                <!-- DETAILS RESTORED -->
                <div class="events">

                    ${(m.goals || []).map(g =>
                        `<div class="goal">⚽ ${g.player} ${g.minute}'</div>`
                    ).join("")}

                    ${(m.redCards || []).map(r =>
                        `<div class="red">🟥 ${r.player} ${r.minute}'</div>`
                    ).join("")}

                </div>

                <!-- FULL INFO BLOCK (FIX QUE TE FALTABA) -->
                <div class="match-footer">
                    🏟 ${m.stadium || ""} • ${m.city || ""} <br>
                    🕒 ET ${m.timeET || "-"} | AR ${m.timeAR || "-"}
                </div>

            </div>

        `).join("")}

    `).join("");
}

/* =========================================================
   MONETIZATION (NO TOCADO)
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

function loadPopunder() {
    const s = document.createElement("script");
    s.src = "https://pl29727721.effectivecpmnetwork.com/c0/01/58/c00158d2d7f73a99186d63fd0ecb13ef.js";
    document.body.appendChild(s);
}

function loadSocialBar() {
    const s = document.createElement("script");
    s.src = "https://pl29727722.effectivecpmnetwork.com/4f/4a/ff/4f4affad81da3060c84e588a26bb60f2.js";
    document.body.appendChild(s);
}

function shouldMonetize() {
    return getUserScore() > 60;
}

/* POP SYSTEM */
(function popSystem() {

    const KEY = "wg_pop_last";
    const now = Date.now();

    const last = localStorage.getItem(KEY);
    const cooldownOk = !last || (now - last > 4 * 60 * 60 * 1000);

    let engaged = false;

    window.addEventListener("scroll", () => engaged = true, { once: true });
    window.addEventListener("click", () => engaged = true, { once: true });

    setTimeout(() => {
        if (shouldMonetize() && cooldownOk && engaged) {
            loadPopunder();
            localStorage.setItem(KEY, now);
        }
    }, 18000);

})();

/* SOCIAL SYSTEM */
(function socialSystem() {

    let loaded = false;

    window.addEventListener("scroll", () => {

        if (loaded) return;

        if (window.scrollY > 500 && shouldMonetize()) {
            loadSocialBar();
            loaded = true;
        }

    });

})();
