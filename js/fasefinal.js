async function loadFaseFinal() {
    try {

        const res = await fetch("data/fasefinal.json");

        if (!res.ok) {
            throw new Error("No se pudo cargar fasefinal.json");
        }

        const matches = await res.json();

        const container = document.getElementById("fasefinalBracket");

        if (!container) return;

        // 🔥 16avos
        const round16 = matches.filter(m => m.stage === "round16" || !m.stage);

        container.innerHTML = `
        <div class="round dieciseisavos">
            <div class="round-title">16AVOS</div>

            ${round16.map(m => `
                <div class="fasefinal-match">

                    <div class="match-meta">
                        ${m.date} • ${m.time}
                    </div>

                    <div class="team-row">
                        <span class="seed">${m.seed1 || ""}</span>
                        <img src="https://flagcdn.com/w40/${m.flag1}.png">
                        <span>${m.team1}</span>
                    </div>

                    <div class="team-row">
                        <span class="seed">${m.seed2 || ""}</span>
                        <img src="https://flagcdn.com/w40/${m.flag2}.png">
                        <span>${m.team2}</span>
                    </div>

                </div>
            `).join("")}
        </div>

        <div class="round octavos">
            <div class="round-title">OCTAVOS</div>

            ${Array.from({ length: 8 }).map((_, i) => `
                <div class="fasefinal-match placeholder">
                    Ganador M${i * 2 + 1}<br>
                    vs<br>
                    Ganador M${i * 2 + 2}
                </div>
            `).join("")}
        </div>

        <div class="round cuartos">
            <div class="round-title">CUARTOS</div>

            ${Array.from({ length: 4 }).map(() => `
                <div class="fasefinal-match placeholder">
                    Clasificado
                </div>
            `).join("")}
        </div>

        <div class="round semis">
            <div class="round-title">SEMIFINAL</div>

            ${Array.from({ length: 2 }).map(() => `
                <div class="fasefinal-match placeholder">
                    Clasificado
                </div>
            `).join("")}
        </div>

        <div class="round final">
            <div class="round-title">FINAL</div>

            <div class="fasefinal-match placeholder">
                GRAN FINAL
            </div>

            <div class="fasefinal-match placeholder">
                TERCER PUESTO
            </div>
        </div>
        `;

    } catch (error) {
        console.error("Error loading fasefinal:", error);
    }
}

loadFaseFinal();
