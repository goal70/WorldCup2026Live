/*************************************************
 * WORLD GOAL 2026 - FIXED CORE ENGINE
 *************************************************/

let allMatches = [];

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    setupNavigation();
    await loadMatches();
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

        /* ========= GROUPS ========= */
        for (const group of groups) {
            const res = await fetch(`data/groups/groups-${group}.json`);

            if (!res.ok) continue;

            const matches = await res.json();

            matches.forEach(m => {
                allMatches.push({
                    id: m.id,
                    group: m.group,
                    date: m.date, // IMPORTANTE: debe ser YYYY-MM-DD
                    status: m.status || "UPCOMING",

                    team1: m.team1,
                    team2: m.team2,

                    flag1: m.flag1,
                    flag2: m.flag2,

                    homeScore: m.homeScore ?? 0,
                    awayScore: m.awayScore ?? 0,

                    stadium: m.stadium || "",
                    city: m.city || "",
                    timeAR: m.timeAR || "-",

                    links: m.links || [],
                    goals: m.goals || [],
                    redCards: m.redCards || []
                });
            });
        }

        /* ========= FINAL PHASE ========= */
        try {
            const resFinal = await fetch("data/fasefinal.json");

            if (resFinal.ok) {
                const finalMatches = await resFinal.json();

                finalMatches.forEach(m => {
                    allMatches.push({
                        id: m.id,
                        type: "knockout",
                        stage: m.stage,
                        side: m.side,

                        date: m.date,
                        status: m.status || "UPCOMING",

                        team1: m.team1,
                        team2: m.team2,

                        flag1: m.flag1,
                        flag2: m.flag2,

                        homeScore: m.homeScore ?? 0,
                        awayScore: m.awayScore ?? 0,

                        penalties: m.penalties || null,

                        stadium: m.stadium || "",
                        city: m.city || "",
                        timeAR: m.time || "-"
                    });
                });
            }
        } catch (err) {
            console.error("Error fase final:", err);
        }

        showToday();

    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

/* =========================
   DATE HELPERS
========================= */

function getLocalDate(offset = 0) {
    const d = new Date();
    d.setHours(0,0,0,0);
    d.setDate(d.getDate() + offset);

    return d.toISOString().slice(0,10);
}

/* =========================
   FILTERS
========================= */

function showToday() {
    render("todayMatches", getLocalDate(0));
    setActive("todayBtn");
}

function showYesterday() {
    render("yesterdayMatches", getLocalDate(-1));
    setActive("yesterdayBtn");
}

function showTomorrow() {
    render("tomorrowMatches", getLocalDate(1));
    setActive("tomorrowBtn");
}

function showCustomDate(date) {
    render("customDateMatches", date);
}

/* =========================
   NAVIGATION
========================= */

function setupNavigation() {

    const bind = (id, fn) => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("click", fn);
    };

    bind("yesterdayBtn", showYesterday);
    bind("todayBtn", showToday);
    bind("tomorrowBtn", showTomorrow);

    for (let i = 1; i <= 21; i++) {
        bind(`prevDateBtn${i}`, () => {
            const day = String(i + 10).padStart(2,"0"); // ajusta base si quieres
            showCustomDate(`2026-06-${day}`);
            setActive(`prevDateBtn${i}`);
        });
    }
}

/* =========================
   ACTIVE BUTTON
========================= */

function setActive(id) {
    document.querySelectorAll(".day-btn")
        .forEach(b => b.classList.remove("active"));

    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}

/* =========================
   RENDER
========================= */

function render(containerId, date) {

    const containers = [
        "yesterdayMatches",
        "todayMatches",
        "tomorrowMatches",
        "customDateMatches"
    ];

    containers.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.style.display = "none";
        el.innerHTML = "";
    });

    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.display = "grid";

    const matches = allMatches.filter(m => {
        const d = (m.date || "").slice(0,10);
        return d === date;
    });

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

        return `
        <div class="match-card">

            <div class="match-status ${(m.status || "UPCOMING").toLowerCase()}">
                ${m.status || "UPCOMING"}
            </div>

            <div style="text-align:center;font-weight:900;margin-bottom:6px;">
                ${m.type === "knockout" ? m.stage : `Grupo ${m.group || "-"}`}
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

            <div class="match-footer">
                🏟 ${m.stadium || "-"} • ${m.city || "-"} <br>
                🕒 ${m.timeAR || "-"}
            </div>

            <div class="match-links">
                ${linksHTML}
            </div>

        </div>
        `;
    }).join("");
}

/* =========================
   SHARE (BÁSICO FIX)
========================= */

function setShareHome() {
    const url = window.location.href;

    const ids = ["share-wa","share-tw","share-fb","share-re","share-th"];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.href = url;
    });
}
