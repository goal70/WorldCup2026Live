/********************************************
 WORLD GOAL 2026
 FIFA PRO SIMULATOR ENGINE (EA STYLE FIX)
********************************************/

const GROUPS = [
"A","B","C","D","E","F",
"G","H","I","J","K","L"
];

const Simulator = {
    groups: [],
    rankings: {},
    selectedThirds: new Set()
};

const Knockout = {
    r32: [],
    r16: [],
    qf: [],
    sf: [],
    final: [],
    champion: ""
};

const FLAGS = {
    "Argentina":"ar",
    "Brazil":"br",
    "Mexico":"mx",
    "United States":"us",
    "Canada":"ca",
    "Australia":"au",
    "England":"gb-eng",
    "Scotland":"gb-sct",
    "Wales":"gb-wls",
    "Germany":"de",
    "France":"fr",
    "Spain":"es",
    "Portugal":"pt",
    "Italy":"it",
    "Netherlands":"nl",
    "Belgium":"be",
    "Japan":"jp",
    "South Korea":"kr",
    "Morocco":"ma",
    "Senegal":"sn"
};
function teamLabel(team){

    const code = FLAGS[team];

    if(!code) return team;

    return `
        <img
            src="https://flagcdn.com/24x18/${code}.png"
            class="team-flag"
            alt="${team}"
        >
        ${team}
    `;
}
/* =========================
   GLOBAL ANTI DUPLICADOS (CLAVE REAL)
========================= */

const GlobalState = {
    usedTeams: new Set()
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

            const teams = [...new Set(matches.flatMap(m => [m.team1, m.team2]))];

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
        el.onclick = () => cycleTeam(el.dataset.group, el.dataset.team);
    });
}

/* =========================
   SELECCIÓN GRUPOS
========================= */

window.cycleTeam = function(group, team) {

    const key = `${group}-${team}`;

    const groupKeys = Object.keys(Simulator.rankings)
        .filter(k => k.startsWith(group + "-"));

    if (Simulator.rankings[key]) {
        delete Simulator.rankings[key];

        const remaining = Object.keys(Simulator.rankings)
            .filter(k => k.startsWith(group + "-"));

        remaining.forEach((k, i) => Simulator.rankings[k] = i + 1);

        renderGroups();
        return;
    }

    if (groupKeys.length >= 3) return;

    Simulator.rankings[key] = groupKeys.length + 1;

    renderGroups();
};

/* =========================
   VALIDACIÓN
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

    Simulator.selectedThirds.clear();

    const root = document.getElementById("simulator-root");

    const thirds = {};

    Simulator.groups.forEach(g => {

        const third = Object.entries(Simulator.rankings)
            .find(([k,v]) => k.startsWith(g.letter + "-") && v === 3);

        if (third) {
            thirds[g.letter] = third[0].split("-")[1];
        }
    });

    root.innerHTML = `
        <h2>🥉 BEST THIRD PLACES</h2>

        <div class="third-grid">

            ${Object.entries(thirds).map(([g,team]) => `
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
   TOGGLE TERCEROS
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

window.generateBracket = function () {

    if (Simulator.selectedThirds.size !== 8) {
        alert("Select exactly 8 third-place teams");
        return;
    }

    /* RESET ANTI-DUPLICADOS */
    GlobalState.usedTeams.clear();

    /* EQUIPOS CLASIFICADOS */
    const data = buildQualifiedTeams();

    /* TERCEROS SELECCIONADOS */
    Simulator.selectedThirds.forEach(item => {

        const [group, team] = item.split("-");

        data.thirds[group] = team;
    });

    const usedThirdGroups = new Set();

    const resolveThird = (options, thirdsMap) => {

        const candidates = options.split("/");

        for (const g of candidates) {

            if (
                thirdsMap[g] &&
                !usedThirdGroups.has(g)
            ) {

                usedThirdGroups.add(g);

                return thirdsMap[g];
            }
        }

        return "TBD";
    };

    const resolve = (code) => {

        let team = "TBD";

        if (code.startsWith("1")) {
            team = data.firsts[code[1]] || "TBD";
        }
        else if (code.startsWith("2")) {
            team = data.seconds[code[1]] || "TBD";
        }
        else if (code.startsWith("3")) {
            team = resolveThird(code.slice(1), data.thirds);
        }

        if (team !== "TBD") {

            if (GlobalState.usedTeams.has(team)) {
                return "TBD";
            }

            GlobalState.usedTeams.add(team);
        }

        return team;
    };

    Knockout.r32 = FIXED_ROUND32.map(([a,b]) => [
        resolve(a),
        resolve(b)
    ]);

    Knockout.r16 = new Array(16).fill(null);
    Knockout.qf = new Array(8).fill(null);
    Knockout.sf = new Array(4).fill(null);
    Knockout.final = new Array(2).fill(null);
    Knockout.champion = "";

    renderKnockout();
};

/* =========================
   QUALIFIED TEAMS
========================= */

function buildQualifiedTeams() {

    const firsts = {};
    const seconds = {};

    Simulator.groups.forEach(g => {

        const entries = Object.entries(Simulator.rankings)
            .filter(([k]) => k.startsWith(g.letter + "-"));

        const get = pos =>
            entries.find(([,v]) => v === pos)
            ?.[0]?.split("-")[1];

        if (get(1)) firsts[g.letter] = get(1);
        if (get(2)) seconds[g.letter] = get(2);
    });

    return { firsts, seconds, thirds: {} };
}

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
   BRACKET RENDER (igual EA style)
========================= */

function renderKnockout() {

    const root = document.getElementById("simulator-root");

    root.innerHTML = `
    <div class="worldcup-bracket fifa-bracket">

        <!-- ROUND OF 32 -->
        <div class="round-column round32">
            <h3>ROUND OF 32</h3>

            ${Knockout.r32.map((m, i) => `
                <div class="match-box">

                    <div class="team-btn selectable"
                         onclick="advanceTeam(32,${i},0)">
                        ${teamLabel(m?.[0] || "")}
                    </div>

                    <div class="team-btn selectable"
                         onclick="advanceTeam(32,${i},1)">
                        ${teamLabel(m?.[1] || "")}
                    </div>

                </div>
            `).join("")}
        </div>

        <!-- ROUND OF 16 -->
        <div class="round-column round16">
            <h3>ROUND OF 16</h3>

            ${Array.from({ length: 8 }).map((_, i) => {

                const t1 = Knockout.r16?.[i * 2];
                const t2 = Knockout.r16?.[i * 2 + 1];

                return `
                <div class="match-box">

                    <div class="team-btn selectable"
                        ${t1 ? `onclick="advanceKnockoutWinner(16,${i},0)"` : ""}>
                        ${t1 ? teamLabel(t1) : ""}
                    </div>

                    <div class="team-btn selectable"
                        ${t2 ? `onclick="advanceKnockoutWinner(16,${i},1)"` : ""}>
                        ${t2 ? teamLabel(t2) : ""}
                    </div>

                </div>
                `;
            }).join("")}
        </div>

        <!-- QUARTERS -->
        <div class="round-column quarter">
            <h3>QUARTERS</h3>

            ${Array.from({ length: 4 }).map((_, i) => {

                const t1 = Knockout.qf?.[i * 2];
                const t2 = Knockout.qf?.[i * 2 + 1];

                return `
                <div class="match-box">

                    <div class="team-btn selectable"
                        ${t1 ? `onclick="advanceKnockoutWinner(8,${i},0)"` : ""}>
                        ${t1 || ""}
                    </div>

                    <div class="team-btn selectable"
                        ${t2 ? `onclick="advanceKnockoutWinner(8,${i},1)"` : ""}>
                        ${t2 || ""}
                    </div>

                </div>
                `;
            }).join("")}
        </div>

        <!-- SEMI FINAL -->
        <div class="round-column semi">
            <h3>SEMI FINAL</h3>

            ${Array.from({ length: 2 }).map((_, i) => {

                const t1 = Knockout.sf?.[i * 2];
                const t2 = Knockout.sf?.[i * 2 + 1];

                return `
                <div class="match-box">

                    <div class="team-btn selectable"
                        ${t1 ? `onclick="advanceKnockoutWinner(4,${i},0)"` : ""}>
                        ${t1 || ""}
                    </div>

                    <div class="team-btn selectable"
                        ${t2 ? `onclick="advanceKnockoutWinner(4,${i},1)"` : ""}>
                        ${t2 || ""}
                    </div>

                </div>
                `;
            }).join("")}
        </div>

      <!-- FINAL -->
<div class="bracket-center">

    <div class="trophy">🏆</div>

    <div class="${Knockout.final?.[0] && Knockout.final?.[0] !== "TBD"
        ? "final-box selectable active"
        : "final-box selectable"}"
        ${Knockout.final?.[0] && Knockout.final?.[0] !== "TBD"
            ? `onclick="advanceKnockoutWinner(2,0,0)"`
            : ""}>
        ${Knockout.final?.[0] || "FINALIST"}
    </div>

    <div class="${Knockout.final?.[1] && Knockout.final?.[1] !== "TBD"
        ? "final-box selectable active"
        : "final-box selectable"}"
        ${Knockout.final?.[1] && Knockout.final?.[1] !== "TBD"
            ? `onclick="advanceKnockoutWinner(2,0,1)"`
            : ""}>
        ${Knockout.final?.[1] || "FINALIST"}
    </div>

    <div class="champion-box">
        ${Knockout.champion || "WORLD CHAMPION"}
    </div>

</div>

/* =========================
   ADVANCE (igual tu lógica)
========================= */

window.advanceTeam = function(round, matchIndex, teamIndex){

    let winner;

    if(round === 32){

        winner = Knockout.r32?.[matchIndex]?.[teamIndex];
        if (!winner || winner === "TBD") return;

        const slot = Math.floor(matchIndex / 2);

        if(matchIndex % 2 === 0){
            Knockout.r16[slot*2] = winner;
        }else{
            Knockout.r16[slot*2+1] = winner;
        }

        Knockout.qf.fill(null);
        Knockout.sf.fill(null);
        Knockout.final.fill(null);
        Knockout.champion = "";
    }

    renderKnockout();
};


window.advanceKnockoutWinner = function(round, match, side){

    let winner;

    /* OCTAVOS → CUARTOS */
    if(round === 16){

        winner = side === 0
            ? Knockout.r16?.[match*2]
            : Knockout.r16?.[match*2+1];

        if (!winner || winner === "TBD") return;

        Knockout.qf[match] = winner;

        Knockout.sf.fill(null);
        Knockout.final.fill(null);
        Knockout.champion = "";
    }

    /* CUARTOS → SEMI */
    else if(round === 8){

        winner = side === 0
            ? Knockout.qf?.[match*2]
            : Knockout.qf?.[match*2+1];

        if (!winner || winner === "TBD") return;

        const semiSlot = Math.floor(match / 2);

        if(match % 2 === 0){
            Knockout.sf[semiSlot * 2] = winner;
        }else{
            Knockout.sf[semiSlot * 2 + 1] = winner;
        }

        Knockout.final.fill(null);
        Knockout.champion = "";
    }

    /* SEMI → FINAL */
    else if(round === 4){

        winner = side === 0
            ? Knockout.sf?.[match*2]
            : Knockout.sf?.[match*2+1];

        if (!winner || winner === "TBD") return;

        Knockout.final[match] = winner;

        Knockout.champion = "";
    }

    /* FINAL → CAMPEÓN */
    else if(round === 2){

        winner = side === 0
            ? Knockout.final?.[0]
            : Knockout.final?.[1];

        if (!winner || winner === "TBD") return;

        Knockout.champion = winner;

        if (!championCelebrated) {
            championCelebrated = true;
            launchConfetti();
        }
    }

    renderKnockout();
};
/***********************
 * UTILIDADES
***********************/
function launchConfetti() {
    const colors = ["#ff0040", "#ffcc00", "#00c3ff", "#7cff00", "#ff7aff"];

    for (let i = 0; i < 80; i++) {
        const conf = document.createElement("div");

        conf.style.position = "fixed";
        conf.style.width = "8px";
        conf.style.height = "8px";
        conf.style.background = colors[Math.floor(Math.random() * colors.length)];
        conf.style.left = Math.random() * 100 + "vw";
        conf.style.top = "-10px";
        conf.style.opacity = Math.random();
        conf.style.zIndex = 9999;
        conf.style.borderRadius = "2px";

        document.body.appendChild(conf);

        const fall = conf.animate([
            { transform: "translateY(0px) rotate(0deg)" },
            { transform: `translateY(${window.innerHeight + 100}px) rotate(720deg)` }
        ], {
            duration: 2000 + Math.random() * 2000,
            easing: "cubic-bezier(.2,.6,.2,1)"
        });

        fall.onfinish = () => conf.remove();
    }
}
