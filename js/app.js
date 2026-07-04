/*************************************************
 * WORLD GOAL 2026 - ENTERPRISE APP ENGINE
 * FIXED (GRUPOS + FASE FINAL + HOME OK)
 *************************************************/

let allMatches = [];

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
    setupNavigation();

    showToday(); // 🔥 IMPORTANTE: render correcto inicial
    setShareHome?.();
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

        /* ========= GRUPOS ========= */

        for (const group of groups) {

            const res = await fetch(`data/groups/groups-${group}.json`);
            if (!res.ok) continue;

            const matches = await res.json();

            matches.forEach(m => {

                allMatches.push({
                    id: m.id,
                    type: "group",
                    group: m.group,
                    date: m.date,
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

                    links: Array.isArray(m.links) ? m.links : [],
                    goals: Array.isArray(m.goals) ? m.goals : [],
                    redCards: Array.isArray(m.redCards) ? m.redCards : []
                });

            });
        }

        /* ========= FASE FINAL (OCTAVOS / CUARTOS / SEMIS / FINAL) ========= */

        const resFinal = await fetch("data/fasefinal-matches.json");

        if (resFinal.ok) {

            const finalMatches = await resFinal.json();

            finalMatches.forEach(m => {

                allMatches.push({
                    id: m.id,
                    type: "knockout", // 🔥 CLAVE
                    group: "FASE FINAL",
                    stage: m.stage || "Octavos de Final",
                    side: m.side,

                    date: m.date,
                    status: m.status || "UPCOMING",

                    team1: m.team1,
                    team2: m.team2,

                    flag1: m.flag1,
                    flag2: m.flag2,

                    homeScore: m.homeScore ?? 0,
                    awayScore: m.awayScore ?? 0,

                    penalties: m.penalties ?? null,

                    stadium: m.stadium || "",
                    city: m.city || "",
                    timeAR: m.timeAR || "-",

                    links: Array.isArray(m.links) ? m.links : [],
                    goals: Array.isArray(m.goals) ? m.goals : [],
                    redCards: Array.isArray(m.redCards) ? m.redCards : []
                });

            });

        }

        console.log("MATCHES LOADED:", allMatches.length);

    } catch (err) {
        console.error("LOAD ERROR:", err);
    }
}

/* =========================
   DATE HELPERS
========================= */

function getLocalDate(offset = 0) {

    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + offset);

    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");

    return `${y}-${m}-${day}`;
}

/* =========================
   FILTERS
========================= */

function showToday(){ render("todayMatches", getLocalDate(0)); }
function showYesterday(){ render("yesterdayMatches", getLocalDate(-1)); }
function showTomorrow(){ render("tomorrowMatches", getLocalDate(1)); }

function showCustomDate(date){
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

    bind("yesterdayBtn", () => {
        setActive("yesterdayBtn");
        showYesterday();
    });

    bind("todayBtn", () => {
        setActive("todayBtn");
        showToday();
    });

    bind("tomorrowBtn", () => {
        setActive("tomorrowBtn");
        showTomorrow();
    });

    for (let i = 1; i <= 24; i++) {
        bind(`prevDateBtn${i}`, () => {

            const day = String(i + 10).padStart(2,"0");
            const date = `2026-06-${day}`;

            setActive(`prevDateBtn${i}`);
            showCustomDate(date);
        });
    }
}

/* =========================
   ACTIVE BUTTON
========================= */

function setActive(id) {
    document.querySelectorAll(".day-btn")
        .forEach(b => b.classList.remove("active"));

    document.getElementById(id)?.classList.add("active");
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

    const matches = allMatches.filter(m => (m.date || "").slice(0,10) === date);

    if (!matches.length) {
        container.innerHTML = `<div class="no-matches">No matches for this day</div>`;
        return;
    }

    container.innerHTML = matches.map(m => {

        const stageLabel =
            m.type === "knockout"
                ? (m.stage || "Octavos de Final")
                : `Grupo ${m.group || "-"}`;

        const linksHTML = (m.links || []).map(l => `
            <a class="match-link" href="${l.url}" target="_blank" rel="noopener noreferrer">
                <img src="${l.logo || ""}">
                <span>${l.name || ""}</span>
            </a>
        `).join("");

        return `
        <div class="match-card">

            <div class="match-status ${(m.status || "UPCOMING").toLowerCase()}">
                ${m.status || "UPCOMING"}
            </div>

            <div style="text-align:center;font-weight:900;color:#00D26A;margin-bottom:6px;">
                ${stageLabel}
            </div>

            <div class="match-header">

                <div class="team">
                    <img src="${flagUrl(m.flag1)}" class="flag">
                    <span>${m.team1}</span>
                </div>

                <div class="score">
                    ${m.homeScore} - ${m.awayScore}
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
   SHARE (SAFE)
========================= */

function setShareHome() {

    const url = window.location.href;

    ["share-wa","share-tw","share-fb","share-re","share-th"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.href = url;
        });
}
