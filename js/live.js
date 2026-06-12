async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        const liveMatches = data.response.filter(m =>
            ["1H","2H","HT","ET"].includes(m.fixture.status.short)
        );

        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const home = card.querySelectorAll(".team-name")[0]?.innerText.trim();
            const away = card.querySelectorAll(".team-name")[1]?.innerText.trim();

            if (!home || !away) return;

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
                scoreEl.innerHTML = `${homeGoals} - ${awayGoals}`;
            }

            if (statusEl) {
                statusEl.innerHTML = `🔴 LIVE ${minute}'`;
                statusEl.classList.add("live");
            }
        });

    } catch (e) {
        console.error("LIVE ERROR", e);
    }
}

updateLive();
setInterval(updateLive, 15000);
