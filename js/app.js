/*************************************************
 * WORLD GOAL 2026 - ENTERPRISE APP ENGINE
 * CLEAN FIX VERSION
 *************************************************/

let allMatches = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
    setupNavigation();
    renderTables();
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

            if (!res.ok) {
                console.warn(`Missing group ${group}`);
                continue;
            }

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

                    homeScore: m.homeScore ?? 0,
                    awayScore: m.awayScore ?? 0,

                    stadium: m.stadium,
                    city: m.city,
                    timeAR: m.timeAR,

                    links: m.links || [],
                    goals: m.goals || [],
                    redCards: m.redCards || []
                });
            });
        }

        showToday();
        renderTables();

    } catch (err) {
        console.error("LOAD ERROR", err);
    }
}

/* =========================
   DATE HELPERS
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

function showToday(){ render("todayMatches", getLocalDate(0)); renderTables(); }
function showYesterday(){ render("yesterdayMatches", getLocalDate(-1)); renderTables(); }
function showTomorrow(){ render("tomorrowMatches", getLocalDate(1)); renderTables(); }

function showCustomDate(date){
    render("customDateMatches", date);
    renderTables();
}

/* =========================
   NAVIGATION
========================= */

function setupNavigation() {

    const bind = (id, fn) => {
        const el = document.getElementById(id);
        if (!el) return console.warn("Missing button:", id);
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

    bind("prevDateBtn", () => {
        setActive("prevDateBtn");
        showCustomDate("2026-06-11");
    });

    bind("prevDateBtn2", () => {
        setActive("prevDateBtn2");
        showCustomDate("2026-06-12");
    });

    bind("prevDateBtn3", () => {
        setActive("prevDateBtn3");
        showCustomDate("2026-06-13");
    });

    bind("prevDateBtn4", () => {
        setActive("prevDateBtn4");
        showCustomDate("2026-06-14");
    });

    bind("prevDateBtn5", () => {
        setActive("prevDateBtn5");
        showCustomDate("2026-06-15");
    });

    bind("prevDateBtn6", () => {
        setActive("prevDateBtn6");
        showCustomDate("2026-06-16");
    });
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
   RENDER MATCHES
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

    const matches = allMatches.filter(m =>
    (m.date || "").slice(0,10) === date
);

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

        const homeGoals = (m.goals || []).filter(g => g.team === "home");
        const awayGoals = (m.goals || []).filter(g => g.team === "away");

        const homeGoalsHTML = homeGoals.map(g => `
            <div class="goal left">
                ⚽ ${g.player} <span class="minute">${g.minute}</span>
            </div>
        `).join("");

        const awayGoalsHTML = awayGoals.map(g => `
            <div class="goal right">
                <span class="minute">${g.minute}</span> ${g.player} ⚽
            </div>
        `).join("");

        return `
        <div class="match-card">

            <div class="match-status ${m.status.toLowerCase()}">
                ${m.status}
            </div>

            <div style="text-align:center;font-weight:900;color:#00D26A;margin-bottom:6px;">
                GRUPO ${m.group}
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

            <div class="events">
                <div class="events-column left">${homeGoalsHTML}</div>
                <div class="events-column right">${awayGoalsHTML}</div>
            </div>

            <div class="match-footer">
                🏟 ${m.stadium} • ${m.city} <br>
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
   TABLE SYSTEM
========================= */

function buildTables() {

    const tables = {};

    allMatches.forEach(m => {

        if (!tables[m.group]) tables[m.group] = {};

        [m.team1, m.team2].forEach(team => {
            if (!tables[m.group][team]) {
                tables[m.group][team] = {
                    team,
                    pts: 0, pj: 0, pg: 0, pe: 0, pp: 0,
                    gf: 0, gc: 0, dg: 0
                };
            }
        });
    });

    allMatches.forEach(m => {

        if (m.status === "UPCOMING") return;

        const home = tables[m.group][m.team1];
        const away = tables[m.group][m.team2];

        const hs = m.homeScore ?? 0;
        const as = m.awayScore ?? 0;

        home.pj++; away.pj++;
        home.gf += hs; home.gc += as;
        away.gf += as; away.gc += hs;

        if (hs > as) {
            home.pg++; home.pts += 3;
            away.pp++;
        } else if (as > hs) {
            away.pg++; away.pts += 3;
            home.pp++;
        } else {
            home.pe++; away.pe++;
            home.pts++; away.pts++;
        }

        home.dg = home.gf - home.gc;
        away.dg = away.gf - away.gc;
    });

    return tables;
}

function renderTables() {

    const tables = buildTables();
    const container = document.getElementById("tables");

    if (!container) return;

    container.innerHTML = Object.keys(tables).map(group => {

        const rows = Object.values(tables[group])
            .sort((a,b) =>
                b.pts - a.pts ||
                b.dg - a.dg ||
                b.gf - a.gf
            )
            .map(t => `
                <tr>
                    <td>${t.team}</td>
                    <td>${t.pj}</td>
                    <td>${t.pg}</td>
                    <td>${t.pe}</td>
                    <td>${t.pp}</td>
                    <td>${t.gf}</td>
                    <td>${t.gc}</td>
                    <td>${t.dg}</td>
                    <td><b>${t.pts}</b></td>
                </tr>
            `).join("");

        return `
        <div class="group-table">
            <h3>GROUP ${group}</h3>
            <table>
                <thead>
                    <tr>
                        <th>Team</th>
                        <th>PJ</th>
                        <th>PG</th>
                        <th>PE</th>
                        <th>PP</th>
                        <th>GF</th>
                        <th>GC</th>
                        <th>DG</th>
                        <th>PTS</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
        `;
    }).join("");
}
