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

        document.querySelectorAll(".match-card").forEach(card => {

            if (card.classList.contains("special-event")) return;

            const id = card.getAttribute("data-id");
            if (!id) return;

            const localMatch = allMatches.find(m => m.id == id);
            if (!localMatch) return;

            const apiMatch = liveMatches.find(m =>
                m.teams.home.name.toLowerCase() === localMatch.homeTeam.toLowerCase() &&
                m.teams.away.name.toLowerCase() === localMatch.awayTeam.toLowerCase()
            );

            if (!apiMatch) return;

            const scoreEl = card.querySelector(".score-number");
            const statusEl = card.querySelector(".match-status");

            const home = apiMatch.goals.home ?? 0;
            const away = apiMatch.goals.away ?? 0;
            const minute = apiMatch.fixture.status.elapsed || "";

            if (scoreEl) {
                scoreEl.innerHTML = `<span style="color:#ff2d2d;font-weight:900;">
                    ${home} - ${away}
                </span>`;
            }

            if (statusEl) {
                statusEl.innerHTML = `🔴 LIVE ${minute}'`;
                statusEl.classList.add("live");
            }

        });

    } catch (err) {
        console.error("LIVE ERROR:", err);
    }
}

updateLive();
setInterval(updateLive, 15000);
