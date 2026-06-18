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
   THIRD STAGE
========================= */

window.showThirds = function() {

    const root = document.getElementById("simulator-root");

    const thirds = {};

    Simulator.groups.forEach(g => {

        const third = Object.entries(Simulator.rankings)
            .find(([k,v]) => k.startsWith(g.letter+"-") && v === 3);

        if (third) {
            thirds[g.letter] =
                third[0].replace(g.letter+"-", "");
        }
    });

    root.innerHTML = `
        <h2>🥉 BEST THIRD PLACES</h2>

        <div class="third-grid">

            ${Object.entries(thirds).map(([g,team])=>`
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
   FIXED BRACKET
========================= */

const FIXED_ROUND32 = [
  ["1E", "3A/B/C/D/F"],
  ["1I", "3C/D/F/G/H"],
  ["2A", "2B"],
  ["1F", "2C"],
  ["2K", "2L"],
  ["1H", "2J"],
  ["1D", "3B/E/F/I/J"],
  ["1G", "3A/E/H/I/J"],

  ["1C", "2F"],
  ["2E", "2I"],
  ["1A", "3C/E/F/H/I"],
  ["1L", "3E/H/I/J/K"],

  ["1J", "2H"],
  ["2D", "2G"],
  ["1B", "3E/F/G/I/J"],
  ["1K", "3D/E/I/J/L"]
];

/* =========================
   THIRD MAP BUILDER
========================= */

function buildThirdsMap() {

    const map = {};

    Simulator.selectedThirds.forEach(id => {
        const [g, team] = id.split("-");
        map[g] = team;
    });

    return map;
}

/* =========================
   GENERATE BRACKET
========================= */

window.generateBracket = function() {

    if (Simulator.selectedThirds.size !== 8) {
        alert("Select exactly 8 third-place teams");
        return;
    }

    const data = buildQualifiedTeams();

    data.thirds = buildThirdsMap(); // 🔥 FIX CLAVE

    const resolveThird = (options, thirdsMap) => {

        const candidates = options.split("/");

        for (let g of candidates) {
            if (thirdsMap[g]) return thirdsMap[g];
        }

        return "TBD";
    };

    const resolve = (code) => {

        if (code.startsWith("1")) {
            const g = code[1];
            return data.firsts[g] || "TBD";
        }

        if (code.startsWith("2")) {
            const g = code[1];
            return data.seconds[g] || "TBD";
        }

        if (code.startsWith("3")) {
            return resolveThird(code.slice(1), data.thirds);
        }

        return "TBD";
    };

    const matches = FIXED_ROUND32.map(([a,b]) => [
        resolve(a),
        resolve(b)
    ]);

    renderRound32(matches);
};

/* =========================
   BUILD QUALIFIED TEAMS
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
        thirds: {}
    };
}

/* =========================
   RENDER BRACKET
========================= */

function renderRound32(matches) {

    const root = document.getElementById("simulator-root");

    root.innerHTML = `
        <div class="world-bracket">

            <div class="world-cup-center">
                <img src="https://upload.wikimedia.org/wikipedia/en/e/e3/FIFA_World_Cup_Trophy.svg">
                <div class="world-cup-title">WORLD CUP 2026</div>
            </div>

            <div class="bracket-flow">

                <!-- ROUND OF 32 -->
                <div class="bracket-column" id="r32">
                    <div class="round-label">ROUND OF 32</div>
                    ${matches.map((m,i)=>`
                        <div class="bracket-match">
                            <div class="bracket-team">${m[0]}</div>
                            <div class="bracket-team">${m[1]}</div>
                        </div>
                    `).join("")}
                </div>

                <!-- ROUND OF 16 -->
                <div class="bracket-column" id="r16">
                    <div class="round-label">ROUND OF 16</div>
                </div>

                <!-- QUARTERFINALS -->
                <div class="bracket-column" id="qf">
                    <div class="round-label">QUARTERFINALS</div>
                </div>

                <!-- SEMIFINALS -->
                <div class="bracket-column" id="sf">
                    <div class="round-label">SEMIFINALS</div>
                </div>

                <!-- FINAL -->
                <div class="bracket-column" id="final">
                    <div class="round-label">FINAL</div>
                    <div class="bracket-match final-match">
                        <div class="bracket-team">WINNER SF1</div>
                        <div class="bracket-team">WINNER SF2</div>
                    </div>
                </div>

            </div>

        </div>
    `;

    drawBracketLines();
}

function drawBracketLines() {

    const svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
    svg.classList.add("bracket-svg");

    document.querySelector(".world-bracket").appendChild(svg);

    const draw = (x1,y1,x2,y2) => {
        const line = document.createElementNS("http://www.w3.org/2000/svg","line");
        line.setAttribute("x1",x1);
        line.setAttribute("y1",y1);
        line.setAttribute("x2",x2);
        line.setAttribute("y2",y2);
        line.setAttribute("stroke","#00ffb3");
        line.setAttribute("stroke-width","2");
        svg.appendChild(line);
    };

    const matches = document.querySelectorAll(".bracket-match");

    matches.forEach((m,i)=>{
        if(i === matches.length-1) return;

        const a = m.getBoundingClientRect();
        const b = matches[i+1]?.getBoundingClientRect();
        const s = svg.getBoundingClientRect();

        if(!b) return;

        draw(
            a.right - s.left,
            a.top + a.height/2 - s.top,
            b.left - s.left,
            b.top + b.height/2 - s.top
        );
    });
}
