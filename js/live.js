async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        const liveMatches = data.response.filter(m =>
            ["1H", "2H", "HT", "ET"].includes(m.fixture.status.short)
        );

        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const teams = card.querySelectorAll(".team-name");
            if (!teams || teams.length < 2) return;

            const home = teams[0].innerText.trim();
            const away = teams[1].innerText.trim();

            // 🔥 BUSCAR MATCH POR NOMBRES UI vs API
            const match = liveMatches.find(m =>
                m.teams.home.name.trim().toLowerCase() === home.toLowerCase() &&
                m.teams.away.name.trim().toLowerCase() === away.toLowerCase()
            );

            if (!match) return;

            const scoreEl = card.querySelector(".score-number");
            const statusEl = card.querySelector(".match-status");

            const homeGoals = match.goals.home ?? 0;
            const awayGoals = match.goals.away ?? 0;
            const minute = match.fixture.status.elapsed || "";

            if (scoreEl) {
                scoreEl.innerHTML = `
                    <span style="color:#ff2d2d;font-weight:900;">
                        ${homeGoals} - ${awayGoals}
                    </span>
                `;
            }

            if (statusEl) {
                statusEl.innerHTML = `🔴 LIVE ${minute}'`;
                statusEl.classList.add("live");
            }

        });

    } catch (error) {
        console.error("LIVE ERROR:", error);
    }
}

updateLive();
setInterval(updateLive, 30000);
