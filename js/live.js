async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        const teamMap = {
            "Islandia": "Iceland",
            "Argentina": "Argentine",
            "Corea del Sur": "South Korea",
            "Estados Unidos": "USA"
        };

        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const teamNames =
                card.querySelectorAll(".team-name");

            if (teamNames.length < 2) return;

            const homeTeam =
                teamNames[0].innerText.trim();

            const awayTeam =
                teamNames[1].innerText.trim();

            const homeApi =
                teamMap[homeTeam] || homeTeam;

            const awayApi =
                teamMap[awayTeam] || awayTeam;

            const scoreEl =
                card.querySelector(".score-number");

            const statusEl =
                card.querySelector(".match-status");

            const match = data.response.find(m =>

                m.teams.home.name === homeApi &&
                m.teams.away.name === awayApi

            );

            if (!match) return;

            const homeGoals =
                match.goals.home ?? 0;

            const awayGoals =
                match.goals.away ?? 0;

            const minute =
                match.fixture.status.elapsed || "";

            const status =
                match.fixture.status.short;

            if (scoreEl) {

                scoreEl.innerHTML = `
                    <span style="
                        color:#ff2d2d;
                        font-weight:900;
                    ">
                        ${homeGoals} - ${awayGoals}
                    </span>
                `;
            }

            if (statusEl) {

                if (
                    status === "1H" ||
                    status === "2H" ||
                    status === "HT" ||
                    status === "ET"
                ) {

                    statusEl.innerHTML =
                        `🔴 LIVE ${minute}'`;

                    statusEl.classList.add(
                        "live"
                    );

                } else {

                    statusEl.innerHTML =
                        match.fixture.status.long;
                }
            }

        });

    }

    catch(error) {

        console.error(
            "LIVE ERROR:",
            error
        );

    }

}

updateLive();

setInterval(
    updateLive,
    30000
);
