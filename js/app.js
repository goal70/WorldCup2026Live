/*************************************************
 * WORLD GOAL 2026 - ENTERPRISE APP ENGINE
 * STABLE + FIXED VERSION (NO CRASH MODE)
 *************************************************/

let allMatches = [];

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
    setupNavigation();
    renderTables();
    setShareHome();
});

/* =========================
   FLAG SYSTEM
========================= */

function flagUrl(code) {
    if (!code) return "";
    return `https://flagcdn.com/w40/${String(code).toLowerCase()}.png`;
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

            (Array.isArray(matches) ? matches : []).forEach(m => {
                allMatches.push({
                    id: m.id || "",
                    group: m.group || "",
                    date: m.date || "",
                    status: m.status || "UPCOMING",

                    team1: m.team1 || "",
                    team2: m.team2 || "",

                    flag1: m.flag1 || "",
                    flag2: m.flag2 || "",

                    homeScore: Number(m.homeScore ?? 0),
                    awayScore: Number(m.awayScore ?? 0),

                    stadium: m.stadium || "",
                    city: m.city || "",
                    timeAR: m.timeAR || "",

                    goals: Array.isArray(m.goals) ? m.goals : [],
                    redCards: Array.isArray(m.redCards) ? m.redCards : [],
                    links: Array.isArray(m.links) ? m.links : []
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
        if (el) el.addEventListener("click", fn);
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

    const customDays = [
        "2026-06-11","2026-06-12","2026-06-13","2026-06-14",
        "2026-06-15","2026-06-16","2026-06-17","2026-06-18"
    ];

    customDays.forEach((date, i) => {
        bind(`prevDateBtn${i ? i+1 : ""}`, () => {
            setActive(`prevDateBtn${i ? i+1 : ""}`);
            showCustomDate(date);
        });
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
   SHARE SYSTEM
========================= */

function getShareLinks(match) {

    const text = `⚽ ${match.team1} ${match.homeScore} - ${match.awayScore} ${match.team2} | World Goal 2026`;
    const url = window.location.href;

    return {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(text + " " + url)}`,
        quora: `https://www.quora.com/share?url=${encodeURIComponent(url)}`
    };
}

/* =========================
   RENDER MATCHES
========================= */

function render(containerId, date) {

    const allContainers = [
        "yesterdayMatches",
        "todayMatches",
        "tomorrowMatches",
        "customDateMatches"
    ];

    allContainers.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = "none";
            el.innerHTML = "";
        }
    });

    const container = document.getElementById(containerId);
    if (!container) return;

    container.style.display = "grid";

    const matches = allMatches.filter(m => {
        const matchDate = (m.date || "").substring(0,10);
        return matchDate === date;
    });

    if (!matches.length) {
        container.innerHTML = `<div class="no-matches">No matches for this day</div>`;
        return;
    }

    container.innerHTML = matches.map(m => {

        const goals = m.goals;
        const redCards = m.redCards;
        const links = m.links;

        const status = (m.status || "UPCOMING").trim().toLowerCase();

        return `
        <div class="match-card">

            <div class="match-status ${status}">
                ${m.status}
            </div>

            <div class="group-label">
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

            <div class="match-footer">
                🏟 ${m.stadium} • ${m.city} <br>
                🕒 ${m.timeAR}
            </div>

            ${(goals.length || redCards.length || links.length) ? `
            <div class="match-extra">

                ${goals.map(g => `
                    <div class="event goal">⚽ ${g.player} (${g.minute}')</div>
                `).join("")}

                ${redCards.map(r => `
                    <div class="event red">🟥 ${r.player} (${r.minute}')</div>
                `).join("")}

                ${links.map(l => `
                    <div class="match-links-extra">
                        <a href="${l.url}" target="_blank">
                            ${l.logo ? `<img src="${l.logo}">` : ""}
                            ${l.name || "Link"}
                        </a>
                    </div>
                `).join("")}

            </div>
            ` : ""}

        </div>
        `;
    }).join("");
}

/* =========================
   TABLES
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

        const hs = m.homeScore;
        const as = m.awayScore;

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

    const container = document.getElementById("tables");
    if (!container) return;

    const tables = buildTables();

    container.innerHTML = Object.keys(tables).map(group => {

        const rows = Object.values(tables[group])
            .sort((a,b) => b.pts - a.pts || b.dg - a.dg || b.gf - a.gf)
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
                        <th>Team</th><th>PJ</th><th>PG</th><th>PE</th><th>PP</th><th>GF</th><th>GC</th><th>DG</th><th>PTS</th>
                    </tr>
                </thead>
                <tbody>${rows}</tbody>
            </table>
        </div>
        `;
    }).join("");
}

/* =========================
   SHARE HOME
========================= */

function setShareHome() {

    const wa = document.getElementById("share-wa");
    const tw = document.getElementById("share-tw");
    const fb = document.getElementById("share-fb");
    const re = document.getElementById("share-re");
    const th = document.getElementById("share-th");

    if (!wa || !tw || !fb || !re || !th) return;

    const url = window.location.href;
    const text = "⚽ World Goal 2026 - Live Matches";

    wa.href = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    tw.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`;
    fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    re.href = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    th.href = `https://www.threads.net/intent/post?text=${encodeURIComponent(text + " " + url)}`;
}
