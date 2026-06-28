async function loadFaseFinal() {
    try {

        const res = await fetch("data/fasefinal.json");

        if (!res.ok) {
            throw new Error("No se pudo cargar fasefinal.json");
        }

        const matches = await res.json();

        const leftMatches =
    matches.filter(m => m.side === "left");

const rightMatches =
    matches.filter(m => m.side === "right");

        const container = document.getElementById("fasefinalBracket");

        if (!container) return;

      // 🔥 16avos
const renderMatch = (m) => `
<div class="fasefinal-match">

    <div class="match-meta">
        ${m.displayDate || m.date} • ${m.timeAR || m.time}
    </div>

    <div class="team-row">
        <span class="seed">${m.seed1 || ""}</span>
        <img src="https://flagcdn.com/w40/${m.flag1}.png">
        <span>${m.team1}</span>

        ${
            m.status !== "UPCOMING"
                ? `<span class="match-score">${m.homeScore}</span>`
                : ""
        }
    </div>

    <div class="team-row">
        <span class="seed">${m.seed2 || ""}</span>
        <img src="https://flagcdn.com/w40/${m.flag2}.png">
        <span>${m.team2}</span>

        ${
            m.status !== "UPCOMING"
                ? `<span class="match-score">${m.awayScore}</span>`
                : ""
        }
    </div>

</div>
`;

container.innerHTML = `

<div class="bracket-side left">

    <div class="fasefinal-round round16">
        <div class="round-title">16AVOS</div>
        ${leftMatches.map(renderMatch).join("")}
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
        ${rightMatches.map(renderMatch).join("")}
    </div>

</div>

`;

    } catch (error) {
        console.error("Error loading fasefinal:", error);
    }
}

loadFaseFinal();
