async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        // PARTIDO REAL QUE ESTÁ JUGANDO AHORA
        const match = data.response.find(m =>

            m.teams.home.name === "Saudi Arabia" &&
            m.teams.away.name === "Senegal"

        );

        if (!match) return;

        const card =
            document.querySelector(".match-card");

        if (!card) return;

        const scoreEl =
            card.querySelector(".score-number");

        const statusEl =
            card.querySelector(".match-status");

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
