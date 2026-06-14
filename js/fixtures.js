async function loadFixtures() {

    const container =
        document.getElementById("fixtures");

    const groups = [
        "a", "b", "c", "d", "e", "f",
        "g", "h", "i", "j", "k", "l"
    ];

    container.innerHTML = "";

    for (const group of groups) {

        try {

            const response =
                await fetch(
                    `../data/groups/groups-${group}.json`
                );

            const matches =
                await response.json();

            if (!matches.length) continue;

            const groupLetter =
                matches[0].group;

            const teams = [];

            matches.forEach(match => {

                if (!teams.includes(match.team1))
                    teams.push(match.team1);

                if (!teams.includes(match.team2))
                    teams.push(match.team2);

            });

            let standingsRows = "";

            teams.forEach(team => {

                standingsRows += `
                <tr>
                    <td>${team}</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                    <td>0</td>
                </tr>
                `;

            });

            let fixtureRows = "";

            matches.forEach(match => {

                let scoreDisplay = "VS";

                if (
                    match.status === "FINISHED" ||
                    match.status === "LIVE"
                ) {

                    scoreDisplay =
                        `${match.homeScore} - ${match.awayScore}`;

                }

                fixtureRows += `

                <div class="match-card">

                    <div class="match-status ${match.status.toLowerCase()}">
                        ${match.status}
                    </div>

                    <div class="match-group">
                        GROUP ${match.group}
                    </div>

                    <div class="match-header">

                        <div class="team">

                            <img
                                class="flag"
                                src="https://flagcdn.com/w40/${match.flag1}.png"
                                alt="${match.team1}"
                            >

                            <span>
                                ${match.team1}
                            </span>

                        </div>

                        <div class="score">
                            ${scoreDisplay}
                        </div>

                        <div class="team">

                            <img
                                class="flag"
                                src="https://flagcdn.com/w40/${match.flag2}.png"
                                alt="${match.team2}"
                            >

                            <span>
                                ${match.team2}
                            </span>

                        </div>

                    </div>

                    <div class="match-footer">

                        📅 ${match.date}
                        <br>

                        🏟 ${match.stadium}
                        <br>

                        📍 ${match.city}
                        <br>

                        🕒 ET ${match.timeET}
                        |
                        AR ${match.timeAR}

                    </div>

                </div>

                `;

            });

            container.innerHTML += `

            <section class="group-section">

                <div class="group-title">
                    GROUP ${groupLetter}
                </div>

                <table class="group-table">

                    <thead>

                        <tr>

                            <th>Team</th>
                            <th>Pts</th>
                            <th>PJ</th>
                            <th>G</th>
                            <th>E</th>
                            <th>P</th>

                        </tr>

                    </thead>

                    <tbody>

                        ${standingsRows}

                    </tbody>

                </table>

                <div class="fixture-list">

                    ${fixtureRows}

                </div>

            </section>

            `;

        }

        catch (error) {

            console.error(
                `Error Group ${group}`,
                error
            );

        }

    }

}

loadFixtures();
