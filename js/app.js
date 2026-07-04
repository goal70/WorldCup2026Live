async function loadFaseFinal() {
    try {

        const res = await fetch("data/fasefinal-matches.json");

        if (!res.ok) {
            throw new Error("No se pudo cargar fasefinal.json");
        }

        const matches = await res.json();

        // =========================
        // FILTROS POR RONDA
        // =========================

        const round16Left = matches.filter(
            m => m.stage === "round16" && m.side === "left"
        );

        const round16Right = matches.filter(
            m => m.stage === "round16" && m.side === "right"
        );

        const quarterLeft = matches.filter(
            m => m.stage === "quarterfinal" && m.side === "left"
        );

        const quarterRight = matches.filter(
            m => m.stage === "quarterfinal" && m.side === "right"
        );

        const semiLeft = matches.filter(
            m => m.stage === "semifinal" && m.side === "left"
        );

        const semiRight = matches.filter(
            m => m.stage === "semifinal" && m.side === "right"
        );

        const finalMatch = matches.filter(
            m => m.stage === "final"
        );

        const thirdMatch = matches.filter(
            m => m.stage === "thirdplace"
        );

        const container = document.getElementById("fasefinalBracket");

        if (!container) return;

        // =========================
        // RENDER MATCH
        // =========================

        const renderMatch = (m) => `
        <div class="fasefinal-match">

            <div class="match-meta">
                ${m.displayDate || m.date} • ${m.timeAR || m.time || ""}
            </div>

            <div class="team-row">
                <span class="seed">${m.seed1 || ""}</span>
                <img src="https://flagcdn.com/w40/${m.flag1}.png">
                <span>${m.team1}</span>

                ${
                    m.status !== "UPCOMING"
                        ? `<span class="match-score">${m.homeScore ?? ""}</span>`
                        : ""
                }
            </div>

            <div class="team-row">
                <span class="seed">${m.seed2 || ""}</span>
                <img src="https://flagcdn.com/w40/${m.flag2}.png">
                <span>${m.team2}</span>

                ${
                    m.status !== "UPCOMING"
                        ? `<span class="match-score">${m.awayScore ?? ""}</span>`
                        : ""
                }
            </div>

        </div>
        `;

        // =========================
        // RENDER GENERAL
        // =========================

        container.innerHTML = `

        <div class="bracket-side left">

            <div class="fasefinal-round round16">
                <div class="round-title">16AVOS</div>
                ${round16Left.map(renderMatch).join("")}
            </div>

            <div class="fasefinal-round round8">
                <div class="round-title">OCTAVOS</div>

                ${Array.from({length:4}).map((_,i)=>`
                    <div class="fasefinal-match placeholder">
                        Ganador M${i*2+1}<br>
                        vs<br>
                        Ganador M${i*2+2}
                    </div>
                `).join("")}
            </div>

            <div class="fasefinal-round round4">
                <div class="round-title">CUARTOS</div>

                ${Array.from({length:2}).map(()=>`
                    <div class="fasefinal-match placeholder">
                        Clasificado
                    </div>
                `).join("")}
            </div>

            <div class="fasefinal-round round2">
                <div class="round-title">SEMIFINAL</div>

                <div class="fasefinal-match placeholder">
                    Clasificado
                </div>

            </div>

        </div>


        <div class="bracket-center">

            <div class="champion-trophy"></div>

            <div class="fasefinal-final">

                <div class="round-title">
                    GRAN FINAL
                </div>

                <div class="fasefinal-match placeholder">
                    Ganador SF1
                    <br>
                    vs
                    <br>
                    Ganador SF2
                </div>

            </div>

            <div class="fasefinal-third">

                <div class="round-title">
                    TERCER PUESTO
                </div>

                <div class="fasefinal-match placeholder">
                    Perdedor SF1
                    <br>
                    vs
                    <br>
                    Perdedor SF2
                </div>

            </div>

        </div>


        <div class="bracket-side right">

            <div class="fasefinal-round round2">
                <div class="round-title">SEMIFINAL</div>

                <div class="fasefinal-match placeholder">
                    Clasificado
                </div>
            </div>

            <div class="fasefinal-round round4">
                <div class="round-title">CUARTOS</div>

                ${Array.from({length:2}).map(()=>`
                    <div class="fasefinal-match placeholder">
                        Clasificado
                    </div>
                `).join("")}
            </div>

            <div class="fasefinal-round round8">
                <div class="round-title">OCTAVOS</div>

                ${Array.from({length:4}).map((_,i)=>`
                    <div class="fasefinal-match placeholder">
                        Ganador M${i+9}<br>
                        vs<br>
                        Ganador M${i+10}
                    </div>
                `).join("")}
            </div>

            <div class="fasefinal-round round16">
                <div class="round-title">16AVOS</div>
                ${round16Right.map(renderMatch).join("")}
            </div>

        </div>

        `;
        
    } catch (error) {
        console.error("Error loading fasefinal:", error);
    }
}

loadFaseFinal();
