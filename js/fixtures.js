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

                let scoreDisplay = "";

                if (
                    match.status === "FINISHED" ||
                    match.status === "LIVE"
                ) {

                    scoreDisplay = `
                    <div class="fixture-score">
                        ${match.homeScore}
                        -
                        ${match.awayScore}
                    </div>
                    `;

                } else {

                    scoreDisplay = `
                    <div class="fixture-score">
                        VS
                    </div>
                    `;

                }

                fixtureRows += `

                <div class="fixture-row">

                    <div class="fixture-date">
                        ${match.date}
                    </div>

                    <div class="fixture-match">

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

                        ${scoreDisplay}

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

                    <div class="fixture-time">

                        ET ${match.timeET}
                        <br>
                        AR ${match.timeAR}

                    </div>

                    <div class="fixture-stadium">

                        ${match.stadium}
                        <br>
                        ${match.city}

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
