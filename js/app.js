/*************************************************
 * WORLD GOAL 2026 - STABLE CORE ENGINE (FIXED + MODAL)
 *************************************************/

let allMatches = [];

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {

    setupNavigation();

    await loadMatches();

    showToday();

    setupGlobalClicks(); // 🔥 CLICK SYSTEM GLOBAL
});

/* =========================
   FLAG SYSTEM
========================= */

function flagUrl(code) {
    if (!code) return "";
    return `https://flagcdn.com/w40/${code.toLowerCase()}.png`;
}

/* =========================
   SAFE DATE
========================= */

function normalizeDate(date) {
    if (!date) return "";
    return date.includes("-") ? date.slice(0,10) : date;
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
            if (!res.ok) continue;

            const matches = await res.json();

            matches.forEach(m => {

                allMatches.push({
                    id: m.id,
                    group: m.group,
                    date: normalizeDate(m.date),
                    status: (m.status || "UPCOMING").toString(),

                    team1: m.team1 || "",
                    team2: m.team2 || "",

                    flag1: m.flag1 || "",
                    flag2: m.flag2 || "",

                    homeScore: m.homeScore ?? 0,
                    awayScore: m.awayScore ?? 0,

                    stadium: m.stadium || "",
                    city: m.city || "",
                    timeAR: m.timeAR || m.time || "-",

                    links: Array.isArray(m.links) ? m.links : [],
                    goals: Array.isArray(m.goals) ? m.goals : []
                });

            });
        }

        const resFinal = await fetch("data/fasefinal.json");

        if (resFinal.ok) {

            const finalMatches = await resFinal.json();

            finalMatches.forEach(m => {

                allMatches.push({
                    id: m.id,
                    type: "knockout",
                    stage: m.stage || "Octavos de Final",
                    side: m.side,

                    date: normalizeDate(m.date),
                    status: (m.status || "UPCOMING").toString(),

                    team1: m.team1 || "",
                    team2: m.team2 || "",

                    flag1: m.flag1 || "",
                    flag2: m.flag2 || "",

                    homeScore: m.homeScore ?? 0,
                    awayScore: m.awayScore ?? 0,

                    stadium: m.stadium || "",
                    city: m.city || "",
                    timeAR: m.timeAR || m.time || "-",

                    links: Array.isArray(m.links) ? m.links : [],
                    goals: Array.isArray(m.goals) ? m.goals : []
                });

            });
        }

        console.log("MATCHES LOADED:", allMatches.length);

    } catch (err) {
        console.error(err);
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
    setActive("todayBtn");
    render("todayMatches", getLocalDate(0));
}

function showYesterday() {
    setActive("yesterdayBtn");
    render("yesterdayMatches", getLocalDate(-1));
}

function showTomorrow() {
    setActive("tomorrowBtn");
    render("tomorrowMatches", getLocalDate(1));
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

    const el = document.getElementById(id);
    if (el) el.classList.add("active");
}

/* =========================
   LINKS
========================= */

function renderLinks(links) {

    if (!Array.isArray(links)) return "";

    return links.map(l => `
        <a class="match-link"
           href="${l.url}"
           target="_blank"
           rel="noopener noreferrer">

            <img src="${l.logo || ''}">
            <span>${l.name || ''}</span>

        </a>
    `).join("");
}

/* =========================
   RENDER
========================= */

function render(containerId, date) {

    const containers = ["yesterdayMatches","todayMatches","tomorrowMatches","customDateMatches"];

    containers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
            el.innerHTML = "";
        }
    });

    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.display = "grid";

    const matches = allMatches.filter(m => (m.date || "").slice(0,10) === date);

    if (!matches.length) {
        container.innerHTML = `<div class="no-matches">No matches</div>`;
        return;
    }

    container.innerHTML = matches.map(m => {

        const status = (m.status || "UPCOMING").toLowerCase();
        const stage = m.type === "knockout"
            ? (m.stage || "Octavos de Final")
            : `Grupo ${m.group || "-"}`;

        return `
        <div class="match-card" data-id="${m.id}">

            <div class="match-status ${status}">
                ${m.status}
            </div>

            <div class="match-stage">
                ${stage}
            </div>

            <div class="match-header">

                <div class="team">
                    <img src="${flagUrl(m.flag1)}">
                    <span>${m.team1}</span>
                </div>

                <div class="score">
                    ${m.homeScore} - ${m.awayScore}
                </div>

                <div class="team">
                    <span>${m.team2}</span>
                    <img src="${flagUrl(m.flag2)}">
                </div>

            </div>

            <div class="match-footer">
                🏟 ${m.stadium} • ${m.city} <br>
                🕒 ${m.timeAR}
            </div>

            <div class="match-links">
                ${renderLinks(m.links)}
            </div>

        </div>
        `;
    }).join("");
}

/* =========================
   GLOBAL CLICK SYSTEM
========================= */

function setupGlobalClicks() {

    document.addEventListener("click", (e) => {

        const card = e.target.closest(".match-card");

        if (card) {
            const id = card.dataset.id;
            if (id) openMatchModal(id);
        }

        const link = e.target.closest(".match-link");

        if (link) {
            e.stopPropagation();
        }

    });
}

/* =========================
   MODAL SYSTEM
========================= */

function openMatchModal(id) {

    const match = allMatches.find(m => m.id === id);
    if (!match) return;

    let modal = document.getElementById("matchModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "matchModal";
        modal.innerHTML = `<div id="modalContent"></div>`;
        document.body.appendChild(modal);
    }

    const content = `
        <div class="modal-box">

            <h2>${match.team1} vs ${match.team2}</h2>

            <p>${match.stadium} • ${match.city}</p>
            <p>${match.timeAR}</p>

            <div class="modal-score">
                ${match.homeScore} - ${match.awayScore}
            </div>

            <button onclick="closeModal()">Close</button>

        </div>
    `;

    document.getElementById("matchModal").innerHTML = content;
    modal.style.display = "flex";
}

function closeModal() {
    const m = document.getElementById("matchModal");
    if (m) m.style.display = "none";
}

/* =========================
   SHARE
========================= */

function setShareHome() {

    const url = window.location.href;

    ["share-wa","share-tw","share-fb","share-re","share-th"]
        .forEach(id => {
            const el = document.getElementById(id);
            if (el) el.href = url;
        });
}
