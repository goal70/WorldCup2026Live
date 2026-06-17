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

    const current =
        Simulator.rankings[key] || 0;

    const next =
        current >= 3 ? 0 : current + 1;

    // Si el equipo pierde posición
    if(next === 0){

        delete Simulator.rankings[key];

    } else {

        // Ningún otro equipo del grupo puede tener
        // esa misma posición

        Object.keys(Simulator.rankings)
        .forEach(k => {

            if(
                k !== key &&
                k.startsWith(group + "-") &&
                Simulator.rankings[k] === next
            ){
                delete Simulator.rankings[k];
            }

        });

        Simulator.rankings[key] = next;
    }

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

window.generateBracket =
function(){

    const root =
        document.getElementById(
            "simulator-root"
        );

    root.innerHTML = `
        <div class="espn-bracket">

            <h2>
                ⚔️ ROUND OF 32
            </h2>

            <p>
                FIFA bracket generation
                will appear here.
            </p>

        </div>
    `;
};
