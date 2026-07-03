/*************************************************
 * WORLD GOAL 2026 - ENTERPRISE APP ENGINE
 * SHARE SYSTEM + FIXED VERSION
 *************************************************/

let allMatches = [];

document.addEventListener("DOMContentLoaded", async () => {
    await loadMatches();
    setupNavigation();
    renderTables();

    setShareHome(); // 👈 ESTO ES LO QUE TE FALTABA
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

        /* ========= FASE DE GRUPOS ========= */

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

                    stadium: m.stadium || "",
                    city: m.city || "",
                    timeAR: m.timeAR || "-",

                    links: m.links || [],
                    goals: m.goals || [],
                    redCards: m.redCards || []

                });

            });

        }

        /* ========= FASE FINAL ========= */

        try {

            const resFinal = await fetch("data/fasefinal-matches.json");

            if (resFinal.ok) {

                const finalMatches = await resFinal.json();

                finalMatches.forEach(m => {

                    allMatches.push({

                        id: m.id,

                        type: "knockout",

                        group: "FASE FINAL",

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

                        penalties: m.penalties ?? null,

                        stadium: m.stadium || "",
                        city: m.city || "",
                        timeAR: m.timeAR || "-",

                        links: m.links || [],
                        goals: m.goals || [],
                        redCards: m.redCards || []

                    });

                });

            } else {

                console.warn("No se encontró fasefinal-matches.json");

            }

        } catch (err) {

            console.error("Error cargando Fase Final:", err);

        }

        showToday();

        renderTables();

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

    const year = d.getFullYear();

    const month = String(d.getMonth() + 1).padStart(2, "0");

    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

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

    bind("prevDateBtn7", () => {
        setActive("prevDateBtn7");
        showCustomDate("2026-06-17");
    });

    bind("prevDateBtn8", () => {
        setActive("prevDateBtn8");
        showCustomDate("2026-06-18");
    });

    bind("prevDateBtn9", () => {
        setActive("prevDateBtn9");
        showCustomDate("2026-06-19");
    });

    bind("prevDateBtn10", () => {
        setActive("prevDateBtn10");
        showCustomDate("2026-06-20");
    });

    bind("prevDateBtn11", () => {
        setActive("prevDateBtn11");
        showCustomDate("2026-06-21");
    });

    bind("prevDateBtn12", () => {
        setActive("prevDateBtn12");
        showCustomDate("2026-06-22");
    });

    bind("prevDateBtn13", () => {
        setActive("prevDateBtn13");
        showCustomDate("2026-06-23");
    });

    bind("prevDateBtn14", () => {
        setActive("prevDateBtn14");
        showCustomDate("2026-06-24");
    });

    bind("prevDateBtn15", () => {
        setActive("prevDateBtn15");
        showCustomDate("2026-06-25");
    });

    bind("prevDateBtn16", () => {
        setActive("prevDateBtn16");
        showCustomDate("2026-06-26");
    });

    bind("prevDateBtn17", () => {
        setActive("prevDateBtn17");
        showCustomDate("2026-06-27");
    });

    bind("prevDateBtn18", () => {
        setActive("prevDateBtn18");
        showCustomDate("2026-06-28");
    });

    bind("prevDateBtn19", () => {
        setActive("prevDateBtn19");
        showCustomDate("2026-06-29");
    });

    bind("prevDateBtn20", () => {
        setActive("prevDateBtn20");
        showCustomDate("2026-06-30");
    });

    bind("prevDateBtn21", () => {
        setActive("prevDateBtn21");
        showCustomDate("2026-07-01");
    });
}

/* =========================
   ACTIVE BUTTON
========================= */

function setActive(id) {

    document.querySelectorAll(".day-btn")
        .forEach(button => button.classList.remove("active"));

    const activeButton = document.getElementById(id);

    if (activeButton) {
        activeButton.classList.add("active");
    }

}

/* =========================
   SHARE SYSTEM
========================= */

function getShareLinks(match) {

    const url = window.location.href;

    const text = `⚽ ${match.team1} ${match.homeScore ?? 0} - ${match.awayScore ?? 0} ${match.team2} | World Goal 2026`;

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    return {

        whatsapp:
            `https://wa.me/?text=${encodedText}%20${encodedUrl}`,

        twitter:
            `https://twitter.com/intent/tweet?text=${encodedText}%20${encodedUrl}`,

        facebook:
            `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,

        reddit:
            `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`,

        threads:
            `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`,

        quora:
            `https://www.quora.com/share?url=${encodedUrl}`,

        youtube:
            (match.links && match.links.length)
                ? match.links[0].url
                : url

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

    const matches = allMatches.filter(m => {

        const matchDate = (m.date || "").slice(0, 10);

        return matchDate === date;

    });

    if (!matches.length) {

        container.innerHTML =
            `<div class="no-matches">No matches for this day</div>`;

        return;

    }

    container.innerHTML = matches.map(m => {

        const linksHTML = (m.links || []).map(l => `

            <a class="match-link"
               href="${l.url}"
               target="_blank"
               rel="noopener noreferrer">

                <img src="${l.logo}" alt="${l.name}">

                <span>${l.name}</span>

            </a>

        `).join("");

        const homeGoals = (m.goals || [])
            .filter(g => g.team === "home");

        const awayGoals = (m.goals || [])
            .filter(g => g.team === "away");

        const homeGoalsHTML = homeGoals.map(g => `

            <div class="goal left">
                ⚽ ${g.player}
                <span class="minute">${g.minute}</span>
            </div>

        `).join("");

        const awayGoalsHTML = awayGoals.map(g => `

            <div class="goal right">
                <span class="minute">${g.minute}</span>
                ${g.player} ⚽
            </div>

        `).join("");

        return `

        <div class="match-card">

            <div class="match-status ${(m.status || "UPCOMING").toLowerCase()}">
                ${m.status || "UPCOMING"}
            </div>

            <div style="text-align:center;font-weight:900;color:#00D26A;margin-bottom:6px;">

                ${
                    m.type === "knockout"
                        ? (m.stage || "Fase Final")
                        : `Grupo ${m.group}`
                }

            </div>

            <div class="match-header">

                <div class="team">

                    <img
                        src="${flagUrl(m.flag1)}"
                        class="flag"
                        alt="${m.team1}">

                    <span>${m.team1}</span>

                </div>

                <div class="score">

                    ${m.homeScore ?? 0} - ${m.awayScore ?? 0}

                    ${
                        m.penalties
                        ? `
                        <div class="penalties">
                            (${m.penalties.home}) - (${m.penalties.away})
                        </div>
                        `
                        : ""
                    }

                </div>

                <div class="team">

                    <span>${m.team2}</span>

                    <img
                        src="${flagUrl(m.flag2)}"
                        class="flag"
                        alt="${m.team2}">

                </div>

            </div>

            <div class="events">

                <div class="events-column left">

                    ${homeGoalsHTML}

                </div>

                <div class="events-column right">

                    ${awayGoalsHTML}

                </div>

            </div>

            <div class="match-footer">

                🏟 ${m.stadium || "-"} • ${m.city || "-"}

                <br>

                🕒 ${m.timeAR || "-"}

            </div>

            <div class="match-links">

                ${linksHTML}

            </div>

        </div>

        `;

    }).join("");

}

document.addEventListener("DOMContentLoaded", async () => {

    await loadMatches();

    setupNavigation();

    renderTables();

    setShareLinks();

});
