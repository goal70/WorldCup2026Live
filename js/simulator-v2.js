const groupLetters = [
    "a","b","c","d","e","f",
    "g","h","i","j","k","l"
];

const groupsData = {};
const selectedTeams = {};

async function loadGroups(){

    const container =
    document.getElementById(
        "groupsSimulator"
    );

    container.innerHTML =
    "<div class='loading'>Loading Groups...</div>";

    try{

        const allGroups =
        await Promise.all(

            groupLetters.map(letter =>

                fetch(
                    `../data/groups/groups-${letter}.json`
                )
                .then(r=>r.json())

            )

        );

        let html = "";

        allGroups.forEach((matches,index)=>{

            const letter =
            groupLetters[index];

            const teams = [];

            matches.forEach(match=>{

                if(!teams.includes(match.team1))
                    teams.push(match.team1);

                if(!teams.includes(match.team2))
                    teams.push(match.team2);

            });

            groupsData[
                letter.toUpperCase()
            ] = teams;

            html += `

            <div class="sim-group-card">

                <h3>
                    GROUP ${letter.toUpperCase()}
                </h3>

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

    }
    catch(error){

        console.error(error);

        container.innerHTML =

        `<div class="error">
            Error Loading Groups
        </div>`;

    }

}

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

    // DESELECCIONAR

    if(data.first === team){

        data.first = null;

        element.classList.remove(
            "first-place"
        );

        element.innerHTML = team;

        return;
    }

    if(data.second === team){

        data.second = null;

        element.classList.remove(
            "second-place"
        );

        element.innerHTML = team;

        return;
    }

    if(data.third === team){

        data.third = null;

        element.classList.remove(
            "third-place"
        );

        element.innerHTML = team;

        return;
    }

    // SELECCIONAR

    if(!data.first){

        data.first = team;

        element.classList.add(
            "first-place"
        );

        element.innerHTML =
        "🥇 " + team;

    }

    else if(!data.second){

        data.second = team;

        element.classList.add(
            "second-place"
        );

        element.innerHTML =
        "🥈 " + team;

    }

    else if(!data.third){

        data.third = team;

        element.classList.add(
            "third-place"
        );

        element.innerHTML =
        "🥉 " + team;

    }

    checkGroupsComplete();


function checkGroupsComplete(){

    let complete = true;

    Object.keys(groupsData)
    .forEach(group=>{

        if(

            !selectedTeams[group] ||

            !selectedTeams[group].first ||

            !selectedTeams[group].second ||

            !selectedTeams[group].third

        ){

            complete = false;

        }

    });

    if(complete){

        renderBestThirds();

    }

}

function renderBestThirds(){

    const container =
    document.getElementById(
        "bestThirdsSection"
    );

    const thirds = [];

    Object.keys(selectedTeams)
    .forEach(group=>{

        thirds.push({

            group,

            team:
            selectedTeams[group].third

        });

    });

    container.innerHTML = `

        <div class="third-section">

            <h2>
                Best Third-Placed Teams
            </h2>

            <p>
                Select 8 Teams
            </p>

            <div
            id="thirdGrid"
            class="third-grid">

                ${thirds.map(item=>`

                    <label
                    class="third-card">

                        <input
                        type="checkbox"
                        value="${item.team}"
                        onchange="
                        updateThirdSelection()
                        ">

                        <strong>
                            ${item.group}
                        </strong>

                        <br>

                        ${item.team}

                    </label>

                `).join("")}

            </div>

        </div>

    `;

}

function updateThirdSelection(){

    const selected =
    document.querySelectorAll(
        "#thirdGrid input:checked"
    );

    if(selected.length > 8){

        selected[
            selected.length - 1
        ].checked = false;

        return;
    }

    if(selected.length === 8){

        generateKnockout();

    }

}

function generateKnockout(){

    const knockout =
    document.getElementById(
        "knockoutBracket"
    );

    knockout.innerHTML = `

    <div class="knockout-container">

        <h2>ROUND OF 32</h2>

        <div class="round32">

            ${Array(16).fill(0).map(() => `

                <div class="match-card">

                    <select>
                        <option>Team 1</option>
                    </select>

                    <select>
                        <option>Team 2</option>
                    </select>

                </div>

            `).join("")}

        </div>

        <h2>ROUND OF 16</h2>

        <div class="round16">

            ${Array(8).fill(0).map(() => `

                <div class="match-card">
                    Winner
                </div>

            `).join("")}

        </div>

        <h2>QUARTERFINALS</h2>

        <div class="round16">

            ${Array(4).fill(0).map(() => `

                <div class="match-card">
                    Winner
                </div>

            `).join("")}

        </div>

        <h2>SEMIFINALS</h2>

        <div class="round16">

            ${Array(2).fill(0).map(() => `

                <div class="match-card">
                    Winner
                </div>

            `).join("")}

        </div>

        <h2>THIRD PLACE</h2>

        <div class="match-card">
            Third Place Match
        </div>

        <h2>FINAL</h2>

        <div class="match-card">
            Champion
        </div>

    </div>

    `;

}

loadGroups();
