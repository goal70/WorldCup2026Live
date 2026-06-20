/*************************************************
 * WORLD GOAL 2026 - ENTERPRISE APP ENGINE
 * FIXED + CLEAN VERSION
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

                    links: m.links || []
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

    const customDays = [
        "2026-06-11",
        "2026-06-12",
        "2026-06-13",
        "2026-06-14",
        "2026-06-15",
        "2026-06-16",
        "2026-06-17",
        "2026-06-18"
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
   SHARE SYSTEM (MATCH)
========================= */

function getShareLinks(match) {

    const text = `⚽ ${match.team1} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.team2} | World Goal 2026`;
    const url = window.location.href;

    return {
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`,
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
        reddit: `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`,
        threads: `https://www.threads.net/intent/post?text=${encodeURIComponent(text + " " + url)}`,
        quora: `https://www.quora.com/share?url=${encodeURIComponent(url)}`,
        youtube: match.links?.[0]?.url || url
    };
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

    const share = getShareLinks(m);

    return `
    <div class="match-card">

        <div class="match-status ${m.status.toLowerCase()}">
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
            🕒 ${m.timeAR || "-"}
        </div>

        ${(m.goals?.length || m.redCards?.length || m.links?.length) ? `
        <div class="match-extra">

            ${m.goals?.length ? `
            <div class="goals">
                ${m.goals.map(g => `
                    <div class="event goal">
                        ⚽ ${g.player} (${g.minute}')
                    </div>
                `).join("")}
            </div>
            ` : ""}

            ${m.redCards?.length ? `
            <div class="redcards">
                ${m.redCards.map(r => `
                    <div class="event red">
                        🟥 ${r.player} (${r.minute}')
                    </div>
                `).join("")}
            </div>
            ` : ""}

            ${m.links?.length ? `
            <div class="match-links-extra">
                ${m.links.map(l => `
                    <a href="${l.url}" target="_blank">
                        <img src="${l.logo || ''}" alt="${l.name || 'link'}">
                        ${l.name || "Link"}
                    </a>
                `).join("")}
            </div>
            ` : ""}

        </div>
        ` : ""}

    </div>
    `;
}).join("");

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

/* =========================
   SHARE HOME
========================= */

function setShareHome() {

    const wa = document.getElementById("share-wa");
    const tw = document.getElementById("share-tw");
    const fb = document.getElementById("share-fb");
    const re = document.getElementById("share-re");
    const th = document.getElementById("share-th");
    const qu = document.getElementById("share-qu");

    if (!wa || !tw || !fb || !re || !th) return;

    const url = window.location.href;
    const text = "⚽ World Goal 2026 - Live Matches";

    wa.href = `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`;
    tw.href = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text + " " + url)}`;
    fb.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    re.href = `https://www.reddit.com/submit?url=${encodeURIComponent(url)}&title=${encodeURIComponent(text)}`;
    th.href = `https://www.threads.net/intent/post?text=${encodeURIComponent(text + " " + url)}`;

    if (qu) {
        qu.href = `https://www.quora.com/share?url=${encodeURIComponent(url)}`;
    }
}
