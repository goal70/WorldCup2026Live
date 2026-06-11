async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        // 🔥 SOLO PARTIDOS EN VIVO
        const liveMatches = data.response.filter(m =>
            m.fixture.status.short === "1H" ||
            m.fixture.status.short === "2H" ||
            m.fixture.status.short === "HT" ||
            m.fixture.status.short === "ET"
        );

        if (!liveMatches.length) return;

        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const teams = card.querySelectorAll(".team-name");

            if (!teams || teams.length < 2) return;

            const home = teams[0].innerText.trim().toLowerCase();
            const away = teams[1].innerText.trim().toLowerCase();

            // 🔥 BUSCAR MATCH CORRESPONDIENTE EN API
            const match = liveMatches.find(m =>
                m.teams.home.name.toLowerCase() === home &&
                m.teams.away.name.toLowerCase() === away
            );

            if (!match) return;

            const scoreEl = card.querySelector(".score-number");
            const statusEl = card.querySelector(".match-status");

            const homeGoals = match.goals.home ?? 0;
            const awayGoals = match.goals.away ?? 0;
            const minute = match.fixture.status.elapsed || "";

            // 🔥 SCORE LIVE
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

            // 🔥 STATUS LIVE
            if (statusEl) {
                statusEl.innerHTML = `🔴 LIVE ${minute}'`;
                statusEl.classList.add("live");
            }

        });

    }

    catch(error) {
        console.error("LIVE ERROR:", error);
    }

}

// 🔥 LOOP GLOBAL
updateLive();
setInterval(updateLive, 30000);
