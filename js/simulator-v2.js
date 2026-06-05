const groupLetters = [
    "a","b","c","d","e","f",
    "g","h","i","j","k","l"
];

const groupsData = {};
const selectedTeams = {};

async function loadGroups() {

    const container =
    document.getElementById("groupsSimulator");

    container.innerHTML = `
        <div class="loading">
            Loading groups...
        </div>
    `;

    try {

        let html = "";

        for (const letter of groupLetters) {

            const response =
            await fetch(
                `../data/groups/groups-${letter}.json`
            );

            const matches =
            await response.json();

            const teams = [];

            matches.forEach(match => {

                if (!teams.includes(match.team1))
                    teams.push(match.team1);

                if (!teams.includes(match.team2))
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

                <div class="sim-selects">

                    <label>
                        1st Place
                    </label>

                    <select
                    onchange="
                    savePosition(
                        '${letter.toUpperCase()}',
                        'first',
                        this.value
                    )">

                        <option value="">
                            Select Team
                        </option>

                        ${teams.map(team => `
                            <option value="${team}">
                                ${team}
                            </option>
                        `).join("")}

                    </select>

                    <label>
                        2nd Place
                    </label>

                    <select
                    onchange="
                    savePosition(
                        '${letter.toUpperCase()}',
                        'second',
                        this.value
                    )">

                        <option value="">
                            Select Team
                        </option>

                        ${teams.map(team => `
                            <option value="${team}">
                                ${team}
                            </option>
                        `).join("")}

                    </select>

                    <label>
                        3rd Place
                    </label>

                    <select
                    onchange="
                    savePosition(
                        '${letter.toUpperCase()}',
                        'third',
                        this.value
                    )">

                        <option value="">
                            Select Team
                        </option>

                        ${teams.map(team => `
                            <option value="${team}">
                                ${team}
                            </option>
                        `).join("")}

                    </select>

                </div>

            </div>

            `;

        }

        container.innerHTML = html;

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="error">
                Error loading groups
            </div>
        `;

    }

}

function savePosition(group, position, team) {

    if (!selectedTeams[group]) {
        selectedTeams[group] = {};
    }

    selectedTeams[group][position] = team;

    checkGroupsComplete();

}

function checkGroupsComplete() {

    let complete = true;

    for (const group of Object.keys(groupsData)) {

        if (
            !selectedTeams[group] ||
            !selectedTeams[group].first ||
            !selectedTeams[group].second ||
            !selectedTeams[group].third
        ) {
            complete = false;
            break;
        }

    }

    if (complete) {

        renderBestThirds();

    }

}

function renderBestThirds() {

    const container =
    document.getElementById(
        "bestThirdsSection"
    );

    const thirds = [];

    Object.keys(selectedTeams)
    .forEach(group => {

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
                Select the 8 best third-placed teams
            </p>

            <div class="third-grid">

                ${thirds.map(item => `

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

function updateThirdSelection() {

    const selected =
    document.querySelectorAll(
        ".third-grid input:checked"
    );

    if (selected.length > 8) {

        alert(
            "You can only select 8 teams."
        );

        selected[
            selected.length - 1
        ].checked = false;

        return;

    }

    if (selected.length === 8) {

        document
        .getElementById(
            "knockoutBracket"
        )
        .innerHTML = `

            <div class="ready-box">

                ✅ 8 Best Third-Placed Teams Selected

                <br><br>

                Next Step:

                Generate Round of 32

            </div>

        `;

    }

}

loadGroups();
