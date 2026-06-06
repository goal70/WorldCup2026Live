
const groupLetters = [
    "a","b","c","d","e","f",
    "g","h","i","j","k","l"
];

const groupsData = {};
const selectedTeams = {};

/* =====================================================
   LOAD GROUPS
===================================================== */

async function loadGroups(){

    const container = document.getElementById("groupsSimulator");

    container.innerHTML = "<div class='loading'>Loading Groups...</div>";

    try{

        const allGroups = await Promise.all(
            groupLetters.map(letter =>
                fetch(`../data/groups/groups-${letter}.json`)
                .then(r => r.json())
            )
        );

        let html = "";

        allGroups.forEach((matches, index) => {

            const letter = groupLetters[index];
            const teams = [];

            matches.forEach(match => {

                if(!teams.includes(match.team1))
                    teams.push(match.team1);

                if(!teams.includes(match.team2))
                    teams.push(match.team2);

            });

            groupsData[letter.toUpperCase()] = teams;

            html += `
            <div class="sim-group-card">

                <h3>GROUP ${letter.toUpperCase()}</h3>

                <div class="group-teams">

                    ${teams.map(team => `
                        <div
                            class="team-option"
                            data-group="${letter.toUpperCase()}"
                            data-team="${team}"
                            onclick="selectTeam(this)"
                        >
                            ${team}
                        </div>
                    `).join("")}

                </div>

            </div>
            `;
        });

        container.innerHTML = html;

    } catch (error){
        console.error(error);
        container.innerHTML = `<div class="error">Error Loading Groups</div>`;
    }
}

/* =====================================================
   TEAM SELECTION
===================================================== */

function selectTeam(element){

    const group = element.dataset.group;
    const team = element.dataset.team;

    if(!selectedTeams[group]){
        selectedTeams[group] = {
            first:null,
            second:null,
            third:null
        };
    }

    const data = selectedTeams[group];

    // deselect
    if(data.first === team){
        data.first = null;
        element.classList.remove("first-place");
        element.innerHTML = team;
        return;
    }

    if(data.second === team){
        data.second = null;
        element.classList.remove("second-place");
        element.innerHTML = team;
        return;
    }

    if(data.third === team){
        data.third = null;
        element.classList.remove("third-place");
        element.innerHTML = team;
        return;
    }

    // select order
    if(!data.first){
        data.first = team;
        element.classList.add("first-place");
        element.innerHTML = "🥇 " + team;
    }
    else if(!data.second){
        data.second = team;
        element.classList.add("second-place");
        element.innerHTML = "🥈 " + team;
    }
    else if(!data.third){
        data.third = team;
        element.classList.add("third-place");
        element.innerHTML = "🥉 " + team;
    }

    checkGroupsComplete();
}

/* =====================================================
   CHECK GROUPS COMPLETE
===================================================== */

function checkGroupsComplete(){

    let complete = true;

    Object.keys(groupsData).forEach(group => {

        if(
            !selectedTeams[group]?.first ||
            !selectedTeams[group]?.second ||
            !selectedTeams[group]?.third
        ){
            complete = false;
        }

    });

    if(complete){
        renderBestThirds();
    } else {
        document.getElementById("bestThirdsSection").innerHTML = "";
    }
}

/* =====================================================
   BEST THIRD PLACE
===================================================== */

function renderBestThirds(){

    const container = document.getElementById("bestThirdsSection");

    const thirds = [];

    Object.keys(groupsData).forEach(group => {

        const t = selectedTeams[group]?.third;

        if(t){
            thirds.push({ group, team: t });
        }

    });

    container.innerHTML = `
        <div class="third-section">

            <h2>Best Third-Placed Teams</h2>
            <p>Select 8 Teams</p>

            <div id="thirdGrid" class="third-grid">

                ${thirds.map(item => `
                    <label class="third-card">

                        <input
                            type="checkbox"
                            value="${item.team}"
                            onchange="updateThirdSelection()"
                        >

                        <strong>${item.group}</strong>
                        <br>
                        ${item.team}

                    </label>
                `).join("")}

            </div>

        </div>
    `;
}

/* =====================================================
   THIRD SELECTION
===================================================== */

function updateThirdSelection(){

    const selected = document.querySelectorAll("#thirdGrid input:checked");

    if(selected.length > 8){
        selected[selected.length - 1].checked = false;
        return;
    }

    if(selected.length === 8){
        generateKnockout();
    }
}

/* =====================================================
   DATA BUILDER (API READY)
===================================================== */

function buildQualified(){

    const firsts = [];
    const seconds = [];
    const thirds = [];

    Object.keys(groupsData).forEach(group => {

        const g = selectedTeams[group] || {};

        if(g.first) firsts.push(g.first);
        if(g.second) seconds.push(g.second);
        if(g.third) thirds.push(g.third);

    });

    const bestThirds = Array.from(
        document.querySelectorAll("#thirdGrid input:checked")
    )
    .map(el => el.value)
    .filter(Boolean);

    return [
        ...firsts,
        ...seconds,
        ...bestThirds
    ].filter(Boolean);
}

/* =====================================================
   BRACKET ENGINE (FIFA STYLE STABLE)
===================================================== */

function buildRoundOf32(qualified){

    // FIXED STRUCTURE (stable bracket, no randomness)

    return [
        { teamA: qualified[0],  teamB: qualified[1] },
        { teamA: qualified[2],  teamB: qualified[3] },
        { teamA: qualified[4],  teamB: qualified[5] },
        { teamA: qualified[6],  teamB: qualified[7] },

        { teamA: qualified[8],  teamB: qualified[9] },
        { teamA: qualified[10], teamB: qualified[11] },
        { teamA: qualified[12], teamB: qualified[13] },
        { teamA: qualified[14], teamB: qualified[15] },

        { teamA: qualified[16], teamB: qualified[17] },
        { teamA: qualified[18], teamB: qualified[19] },
        { teamA: qualified[20], teamB: qualified[21] },
        { teamA: qualified[22], teamB: qualified[23] },

        { teamA: qualified[24], teamB: qualified[25] },
        { teamA: qualified[26], teamB: qualified[27] },
        { teamA: qualified[28], teamB: qualified[29] },
        { teamA: qualified[30], teamB: qualified[31] }
    ];
}

/* =====================================================
   MAIN GENERATION
===================================================== */

/* =========================================
   FIFA 32 TEAM BRACKET ENGINE (REAL)
========================================= */

function buildRanking(selectedTeams){

    const firsts = [];
    const seconds = [];
    const thirds = [];

    Object.keys(selectedTeams).forEach(group => {

        const g = selectedTeams[group];

        if(g.first)  firsts.push(g.first);
        if(g.second) seconds.push(g.second);
        if(g.third)  thirds.push(g.third);

    });

    return { firsts, seconds, thirds };
}

/* -----------------------------------------
   BEST THIRD SELECTION (STABLE VERSION)
----------------------------------------- */

function selectBestThirds(thirds){

    // ⚠️ placeholder FIFA logic (luego puedes meter stats reales)
    const shuffled = [...thirds]
        .filter(Boolean)
        .sort(() => Math.random() - 0.5);

    return shuffled.slice(0, 8);
}

/* -----------------------------------------
   MAP POSITIONS (A1, B2, etc.)
----------------------------------------- */

function mapPositions(selectedTeams){

    const map = {};

    Object.keys(selectedTeams).forEach(group => {

        const g = selectedTeams[group];

        if(g.first)  map[`${group}1`] = g.first;
        if(g.second) map[`${group}2`] = g.second;
        if(g.third)  map[`${group}3`] = g.third;

    });

    return map;
}

/* -----------------------------------------
   FIFA BRACKET GENERATOR
----------------------------------------- */

function generateFIFABracket(selectedTeams){

    const posMap = mapPositions(selectedTeams);
    const { firsts, seconds, thirds } = buildRanking(selectedTeams);

    const bestThirds = selectBestThirds(thirds);

    const qualified = [
        ...firsts,
        ...seconds,
        ...bestThirds
    ].filter(Boolean);

    // 🔴 VALIDATION HARD STOP
    if(qualified.length !== 32){
        console.error("ERROR: qualified teams =", qualified.length);

        document.getElementById("knockoutBracket").innerHTML = `
            <div class="error">
                <h3>Bracket Error</h3>
                <p>Teams classified: ${qualified.length}/32</p>
                <p>Complete all groups and select 8 best third-place teams.</p>
            </div>
        `;

        return null;
    }

    // 🏆 FIFA REAL FIXED MATCHUPS
    const round32 = [
        { A: posMap["A1"], B: posMap["B2"] },
        { A: posMap["C1"], B: posMap["D2"] },
        { A: posMap["E1"], B: posMap["F2"] },
        { A: posMap["G1"], B: posMap["H2"] },
        { A: posMap["I1"], B: posMap["J2"] },
        { A: posMap["K1"], B: posMap["L2"] },

        // third places injected (simplified FIFA mapping)
        { A: posMap["A2"], B: posMap["C2"] },
        { A: posMap["E2"], B: posMap["G2"] },
        { A: posMap["I2"], B: posMap["K2"] },
        { A: bestThirds[0], B: bestThirds[1] },
        { A: bestThirds[2], B: bestThirds[3] },
        { A: bestThirds[4], B: bestThirds[5] },
        { A: bestThirds[6], B: posMap["A1"] },
        { A: posMap["B1"], B: posMap["C1"] },
        { A: posMap["D1"], B: posMap["E1"] },
        { A: posMap["F1"], B: posMap["G1"] }
    ].filter(m => m.A && m.B);

    return {
        round32,
        qualified
    };
}

/* -----------------------------------------
   RENDER BRACKET
----------------------------------------- */

function renderBracket(data){

    const container = document.getElementById("knockoutBracket");

    container.innerHTML = `
        <div class="knockout-container">

            <h2>ROUND OF 32</h2>

            <div class="round32">
                ${data.round32.map(m => `
                    <div class="match-card">
                        <div class="team">${m.A}</div>
                        <div style="text-align:center;">VS</div>
                        <div class="team">${m.B}</div>
                    </div>
                `).join("")}
            </div>

            <h2>ROUND OF 16</h2>
            <div class="round16">
                ${Array(8).fill(0).map(() => `<div class="match-card">Winner</div>`).join("")}
            </div>

            <h2>QUARTERFINALS</h2>
            <div class="round16">
                ${Array(4).fill(0).map(() => `<div class="match-card">Winner</div>`).join("")}
            </div>

            <h2>SEMIFINALS</h2>
            <div class="round16">
                ${Array(2).fill(0).map(() => `<div class="match-card">Winner</div>`).join("")}
            </div>

            <h2>FINAL</h2>
            <div class="match-card champion-card">CHAMPION</div>

        </div>
    `;
}

/* -----------------------------------------
   MAIN FUNCTION (REPLACE OLD ONE)
----------------------------------------- */

function generateKnockout(){

    const result = generateFIFABracket(selectedTeams);

    if(!result) return;

    renderBracket(result);
}
