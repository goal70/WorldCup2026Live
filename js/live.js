function updateLiveFromLocalData() {

    const cards = document.querySelectorAll(".match-card");

    cards.forEach(card => {

        const statusEl = card.querySelector(".match-status");
        const scoreEl = card.querySelector(".score-number");
        const teams = card.querySelectorAll(".team-name");

        if (!statusEl || !scoreEl || teams.length < 2) return;

        const status = statusEl.innerText.trim();

        // 🔥 SOLO PARTIDOS LIVE
        if (status !== "LIVE") return;

        const home = teams[0].innerText.trim();
        const away = teams[1].innerText.trim();

        // 🔥 BUSCAR EN TU JSON GLOBAL (window.allMatches)
        const match = allMatches.find(m =>
            m.team1 === home &&
            m.team2 === away
        );

        if (!match) return;

        // 🔥 SI MÁS ADELANTE TIENES SCORE REAL, AQUÍ SE ACTUALIZA
        if (match.score && match.score !== "-") {

            scoreEl.innerHTML = `
                <span style="
                    color:#ff2d2d;
                    font-weight:900;
                ">
                    ${match.score}
                </span>
            `;
        }

        statusEl.innerHTML = `🔴 LIVE`;

    });

}

// 🔥 EJECUCIÓN
updateLiveFromLocalData();
setInterval(updateLiveFromLocalData, 30000);
