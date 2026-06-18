/********************************************
 WORLD GOAL 2026
 ESPN PRO SIMULATOR (FIXED BRACKET SYSTEM)
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
            const response = await fetch(
                `../data/groups/groups-${letter.toLowerCase()}.json`
            );

            const matches = await response.json();

            const teams = [...new Set(
                matches.flatMap(m => [m.team1, m.team2])
            )];

            Simulator.groups.push({ letter, teams });

        } catch (err) {
            console.error("Error loading group", letter, err);
        }
    }
}

/* =========================
   RENDER GROUP STAGE
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
   EVENTS (SAFE)
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

    // REMOVE
    if (Simulator.rankings[key]) {

        delete Simulator.rankings[key];

        const remaining = Object.keys(Simulator.rankings)
            .filter(k => k.startsWith(group + "-"))
            .sort((a,b) => Simulator.rankings[a] - Simulator.rankings[b]);

        remaining.forEach((k, i) => {
            Simulator.rankings[k] = i + 1;
        });

        renderGroups();
        return;
    }

    // LIMIT 3
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
   CONTINUE BUTTON
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
   THIRD PLACE SCREEN
========================= */

window.showThirds = function() {

    const root = document.getElementById("simulator-root");

    Simulator.thirds = [];

    Simulator.groups.forEach(g => {

        const third = Object.entries(Simulator.rankings)
            .find(([k,v]) =>
                k.startsWith(g.letter + "-") && v === 3
            );

        if (third) {
            Simulator.thirds.push({
                group: g.letter,
                team: third[0].replace(g.letter + "-", "")
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
   GENERATE BRACKET
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
   BUILD TEAMS
========================= */

function buildQualifiedTeams() {

    const firsts = {};
    const seconds = {};
    const thirds = {};

    Simulator.groups.forEach(g => {

        const entries = Object.entries(Simulator.rankings)
            .filter(([k]) => k.startsWith(g.letter + "-"));

        const get = pos =>
            entries.find(([,v]) => v === pos)
            ?.[0]?.replace(g.letter + "-", "");

        if (get(1)) firsts[g.letter] = get(1);
        if (get(2)) seconds[g.letter] = get(2);
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

function shuffle(arr) {
    const a = [...arr];

    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }

    return a;
}

/* =========================
   ROUND OF 32 (FIXED STRUCTURE)
   ⚠️ SLOT-BASED SYSTEM (NO RANDOM BRACKETS)
========================= */

function createOfficialRound32(data) {

    const F = data.firsts;
    const S = data.seconds;
    const T = Object.values(data.thirds);

    const safe = v => v || "TBD";

    return [

        // LEFT SIDE
        [safe(F.A), safe(T[0])],
        [safe(F.B), safe(S.H)],
        [safe(F.C), safe(T[1])],
        [safe(F.D), safe(S.G)],
        [safe(F.E), safe(T[2])],
        [safe(F.F), safe(S.C)],
        [safe(F.G), safe(T[3])],
        [safe(F.H), safe(S.B)],

        // RIGHT SIDE
        [safe(F.I), safe(T[4])],
        [safe(F.J), safe(S.F)],
        [safe(F.K), safe(T[5])],
        [safe(F.L), safe(S.E)],
        [safe(S.A), safe(T[6])],
        [safe(S.D), safe(F.B)],
        [safe(S.I), safe(T[7])],
        [safe(S.J), safe(S.K)]
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
