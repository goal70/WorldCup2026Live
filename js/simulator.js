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
    selectedThirds: []
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
                matches.flatMap(m => [
                    m.team1,
                    m.team2
                ])
            )];

            Simulator.groups.push({
                letter,
                teams
            });

        } catch(err) {

            console.error(
                "Error loading group",
                letter,
                err
            );
        }
    }
}

/* =========================
   GROUP SCREEN
========================= */

function renderGroups() {

    const root =
        document.getElementById("simulator-root");

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

    updateContinueButton();
}

/* =========================
   GROUP CARD
========================= */

function renderGroup(group) {

    return `
    <div class="sim-group">

        <div class="sim-group-title">
            GROUP ${group.letter}
        </div>

        ${group.teams.map(team => {

            const pos =
                Simulator.rankings[
                    `${group.letter}-${team}`
                ] || 0;

            return `
            <div
                class="sim-team pos-${pos}"
                onclick="cycleTeam(
                    '${group.letter}',
                    '${team.replace(/'/g,"")}'
                )"
            >

                <span class="sim-medal">
                    ${getMedal(pos)}
                </span>

                ${team}

            </div>
            `;

        }).join("")}

    </div>
    `;
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

window.cycleTeam = function(group, team) {

    const key = `${group}-${team}`;

    const groupTeams = Object.keys(
        Simulator.rankings
    ).filter(k =>
        k.startsWith(group + "-")
    );

    // Si ya estaba seleccionado lo quitamos
    if (Simulator.rankings[key]) {

        delete Simulator.rankings[key];

        const ordered = Object.keys(
            Simulator.rankings
        )
        .filter(k =>
            k.startsWith(group + "-")
        );

        ordered.forEach((k,index) => {
            Simulator.rankings[k] =
                index + 1;
        });

        renderGroups();
        return;
    }

    const used =
        groupTeams.length;

    if (used >= 3)
        return;

    Simulator.rankings[key] =
        used + 1;

    renderGroups();
};

/* =========================
   VALIDATION
========================= */

function groupsComplete() {

    return Simulator.groups.every(g => {

        const values =
            Object.entries(
                Simulator.rankings
            )
            .filter(([k]) =>
                k.startsWith(g.letter+"-")
            )
            .map(x => x[1]);

        return (
            values.includes(1) &&
            values.includes(2) &&
            values.includes(3)
        );

    });
}

function updateContinueButton() {

    const wrapper =
        document.getElementById(
            "continue-wrapper"
        );

    if(!wrapper) return;

    if(!groupsComplete()) {

        wrapper.innerHTML = "";

        return;
    }

    wrapper.innerHTML = `
        <button
            class="sim-continue-btn"
            onclick="showThirds()"
        >
            CONTINUE →
        </button>
    `;
}

/* =========================
   THIRD PLACE SCREEN
========================= */

window.showThirds = function() {

    const root =
        document.getElementById(
            "simulator-root"
        );

    Simulator.thirds = [];

    Simulator.groups.forEach(g => {

        const third =
            Object.entries(
                Simulator.rankings
            ).find(([k,v]) =>
                k.startsWith(g.letter+"-")
                && v===3
            );

        if(third){

            Simulator.thirds.push({
                group:g.letter,
                team:
                third[0]
                .replace(g.letter+"-","")
            });
        }
    });

    root.innerHTML = `
        <h2>🥉 BEST THIRD PLACES</h2>

        <div class="third-grid">

        ${Simulator.thirds.map((t,i)=>`

            <div
                class="third-card"
                onclick="toggleThird(${i},this)"
            >
                ${t.team}
            </div>

        `).join("")}

        </div>

        <button
            class="sim-continue-btn"
            onclick="generateBracket()"
        >
            GENERATE ROUND OF 32
        </button>
    `;
};

window.toggleThird =
function(index, el){

    const pos =
        Simulator.selectedThirds
        .indexOf(index);

    if(pos>-1){

        Simulator.selectedThirds
        .splice(pos,1);

        el.classList.remove(
            "selected-third"
        );

    }else{

        if(
            Simulator.selectedThirds
            .length >= 8
        ) return;

        Simulator.selectedThirds
        .push(index);

        el.classList.add(
            "selected-third"
        );
    }
};

/* =========================
   BRACKET PLACEHOLDER
========================= */

window.generateBracket = function() {

    if(
        Simulator.selectedThirds.length !== 8
    ){
        alert(
            "Select exactly 8 best third-place teams"
        );
        return;
    }

    const qualified =
        buildQualifiedTeams();

    const matches =
        createOfficialRound32(
            qualified
        );

    renderRound32(matches);
};

/* =========================
   BUILD QUALIFIED TEAMS
========================= */

function buildQualifiedTeams() {

    const firsts = {};
    const seconds = {};
    const thirds = {};

    Simulator.groups.forEach(g => {

        const teams =
            Object.entries(
                Simulator.rankings
            )
            .filter(([k]) =>
                k.startsWith(
                    g.letter + "-"
                )
            );

        const first =
            teams.find(
                ([k,v]) => v === 1
            );

        const second =
            teams.find(
                ([k,v]) => v === 2
            );

        if(first){

            firsts[g.letter] =
                first[0].replace(
                    g.letter + "-",
                    ""
                );
        }

        if(second){

            seconds[g.letter] =
                second[0].replace(
                    g.letter + "-",
                    ""
                );
        }

    });

    Simulator.selectedThirds
    .forEach(index => {

        const third =
            Simulator.thirds[index];

        thirds[
            third.group
        ] = third.team;

    });

    return {
        firsts,
        seconds,
        thirds
    };
}

/* =========================
   OFFICIAL ROUND OF 32
========================= */

function createOfficialRound32(data) {

    const F = data.firsts;
    const S = data.seconds;
    const T = data.thirds;

    return [

        [F.A, T.B || T.C || T.D],
        [S.A, S.B],

        [F.C, T.E || T.F || T.G],
        [S.C, S.D],

        [F.E, T.H || T.I || T.J],
        [S.E, S.F],

        [F.G, T.K || T.L || T.A],
        [S.G, S.H],

        [F.I, T.B || T.E || T.H],
        [S.I, S.J],

        [F.K, T.C || T.F || T.I],
        [S.K, S.L],

        [F.B, T.D || T.G || T.J],
        [F.D, T.A || T.H || T.K],

        [F.F, T.L || T.C || T.E],
        [F.H, F.J]

    ];

}

/* =========================
   RENDER ROUND OF 32
========================= */

function renderRound32(matches) {

    const root =
        document.getElementById(
            "simulator-root"
        );

    root.innerHTML = `

        <div class="espn-bracket">

            <h2>
                ⚔️ ROUND OF 32
            </h2>

            <div class="round32-grid">

                ${matches.map(
                    (match,index) => `

                    <div class="bracket-match">

                        <div class="bracket-game">
                            Match ${index + 1}
                        </div>

                        <div class="bracket-team">
                            ${match[0] || "TBD"}
                        </div>

                        <div class="bracket-vs">
                            VS
                        </div>

                        <div class="bracket-team">
                            ${match[1] || "TBD"}
                        </div>

                    </div>

                `
                ).join("")}

            </div>

        </div>

    `;
}
