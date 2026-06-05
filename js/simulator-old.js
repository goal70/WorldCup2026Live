const groupLetters = [
    "a","b","c","d","e","f",
    "g","h","i","j","k","l"
];

const groupsData = {};
const selectedTeams = {};

async function loadGroups(){

    const container =
    document.getElementById("groupsSimulator");

    container.innerHTML = "";

    for(const letter of groupLetters){

        const response =
        await fetch(`../data/groups/groups-${letter}.json`);

        const matches =
        await response.json();

        const teams = [];

        matches.forEach(match=>{

            if(!teams.includes(match.team1))
                teams.push(match.team1);

            if(!teams.includes(match.team2))
                teams.push(match.team2);

        });

        groupsData[letter.toUpperCase()] = teams;

        container.innerHTML += `

        <div class="sim-group-card">

            <h3>GROUP ${letter.toUpperCase()}</h3>

            <div class="sim-selects">

                <label>1st Place</label>

                <select
                onchange="
                savePosition(
                '${letter}',
                'first',
                this.value
                )">

                    <option value="">
                    Select Team
                    </option>

                    ${teams.map(team=>
                    `<option>${team}</option>`
                    ).join("")}

                </select>

                <label>2nd Place</label>

                <select
                onchange="
                savePosition(
                '${letter}',
                'second',
                this.value
                )">

                    <option value="">
                    Select Team
                    </option>

                    ${teams.map(team=>
                    `<option>${team}</option>`
                    ).join("")}

                </select>

                <label>3rd Place</label>

                <select
                onchange="
                savePosition(
                '${letter}',
                'third',
                this.value
                )">

                    <option value="">
                    Select Team
                    </option>

                    ${teams.map(team=>
                    `<option>${team}</option>`
                    ).join("")}

                </select>

            </div>

        </div>

        `;

    }

}

function savePosition(group,position,team){

    if(!selectedTeams[group])
        selectedTeams[group]={};

    selectedTeams[group][position]=team;

    checkThirdPlaces();

}

function checkThirdPlaces(){

    let complete = true;

    const thirds = [];

    groupLetters.forEach(letter=>{

        const group =
        selectedTeams[letter];

        if(
            !group ||
            !group.first ||
            !group.second ||
            !group.third
        ){
            complete=false;
            return;
        }

        thirds.push(group.third);

    });

    if(!complete) return;

    renderThirdSelection(thirds);

}

function renderThirdSelection(thirds){

    const bracket =
    document.getElementById(
    "knockoutBracket"
    );

    bracket.innerHTML = `

    <div class="third-section">

        <h2>
        Best Third-Placed Teams
        </h2>

        <div id="thirdGrid"
        class="third-grid">

        ${thirds.map(team=>`

            <label
            class="third-card">

                <input
                type="checkbox"
                value="${team}"
                onchange="
                updateBestThirds()
                ">

                ${team}

            </label>

        `).join("")}

        </div>

    </div>

    `;

}

function updateBestThirds(){

    const checked =
    document.querySelectorAll(
    '#thirdGrid input:checked'
    );

    if(checked.length!==8)
        return;

    createBracket();

}

function createBracket(){

    const bracket =
    document.getElementById(
    "knockoutBracket"
    );

    bracket.innerHTML += `

    <div class="bracket-wrapper">

        <div class="round">

            <h3>ROUND OF 32</h3>

            ${Array(16).fill(0).map(() => `

            <div class="bracket-match">

                <div class="flag-slot">
                Winner
                </div>

            </div>

            `).join("")}

        </div>

        <div class="round">

            <h3>ROUND OF 16</h3>

            ${Array(8).fill(0).map(() => `

            <div class="bracket-match">

                <div class="flag-slot">
                Winner
                </div>

            </div>

            `).join("")}

        </div>

        <div class="round">

            <h3>QUARTERFINALS</h3>

            ${Array(4).fill(0).map(() => `

            <div class="bracket-match">

                <div class="flag-slot">
                Winner
                </div>

            </div>

            `).join("")}

        </div>

        <div class="round">

            <h3>SEMIFINALS</h3>

            ${Array(2).fill(0).map(() => `

            <div class="bracket-match">

                <div class="flag-slot">
                Winner
                </div>

            </div>

            `).join("")}

        </div>

        <div class="round">

            <h3>THIRD PLACE</h3>

            <div class="bracket-match">

                <div class="flag-slot">
                Third Place
                </div>

            </div>

        </div>

        <div class="round">

            <h3>FINAL</h3>

            <div class="bracket-match">

                <div class="flag-slot">
                Champion
                </div>

            </div>

        </div>

    </div>

    `;

}

loadGroups();
