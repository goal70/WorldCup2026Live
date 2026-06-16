/*************************************************
 * WORLD GOAL 2026 - TOURNAMENT SIMULATOR ENGINE
 * Groups → Medals → Thirds → Round of 16
 *************************************************/

const Simulator = {
    stage: "groups",

    groups: [],

    matches: new Map(), // matchId -> { team1, team2 }

    medals: new Map(), // matchId -> gold/silver/bronze

    thirdPlaces: [],

    bestThirds: [],

    knockout: []
};

/* =================================================
   INIT
================================================= */

document.addEventListener("DOMContentLoaded", () => {
    const root = document.getElementById("simulator");
    if (!root) return;

    renderGroups(Simulator.groups);
});

/* =================================================
   GROUPS RENDER (compacto estilo ESPN)
================================================= */

function renderGroups(groups) {
    const container = document.getElementById("simulator");
    if (!container) return;

    container.innerHTML = `
        <div class="sim-title">🏆 GROUP STAGE</div>
        <div class="groups-grid"></div>
    `;

    const grid = container.querySelector(".groups-grid");

    groups.forEach(group => {
        const box = document.createElement("div");
        box.className = "group-mini";

        box.innerHTML = `
            <h3>Group ${group.name}</h3>

            <div class="group-matches">
                ${group.matches.map(m => renderMatch(m)).join("")}
            </div>
        `;

        grid.appendChild(box);
    });
}

/* =================================================
   MATCH RENDER + MEDALS
================================================= */

function renderMatch(match) {
    const medal = Simulator.medals.get(match.id);

    return `
        <div class="match-card small" onclick="cycleMedal('${match.id}')">
            <div class="teams">
                ${match.team1} vs ${match.team2}
            </div>

            <div class="medal">
                ${medal === "gold" ? "🥇" : ""}
                ${medal === "silver" ? "🥈" : ""}
                ${medal === "bronze" ? "🥉" : ""}
            </div>
        </div>
    `;
}

/* =================================================
   MEDAL SYSTEM (cycle click)
================================================= */

function cycleMedal(matchId) {

    const current = Simulator.medals.get(matchId);

    let next = null;

    if (!current) next = "gold";
    else if (current === "gold") next = "silver";
    else if (current === "silver") next = "bronze";
    else next = null;

    if (next) {
        Simulator.medals.set(matchId, next);
    } else {
        Simulator.medals.delete(matchId);
    }

    refreshUI();
}

/* =================================================
   UI REFRESH (sin romper estado)
================================================= */

function refreshUI() {
    if (Simulator.stage === "groups") {
        renderGroups(Simulator.groups);

        if (isGroupStageComplete()) {
            setTimeout(goToThirdStage, 500);
        }
    }
}

/* =================================================
   CHECK GROUP COMPLETION
================================================= */

function isGroupStageComplete() {
    const totalMatches = countAllMatches();
    return Simulator.medals.size === totalMatches;
}

function countAllMatches() {
    let total = 0;
    Simulator.groups.forEach(g => total += g.matches.length);
    return total;
}

/* =================================================
   THIRD PLACE STAGE
================================================= */

function goToThirdStage() {

    Simulator.stage = "thirds";

    Simulator.thirdPlaces = calculateThirdPlaces();

    const container = document.getElementById("simulator");

    container.innerHTML = `
        <div class="sim-title">🥉 BEST THIRD PLACES</div>
        <p class="sim-sub">Select 8 teams</p>

        <div class="thirds-grid">
            ${Simulator.thirdPlaces.map(t => `
                <div class="third-card" onclick="toggleThird('${t.id}', this)">
                    ${t.name}
                </div>
            `).join("")}
        </div>

        <button class="sim-btn" onclick="generateKnockout()">
            Generate Round of 16
        </button>
    `;
}

/* =================================================
   SELECT BEST 3RD (max 8)
================================================= */

function toggleThird(id, el) {

    const exists = Simulator.bestThirds.includes(id);

    if (exists) {
        Simulator.bestThirds = Simulator.bestThirds.filter(x => x !== id);
        el.classList.remove("selected");
        return;
    }

    if (Simulator.bestThirds.length < 8) {
        Simulator.bestThirds.push(id);
        el.classList.add("selected");
    }
}

/* =================================================
   GENERATE ROUND OF 16 (FIFA STYLE)
================================================= */

function generateKnockout() {

    Simulator.stage = "knockout";

    const qualified = buildQualifiedTeams();

    Simulator.knockout = buildRoundOf16(qualified);

    renderKnockout();
}

/* =================================================
   QUALIFIED TEAMS (TOP 2 + BEST 3RD)
================================================= */

function buildQualifiedTeams() {

    const topTeams = [];

    Simulator.groups.forEach(g => {
        topTeams.push(...getTop2(g));
    });

    const thirds = Simulator.thirdPlaces
        .filter(t => Simulator.bestThirds.includes(t.id));

    return [...topTeams, ...thirds];
}

/* =================================================
   ROUND OF 16 STRUCTURE (FIFA FIXED)
================================================= */

function buildRoundOf16(teams) {

    return [
        { a: teams[0], b: teams[1] },
        { a: teams[2], b: teams[3] },
        { a: teams[4], b: teams[5] },
        { a: teams[6], b: teams[7] },
        { a: teams[8], b: teams[9] },
        { a: teams[10], b: teams[11] },
        { a: teams[12], b: teams[13] },
        { a: teams[14], b: teams[15] }
    ];
}

/* =================================================
   RENDER KNOCKOUT
================================================= */

function renderKnockout() {

    const container = document.getElementById("simulator");

    container.innerHTML = `
        <div class="sim-title">⚔️ ROUND OF 16</div>

        <div class="bracket">
            ${Simulator.knockout.map(m => `
                <div class="knock-match">
                    <span>${m.a}</span>
                    <span>VS</span>
                    <span>${m.b}</span>
                </div>
            `).join("")}
        </div>
    `;
}

/* =================================================
   HELPERS (simplificados)
================================================= */

function calculateThirdPlaces() {

    // placeholder (puedes conectar lógica real después)
    return Simulator.groups.map((g, i) => ({
        id: `t${i}`,
        name: `3rd ${g.name || i}`
    }));
}

function getTop2(group) {
    return group.teams.slice(0, 2);
}

/* =================================================
   EXPORT GLOBAL
================================================= */

window.cycleMedal = cycleMedal;
window.toggleThird = toggleThird;
window.generateKnockout = generateKnockout;
