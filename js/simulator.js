/*************************************************
 * WORLD GOAL 2026 - ESPN PRO SIMULATOR ENGINE
 * Visual Tournament System (Groups → Knockout)
 *************************************************/

const Simulator = {
    stage: "groups",

    groups: [],

    medals: new Map(),

    thirdPlaces: [],

    bestThirds: [],

    knockout: []
};

/* =========================================
   INIT
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("simulator");
    if (!root) return;

    renderGroups();
});

/* =========================================
   VISUAL GROUP STAGE (ESPN STYLE)
========================================= */

function renderGroups() {

    const container = document.getElementById("simulator");

    container.innerHTML = `
        <div class="espn-title">🏆 GROUP STAGE</div>
        <div class="espn-sub">Click teams to assign medals</div>

        <div class="espn-groups"></div>
    `;

    const grid = container.querySelector(".espn-groups");

    Simulator.groups.forEach(group => {

        const box = document.createElement("div");
        box.className = "espn-group";

        box.innerHTML = `
            <div class="group-header">GROUP ${group.name}</div>

            <div class="group-teams">
                ${group.teams.map(t => `
                    <div class="team-pill">${t}</div>
                `).join("")}
            </div>

            <div class="group-matches">
                ${group.matches.map(m => renderMatch(m)).join("")}
            </div>
        `;

        grid.appendChild(box);
    });
}

/* =========================================
   MATCH CARD (ESPN INTERACTIVE)
========================================= */

function renderMatch(match) {

    const medal = Simulator.medals.get(match.id);

    return `
        <div class="match-es" onclick="cycleMedal('${match.id}', this)">

            <div class="teams">
                ${match.team1} <span>vs</span> ${match.team2}
            </div>

            <div class="medals">
                ${medal === "gold" ? "🥇" : ""}
                ${medal === "silver" ? "🥈" : ""}
                ${medal === "bronze" ? "🥉" : ""}
            </div>

            <div class="glow"></div>
        </div>
    `;
}

/* =========================================
   MEDAL SYSTEM (ANIMATED)
========================================= */

function cycleMedal(id, el) {

    const current = Simulator.medals.get(id);

    let next =
        !current ? "gold" :
        current === "gold" ? "silver" :
        current === "silver" ? "bronze" :
        null;

    if (next) {
        Simulator.medals.set(id, next);
    } else {
        Simulator.medals.delete(id);
    }

    // 🔥 ANIMATION FEEDBACK
    el.classList.add("pulse");
    setTimeout(() => el.classList.remove("pulse"), 300);

    refresh();
}

/* =========================================
   REFRESH GROUPS (light rerender)
========================================= */

function refresh() {
    if (Simulator.stage === "groups") {
        renderGroups();

        if (isComplete()) {
            setTimeout(showThirdStage, 800);
        }
    }
}

/* =========================================
   GROUP COMPLETION CHECK
========================================= */

function isComplete() {
    let total = 0;

    Simulator.groups.forEach(g => total += g.matches.length);

    return Simulator.medals.size === total;
}

/* =========================================
   THIRD PLACE STAGE (TV STYLE SCREEN)
========================================= */

function showThirdStage() {

    Simulator.stage = "thirds";

    Simulator.thirdPlaces = generateThirds();

    const container = document.getElementById("simulator");

    container.innerHTML = `
        <div class="espn-title">🥉 BEST THIRD PLACES</div>
        <div class="espn-sub">Select 8 teams for knockout</div>

        <div class="third-grid">
            ${Simulator.thirdPlaces.map(t => `
                <div class="third-card" onclick="toggleThird('${t.id}', this)">
                    ${t.name}
                </div>
            `).join("")}
        </div>

        <button class="espn-btn" onclick="buildKnockout()">
            Generate Round of 16
        </button>
    `;
}

/* =========================================
   TOGGLE THIRD PLACE (MAX 8)
========================================= */

function toggleThird(id, el) {

    const exists = Simulator.bestThirds.includes(id);

    if (exists) {
        Simulator.bestThirds = Simulator.bestThirds.filter(x => x !== id);
        el.classList.remove("active");
    } else {
        if (Simulator.bestThirds.length < 8) {
            Simulator.bestThirds.push(id);
            el.classList.add("active");
        }
    }
}

/* =========================================
   BUILD KNOCKOUT
========================================= */

function buildKnockout() {

    Simulator.stage = "knockout";

    const qualified = buildQualified();

    Simulator.knockout = buildBracket(qualified);

    renderBracket();
}

/* =========================================
   QUALIFIED TEAMS
========================================= */

function buildQualified() {

    let top = [];

    Simulator.groups.forEach(g => {
        top.push(...g.teams.slice(0, 2));
    });

    let thirds = Simulator.thirdPlaces
        .filter(t => Simulator.bestThirds.includes(t.id))
        .map(t => t.name);

    return [...top, ...thirds];
}

/* =========================================
   FIFA ROUND OF 16 STRUCTURE
========================================= */

function buildBracket(teams) {

    return [
        [teams[0], teams[1]],
        [teams[2], teams[3]],
        [teams[4], teams[5]],
        [teams[6], teams[7]],
        [teams[8], teams[9]],
        [teams[10], teams[11]],
        [teams[12], teams[13]],
        [teams[14], teams[15]]
    ];
}

/* =========================================
   VISUAL BRACKET (ESPN STYLE + LINES)
========================================= */

function renderBracket() {

    const container = document.getElementById("simulator");

    container.innerHTML = `
        <div class="espn-title">⚔️ ROUND OF 16</div>

        <div class="bracket-wrap">
            <svg class="bracket-lines"></svg>

            <div class="bracket-grid">
                ${Simulator.knockout.map((m, i) => `
                    <div class="match-box" data-index="${i}">
                        <div>${m[0]}</div>
                        <div class="vs">VS</div>
                        <div>${m[1]}</div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;

    drawBracketLines();
}

/* =========================================
   SVG BRACKET LINES (ESPN STYLE CONNECTOR)
========================================= */

function drawBracketLines() {

    const svg = document.querySelector(".bracket-lines");
    const matches = document.querySelectorAll(".match-box");

    if (!svg || !matches.length) return;

    svg.innerHTML = "";

    matches.forEach((el, i) => {

        if (i % 2 === 0) {

            const a = el.getBoundingClientRect();
            const b = matches[i + 1]?.getBoundingClientRect();

            if (!b) return;

            const line = document.createElementNS("http://www.w3.org/2000/svg", "path");

            const x1 = a.right;
            const y1 = a.top + 20;
            const x2 = b.right;
            const y2 = b.top + 20;

            line.setAttribute("d", `M ${x1} ${y1} H ${x1+20} V ${y2} H ${x2}`);
            line.setAttribute("stroke", "#aaa");
            line.setAttribute("fill", "none");

            svg.appendChild(line);
        }
    });
}

/* =========================================
   HELPERS (placeholder data)
========================================= */

function generateThirds() {
    return Simulator.groups.map((g, i) => ({
        id: "t" + i,
        name: `3rd ${g.name || i}`
    }));
}

/* =========================================
   GLOBAL EXPORT
========================================= */

window.cycleMedal = cycleMedal;
window.toggleThird = toggleThird;
window.buildKnockout = buildKnockout;
