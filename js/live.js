async function updateLiveMatches() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        data.response.forEach(match => {

            const home = match.teams.home.name;
            const away = match.teams.away.name;

            const homeGoals = match.goals.home;
            const awayGoals = match.goals.away;

            const minute = match.fixture.status.elapsed;

            // Buscar TODAS las cards del DOM
            const cards = document.querySelectorAll(".match-card");

            cards.forEach(card => {

                const homeName =
                    card.querySelector(".team-name")?.innerText;

                const scoreEl =
                    card.querySelector(".score-number");

                const statusEl =
                    card.querySelector(".match-status");

                // Match con la tarjeta del HOME
                if (
                    homeName === home ||
                    homeName === away
                ) {

                    if (scoreEl) {

                        scoreEl.innerHTML = `
                            <span style="color:red;font-weight:900;">
                                ${homeGoals} - ${awayGoals}
                            </span>
                        `;
                    }

                    if (statusEl) {

                        statusEl.innerHTML = `
                            🔴 LIVE ${minute || ""}
                        `;
                        statusEl.classList.add("live");
                    }
                }
            });

        });

    } catch (err) {
        console.error("LIVE ERROR", err);
    }
}

// primera carga
updateLiveMatches();

// update cada 30 segundos
setInterval(updateLiveMatches, 30000);
