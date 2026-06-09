async function testLiveMatch() {

    try {

        const response = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await response.json();

        const match = data.response.find(m =>

            m.teams.home.name === "Saudi Arabia" &&
            m.teams.away.name === "Senegal"

        );

        if (!match) {

            console.log("Match not found");
            return;
        }

        const minute =
            match.fixture.status.elapsed;

        const homeGoals =
            match.goals.home;

        const awayGoals =
            match.goals.away;

        console.log(
            "LIVE",
            minute,
            homeGoals,
            awayGoals
        );

        const score =
            document.querySelector(
                ".score-number"
            );

        if (score) {

            score.innerHTML =
                `<span style="color:red;">
                    ${homeGoals} - ${awayGoals}
                </span>`;
        }

    }

    catch(error) {

        console.error(error);

    }

}

testLiveMatch();

setInterval(
    testLiveMatch,
    60000
);
