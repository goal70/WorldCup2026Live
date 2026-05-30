async function loadFixtures() {

    const container =
    document.getElementById("fixtures");

    const groups = [
        "a","b","c","d","e","f",
        "g","h","i","j","k","l"
    ];

    container.innerHTML = "";

    for(const group of groups){

        try{

            const response =
            await fetch(
                `../data/groups/groups-${group}.json`
            );

            const matches =
            await response.json();

            const groupLetter =
            matches[0].group;

            container.innerHTML += `
                <section class="group-section">

                    <h2 class="group-title">
                        GROUP ${groupLetter}
                    </h2>

                    <div
                    class="group-matches"
                    id="group-${groupLetter}">
                    </div>

                </section>
            `;

            const groupContainer =
            document.getElementById(
                `group-${groupLetter}`
            );

            matches.forEach(match => {

                groupContainer.innerHTML += `

                <article class="match-card">

                    <div class="match-top">

                        <div class="match-status upcoming">
                            ${match.status}
                        </div>

                    </div>

                    <div class="match-center">

                        <div class="team">

                            <span class="flag">
                                ${match.flag1}
                            </span>

                            <div class="team-name">
                                ${match.team1}
                            </div>

                        </div>

                        <div class="score">

                            <div class="score-number">
                                VS
                            </div>

                        </div>

                        <div class="team">

                            <span class="flag">
                                ${match.flag2}
                            </span>

                            <div class="team-name">
                                ${match.team2}
                            </div>

                        </div>

                    </div>

                    <div class="match-details">

                        <div>
                            📅 ${match.date}
                        </div>

                        <div>
                            🕒 ET: ${match.timeET}
                        </div>

                        <div>
                            🇦🇷 AR: ${match.timeAR}
                        </div>

                        <div>
                            🏟 ${match.stadium}
                        </div>

                        <div>
                            📍 ${match.city}
                        </div>

                    </div>

                </article>

                `;

            });

        }

        catch(error){

            console.error(
                `Error loading Group ${group}:`,
                error
            );

        }

    }

}

loadFixtures();
