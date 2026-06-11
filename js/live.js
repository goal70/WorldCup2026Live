async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        // 🔥 TODOS LOS PARTIDOS QUE PUEDEN ESTAR EN VIVO
        const liveMatches = data.response.filter(m =>
            ["1H","2H","HT","ET","LIVE"].includes(m.fixture.status.short) ||
            m.fixture.status.elapsed
        );

        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const teams = card.querySelectorAll(".team-name");
            const scoreEl = card.querySelector(".score-number");
            const statusEl = card.querySelector(".match-status");

            if (teams.length < 2) return;

            const home = teams[0].innerText.trim().toLowerCase();
            const away = teams[1].innerText.trim().toLowerCase();

            const match = liveMatches.find(m => {

                const apiHome = m.teams.home.name.trim().toLowerCase();
                const apiAway = m.teams.away.name.trim().toLowerCase();

                return (
                    (apiHome === home && apiAway === away) ||
                    (apiHome === away && apiAway === home)
                );

            });

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
                statusEl.innerHTML = `🔴 LIVE ${minute ? minute + "'" : ""}`;
                statusEl.classList.add("live");
            }

        });

    } catch (error) {
        console.error("LIVE ERROR:", error);
    }
}

updateLive();
setInterval(updateLive, 15000);
