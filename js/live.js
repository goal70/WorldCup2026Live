async function updateLive() {

    try {

        const res = await fetch(
            "https://footbal-api.otanomix.workers.dev/fixtures?live=all"
        );

        const data = await res.json();

        if (!data.response) return;

        // 🔥 PARTIDO INICIAL: Mexico vs South Africa
        const match = data.response.find(m =>
            m.teams.home.name.toLowerCase() === "mexico" &&
            m.teams.away.name.toLowerCase() === "south africa"
        );

        if (!match) return;

        // 🔥 BUSCAR TODAS LAS TARJETAS
        const cards = document.querySelectorAll(".match-card");

        cards.forEach(card => {

            const teams = card.querySelectorAll(".team-name");

            if (!teams || teams.length < 2) return;

            const home = teams[0].innerText.trim().toLowerCase();
            const away = teams[1].innerText.trim().toLowerCase();

            // 🔥 SOLO ACTUALIZA EL PARTIDO CORRECTO
            if (
                home === "mexico" &&
                away === "south africa"
            ) {

                const scoreEl = card.querySelector(".score-number");
                const statusEl = card.querySelector(".match-status");

                const homeGoals = match.goals.home ?? 0;
                const awayGoals = match.goals.away ?? 0;

                const minute = match.fixture.status.elapsed || "";
                const status = match.fixture.status.short;

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

                    if (
                        status === "1H" ||
                        status === "2H" ||
                        status === "HT" ||
                        status === "ET"
                    ) {

                        statusEl.innerHTML = `🔴 LIVE ${minute}'`;
                        statusEl.classList.add("live");

                    } else {

                        statusEl.innerHTML = match.fixture.status.long;
                    }
                }
            }
        });

    }

    catch(error) {
        console.error("LIVE ERROR:", error);
    }

}

// 🔥 EJECUCIÓN
updateLive();

setInterval(updateLive, 30000);
