async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        // 🔥 partidos en vivo reales
        const liveMatches = data.response.filter(m => {
            const s = m.fixture.status.short;
            return ["1H", "2H", "HT", "ET"].includes(s);
        });

        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const teams = card.querySelectorAll(".team-name");
            if (teams.length < 2) return;

            const home = teams[0].innerText.trim().toLowerCase();
            const away = teams[1].innerText.trim().toLowerCase();

            // 🔥 MATCH INTELIGENTE (NO EXACT MATCH)
            const match = liveMatches.find(m => {

                const apiHome = m.teams.home.name.toLowerCase();
                const apiAway = m.teams.away.name.toLowerCase();

                return (
                    (apiHome.includes(home) && apiAway.includes(away)) ||
                    (apiHome.includes(away) && apiAway.includes(home))
                );
            });

            const scoreEl = card.querySelector(".score-number");
            const statusEl = card.querySelector(".match-status");

            if (!match) return;

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

    }

    catch (error) {
        console.error("LIVE ERROR:", error);
    }
}

updateLive();
setInterval(updateLive, 15000);
