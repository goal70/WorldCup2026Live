async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const homeTeam =
                card.querySelectorAll(".team-name")[0]?.innerText.trim();

            const awayTeam =
                card.querySelectorAll(".team-name")[1]?.innerText.trim();

            const scoreEl =
                card.querySelector(".score-number");

            const statusEl =
                card.querySelector(".match-status");

            const match = data.response.find(m =>
                m.teams.home.name.trim() === homeTeam &&
                m.teams.away.name.trim() === awayTeam
            );

            if (!match) return;

            const homeGoals = match.goals.home;
            const awayGoals = match.goals.away;
            const minute = match.fixture.status.elapsed;

            // SCORE
            if (scoreEl) {
                scoreEl.innerHTML = `
                    <span style="color:#ff2d2d;font-weight:900;">
                        ${homeGoals} - ${awayGoals}
                    </span>
                `;
            }

            // STATUS
            if (statusEl) {

                const isLive =
                    match.fixture.status.short === "1H" ||
                    match.fixture.status.short === "2H";

                statusEl.innerHTML = isLive
                    ? `🔴 LIVE ${minute || ""}'`
                    : match.fixture.status.long;

                statusEl.classList.toggle("live", isLive);
                statusEl.classList.toggle("upcoming", !isLive);
            }

        });

    } catch (err) {
        console.error("LIVE ERROR:", err);
    }
}

updateLive();
setInterval(updateLive, 30000);
