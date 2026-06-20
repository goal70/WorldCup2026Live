async function loadFixtures() {

    const container = document.getElementById("fixtures");

    const groups = [
        "a", "b", "c", "d", "e", "f",
        "g", "h", "i", "j", "k", "l"
    ];

    container.innerHTML = "";

    for (const group of groups) {

        try {

            const response = await fetch(
                `../data/groups/groups-${group}.json`
            );

            if (!response.ok) {
                console.warn(`Group ${group} not found`);
                continue;
            }

            const matches = await response.json();

            if (!Array.isArray(matches) || !matches.length)
                continue;

            const groupLetter = matches[0].group;

            const standings = {};

            matches.forEach(match => {

                if (!standings[match.team1]) {
                    standings[match.team1] = {
                        team: match.team1,
                        pts: 0,
                        pj: 0,
                        pg: 0,
                        pe: 0,
                        pp: 0,
                        gf: 0,
                        gc: 0,
                        dg: 0
                    };
                }

                if (!standings[match.team2]) {
                    standings[match.team2] = {
                        team: match.team2,
                        pts: 0,
                        pj: 0,
                        pg: 0,
                        pe: 0,
                        pp: 0,
                        gf: 0,
                        gc: 0,
                        dg: 0
                    };
                }

                if (
                    match.status !== "FINISHED" &&
                    match.status !== "LIVE"
                ) {
                    return;
                }

                const home = standings[match.team1];
                const away = standings[match.team2];

                const hs = match.homeScore ?? 0;
                const as = match.awayScore ?? 0;

                home.pj++;
                away.pj++;

                home.gf += hs;
                home.gc += as;

                away.gf += as;
                away.gc += hs;

                if (hs > as) {

                    home.pg++;
                    home.pts += 3;

                    away.pp++;

                }
                else if (as > hs) {

                    away.pg++;
                    away.pts += 3;

                    home.pp++;

                }
                else {

                    home.pe++;
                    away.pe++;

                    home.pts++;
                    away.pts++;

                }

                home.dg = home.gf - home.gc;
                away.dg = away.gf - away.gc;

            });

            const standingsRows = Object.values(standings)
                .sort((a, b) =>
                    b.pts - a.pts ||
                    b.dg - a.dg ||
                    b.gf - a.gf
                )
                .map(team => `
                    <tr>
                        <td>${team.team}</td>
                        <td><b>${team.pts}</b></td>
                        <td>${team.pj}</td>
                        <td>${team.pg}</td>
                        <td>${team.pe}</td>
                        <td>${team.pp}</td>
                    </tr>
                `)
                .join("");

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

                            <span>${match.team1}</span>

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

                            <span>${match.team2}</span>

                        </div>

                    </div>

                    <div class="match-footer">

    📅 ${match.date || "TBA"}
    <br>

    🏟 ${match.stadium || "TBA"}
    <br>

    📍 ${match.city || "TBA"}
    <br>

    🕒 ${match.timeAR || "-"}

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
                            <th>PTS</th>
                            <th>PJ</th>
                            <th>PG</th>
                            <th>PE</th>
                            <th>PP</th>
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

function setShareFixture() {

    const url = window.location.href;
    const text = "📅 World Cup 2026 Fixtures";

    const encodedUrl = encodeURIComponent(url);
    const encodedText = encodeURIComponent(text);

    document.getElementById("share-wa").href =
        `https://wa.me/?text=${encodedText}%20${encodedUrl}`;

    document.getElementById("share-tw").href =
        `https://twitter.com/intent/tweet?text=${encodedText}%20${encodedUrl}`;

    document.getElementById("share-fb").href =
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

    document.getElementById("share-re").href =
        `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedText}`;

    document.getElementById("share-th").href =
        `https://www.threads.net/intent/post?text=${encodedText}%20${encodedUrl}`;
}

document.addEventListener("DOMContentLoaded", setShareFixture);
