/********************************************
 WORLD GOAL 2026
 ESPN PRO SIMULATOR
********************************************/

const GROUPS = [
"A","B","C","D","E","F",
"G","H","I","J","K","L"
];

const Simulator = {
    groups: [],
    rankings: {},
    thirds: [],
    selectedThirds: new Set()
};

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
            const response = await fetch(
                `../data/groups/groups-${letter.toLowerCase()}.json`
            );

            const matches = await response.json();

            const teams = [...new Set(
                matches.flatMap(m => [m.team1, m.team2])
            )];

            Simulator.groups.push({ letter, teams });

        } catch(err) {
            console.error("Error loading group", letter, err);
        }
    }
}

/* =========================
   GROUP SCREEN
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
   EVENTS (FIX IMPORTANTE)
========================= */

function attachGroupEvents() {
    document.querySelectorAll(".sim-team").forEach(el => {
        el.addEventListener("click", () => {
            cycleTeam(el.dataset.group, el.dataset.team);
        });
    });
}

/* =========================
   MEDALS
========================= */

function getMedal(pos) {
    if(pos===1) return "🥇";
    if(pos===2) return "🥈";
    if(pos===3) return "🥉";
    return "";
}

/* =========================
   TEAM SELECTION LOGIC
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

        const sorted = values.sort((a,b)=>a-b);
        return sorted[0] === 1 && sorted[1] === 2 && sorted[2] === 3;
    });
}

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
   THIRD PLACE SCREEN
========================= */

window.showThirds = function() {
    const root = document.getElementById("simulator-root");

    Simulator.thirds = [];

    Simulator.groups.forEach(g => {
        const third = Object.entries(Simulator.rankings)
            .find(([k,v]) => k.startsWith(g.letter+"-") && v===3);

        if (third) {
            Simulator.thirds.push({
                group: g.letter,
                team: third[0].replace(g.letter+"-","")
            });
        }
    });

    root.innerHTML = `
        <h2>🥉 BEST THIRD PLACES</h2>

        <div class="third-grid">
            ${Simulator.thirds.map((t,i)=>`
                <div class="third-card"
                     onclick="toggleThird(${i},this)">
                    ${t.team}
                </div>
            `).join("")}
        </div>

        <button class="sim-continue-btn" onclick="generateBracket()">
            GENERATE ROUND OF 32
        </button>
    `;
};

/* =========================
   THIRD SELECTION
========================= */

window.toggleThird = function(index, el) {
    const third = Simulator.thirds[index];
    const id = `${third.group}-${third.team}`;

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
   BRACKET GENERATION
========================= */

window.generateBracket = function() {

    if (Simulator.selectedThirds.size !== 8) {
        alert("Select exactly 8 best third-place teams");
        return;
    }

    const qualified = buildQualifiedTeams();
    const matches = createOfficialRound32(qualified);

    renderRound32(matches);
};

/* =========================
   QUALIFIED TEAMS
========================= */

function buildQualifiedTeams() {

    const firsts = {};
    const seconds = {};
    const thirds = {};

    Simulator.groups.forEach(g => {

        const entries = Object.entries(Simulator.rankings)
            .filter(([k]) => k.startsWith(g.letter + "-"));

        const getTeam = pos =>
            entries.find(([,v]) => v === pos)?.[0]?.replace(g.letter + "-", "");

        const first = getTeam(1);
        const second = getTeam(2);

        if (first) firsts[g.letter] = first;
        if (second) seconds[g.letter] = second;
    });

    Simulator.selectedThirds.forEach(id => {
        const [group, team] = id.split("-");
        thirds[group] = team;
    });

    return { firsts, seconds, thirds };
}

/* =========================
   SHUFFLE
========================= */

function shuffle(array) {
    const arr = [...array];

    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr;
}

/* =========================
   ROUND OF 32
========================= */

function createOfficialRound32(data) {

    const F = data.firsts;
    const S = data.seconds;

    const T = shuffle(Object.values(data.thirds || []));

    const safe = (v) => v || "TBD";

    return [
        [safe(F.E), safe(T[0])],
        [safe(F.I), safe(F.L)],
        [safe(S.A), safe(S.B)],
        [safe(F.F), safe(S.C)],
        [safe(S.K), safe(S.L)],
        [safe(F.H), safe(S.J)],
        [safe(T[1]), safe(F.G)],
        [safe(F.C), safe(S.F)],

        [safe(S.E), safe(S.I)],
        [safe(F.A), safe(T[2])],
        [safe(F.J), safe(T[3])],
        [safe(S.H), safe(S.D)],
        [safe(S.G), safe(F.B)],
        [safe(T[4]), safe(F.K)],
        [safe(F.D), safe(T[5])],
        [safe(T[6]), safe(T[7])]
    ];
}

/* =========================
   RENDER BRACKET
========================= */

function renderRound32(matches) {
    const root = document.getElementById("simulator-root");

    root.innerHTML = `
        <div class="espn-bracket">
            <h2>⚔️ ROUND OF 32</h2>
            <p style="text-align:center;margin-bottom:20px;color:#aaa;">
                FIFA 2026 style bracket
            </p>

            <div class="round32-grid">
                ${matches.map((match,index)=>`
                    <div class="bracket-match">
                        <div class="bracket-game">MATCH ${index + 1}</div>
                        <div class="bracket-team">${match[0]}</div>
                        <div class="bracket-vs">VS</div>
                        <div class="bracket-team">${match[1]}</div>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}
