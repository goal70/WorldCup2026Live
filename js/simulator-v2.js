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

}

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

    } else {

        document.getElementById(
            "bestThirdsSection"
        ).innerHTML = "";

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
    document.getElementById("knockoutBracket");

    // 1. OBTENER 1ros, 2dos y 3ros
    const firsts = [];
    const seconds = [];
    const thirds = [];

    Object.keys(groupsData).forEach(group => {

        const g = selectedTeams[group] || {};

        if (g.first) firsts.push(g.first);
        if (g.second) seconds.push(g.second);
        if (g.third) thirds.push(g.third);

    });

    // 2. OBTENER 8 MEJORES TERCEROS
    const bestThirds = Array.from(
        document.querySelectorAll("#thirdGrid input:checked")
    )
    .map(el => el.value)
    .filter(Boolean);

    // 3. TODOS LOS CLASIFICADOS
    const qualified = [
        ...firsts,
        ...seconds,
        ...bestThirds
    ].filter(Boolean);

    // 4. VALIDACIÓN (CLAVE)
    if (qualified.length !== 32) {

        knockout.innerHTML = `
            <div class="error">
                <h3>Error generating Knockout</h3>
                <p>Teams classified: ${qualified.length}/32</p>
            </div>
        `;

        return;
    }

    // 5. ROUND OF 32 (seguro)
    const round32 = [];

    const size = qualified.length;

    for (let i = 0; i < size / 2; i++) {

        const teamA = qualified[i];
        const teamB = qualified[size - 1 - i];

        round32.push({ teamA, teamB });
    }

    // 6. RENDER
    knockout.innerHTML = `

    <div class="knockout-container">

        <h2>ROUND OF 32</h2>

        <div class="round32">

            ${round32.map(match => `

                <div class="match-card">

                    <div class="team">${match.teamA}</div>
                    <div class="vs">VS</div>
                    <div class="team">${match.teamB}</div>

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

        <h2>THIRD PLACE</h2>
        <div class="match-card">Third Place Match</div>

        <h2>FINAL</h2>
        <div class="match-card">Champion</div>

    </div>

    `;
}
