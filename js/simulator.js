/********************************************
 WORLD GOAL 2026
 FIFA PRO SIMULATOR ENGINE (REAL SLOT SYSTEM)
********************************************/

const GROUPS = [
"A","B","C","D","E","F",
"G","H","I","J","K","L"
];

const Simulator = {
    groups: [],
    rankings: {},       // A-Team -> position
    thirds: {},         // group -> team
    selectedThirds: new Set()
};

/* =========================
   INIT
========================= */

document.addEventListener("DOMContentLoaded", async () => {
    await loadGroups();
    renderGroups();
});

/* =========================
   LOAD GROUPS
========================= */

async function loadGroups() {

    Simulator.groups = [];

    for (const letter of GROUPS) {

        try {
            const res = await fetch(`../data/groups/groups-${letter.toLowerCase()}.json`);
            const matches = await res.json();

            const teams = [...new Set(
                matches.flatMap(m => [m.team1, m.team2])
            )];

            Simulator.groups.push({ letter, teams });

        } catch (e) {
            console.error("Error loading group", letter, e);
        }
    }
}

/* =========================
   GROUP STAGE
========================= */

function renderGroups() {

    const root = document.getElementById("simulator-root");

    root.innerHTML = `
        <div class="sim-header">
            <h2>🏆 GROUP STAGE</h2>
            <p>Select 1st, 2nd and 3rd place</p>
        </div>

        <div class="sim-groups-grid">
            ${Simulator.groups.map(renderGroup).join("")}
        </div>

        <div id="continue-wrapper"></div>
    `;

    attachGroupEvents();
    updateContinueButton();
}

/* =========================
   GROUP CARD
========================= */

function renderGroup(group) {

    return `
    <div class="sim-group">
        <div class="sim-group-title">GROUP ${group.letter}</div>

        ${group.teams.map(team => {

            const key = `${group.letter}-${team}`;
            const pos = Simulator.rankings[key] || 0;

            return `
            <div class="sim-team pos-${pos}"
                 data-group="${group.letter}"
                 data-team="${team}">
                <span class="sim-medal">${getMedal(pos)}</span>
                ${team}
            </div>`;
        }).join("")}
    </div>`;
}

/* =========================
   EVENTS
========================= */

function attachGroupEvents() {

    document.querySelectorAll(".sim-team").forEach(el => {
        el.onclick = () => {
            cycleTeam(el.dataset.group, el.dataset.team);
        };
    });
}

/* =========================
   MEDALS
========================= */

function getMedal(pos) {
    if (pos === 1) return "🥇";
    if (pos === 2) return "🥈";
    if (pos === 3) return "🥉";
    return "";
}

/* =========================
   SELECTION LOGIC
========================= */

window.cycleTeam = function(group, team) {

    const key = `${group}-${team}`;

    const groupKeys = Object.keys(Simulator.rankings)
        .filter(k => k.startsWith(group + "-"))
        .sort((a,b) => Simulator.rankings[a] - Simulator.rankings[b]);

    if (Simulator.rankings[key]) {

        delete Simulator.rankings[key];

        const remaining = Object.keys(Simulator.rankings)
            .filter(k => k.startsWith(group + "-"))
            .sort((a,b) => Simulator.rankings[a] - Simulator.rankings[b]);

        remaining.forEach((k, i) => Simulator.rankings[k] = i + 1);

        renderGroups();
        return;
    }

    if (groupKeys.length >= 3) return;

    Simulator.rankings[key] = groupKeys.length + 1;

    renderGroups();
};

/* =========================
   VALIDATION
========================= */

function groupsComplete() {

    return Simulator.groups.every(g => {

        const values = Object.entries(Simulator.rankings)
            .filter(([k]) => k.startsWith(g.letter + "-"))
            .map(([,v]) => v);

        if (values.length !== 3) return false;

        values.sort((a,b)=>a-b);

        return values[0] === 1 &&
               values[1] === 2 &&
               values[2] === 3;
    });
}

/* =========================
   CONTINUE
========================= */

function updateContinueButton() {

    const wrapper = document.getElementById("continue-wrapper");

    if (!wrapper) return;

    if (!groupsComplete()) {
        wrapper.innerHTML = "";
        return;
    }

    wrapper.innerHTML = `
        <button class="sim-continue-btn" onclick="showThirds()">
            CONTINUE →
        </button>
    `;
}

/* =========================
   THIRD STAGE
========================= */

window.showThirds = function() {

    const root = document.getElementById("simulator-root");

    Simulator.thirds = {};

    Simulator.groups.forEach(g => {

        const third = Object.entries(Simulator.rankings)
            .find(([k,v]) => k.startsWith(g.letter+"-") && v === 3);

        if (third) {
            Simulator.thirds[g.letter] =
                third[0].replace(g.letter+"-", "");
        }
    });

    root.innerHTML = `
        <h2>🥉 BEST THIRD PLACES</h2>

        <div class="third-grid">

            ${Object.entries(Simulator.thirds).map(([g,team],i)=>`
                <div class="third-card"
                     onclick="toggleThird('${g}','${team}',this)">
                    ${team}
                </div>
            `).join("")}

        </div>

        <button class="sim-continue-btn" onclick="generateBracket()">
            GENERATE ROUND OF 32
        </button>
    `;
};

/* =========================
   THIRD SELECT
========================= */

window.toggleThird = function(group, team, el) {

    const id = `${group}-${team}`;

    if (Simulator.selectedThirds.has(id)) {

        Simulator.selectedThirds.delete(id);
        el.classList.remove("selected-third");

    } else {

        if (Simulator.selectedThirds.size >= 8) return;

        Simulator.selectedThirds.add(id);
        el.classList.add("selected-third");
    }
};

/* =========================
   FIFA REAL ENGINE
   (NO SHUFFLE - SLOT SYSTEM)
========================= */

const FIFA_BRACKET = [
    ["A1","C2"], ["B1","A3"], ["C1","B3"], ["D1","C3"],
    ["E1","F2"], ["F1","E3"], ["G1","H2"], ["H1","G3"],

    ["I1","J2"], ["J1","I3"], ["K1","L2"], ["L1","K3"],

    ["A2","B2"], ["D2","E2"], ["F3","G2"], ["H3","I2"]
];

/* =========================
   GENERATE BRACKET
========================= */

window.generateBracket = function() {

    if (Simulator.selectedThirds.size !== 8) {
        alert("Select exactly 8 third-place teams");
        return;
    }

    const data = buildQualifiedTeams();

    const map = buildTeamMap(data);

    const matches = FIFA_BRACKET.map(([a,b]) => [
        map[a] || "TBD",
        map[b] || "TBD"
    ]);

    renderRound32(matches);
};

/* =========================
   BUILD QUALIFIED
========================= */

function buildQualifiedTeams() {

    const firsts = {};
    const seconds = {};

    Simulator.groups.forEach(g => {

        const entries = Object.entries(Simulator.rankings)
            .filter(([k]) => k.startsWith(g.letter + "-"));

        const get = pos =>
            entries.find(([,v]) => v === pos)
            ?.[0]?.replace(g.letter + "-", "");

        if (get(1)) firsts[g.letter] = get(1);
        if (get(2)) seconds[g.letter] = get(2);
    });

    return {
        firsts,
        seconds,
        thirds: Simulator.thirds
    };
}

/* =========================
   SLOT RESOLVER (CORE FIFA LOGIC)
========================= */

function buildTeamMap(data) {

    const map = {};

    Object.entries(data.firsts).forEach(([g,t]) => map[`${g}1`] = t);
    Object.entries(data.seconds).forEach(([g,t]) => map[`${g}2`] = t);
    Object.entries(data.thirds).forEach(([g,t]) => map[`${g}3`] = t);

    return map;
}

/* =========================
   SHUFFLE (solo UI opcional)
========================= */

function shuffle(arr) {
    const a = [...arr];
    for (let i=a.length-1;i>0;i--) {
        const j = Math.floor(Math.random()*(i+1));
        [a[i],a[j]] = [a[j],a[i]];
    }
    return a;
}

/* =========================
   RENDER BRACKET
========================= */

function renderRound32(matches) {

    const root = document.getElementById("simulator-root");

    root.innerHTML = `
        <div class="espn-bracket">
            <h2>⚔️ ROUND OF 32</h2>

            <div class="round32-grid">

                ${matches.map((m,i)=>`
                    <div class="bracket-match">
                        <div class="bracket-game">MATCH ${i+1}</div>
                        <div class="bracket-team">${m[0]}</div>
                        <div class="bracket-vs">VS</div>
                        <div class="bracket-team">${m[1]}</div>
                    </div>
                `).join("")}

            </div>
        </div>
    `;
}
