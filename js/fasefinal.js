/* =========================
   FASE FINAL ENGINE FIXED
========================= */

async function loadFaseFinal() {
    try {

        const res = await fetch("data/fasefinal.json");

        if (!res.ok) {
            throw new Error("No se pudo cargar fasefinal.json");
        }

        const matches = await res.json();

        const container = document.getElementById("fasefinalBracket");
        if (!container) {
            console.warn("No existe #fasefinalBracket en el HTML");
            return;
        }

        const round16Left = matches.filter(m => m.stage === "round16" && m.side === "left");
        const round16Right = matches.filter(m => m.stage === "round16" && m.side === "right");

        const renderMatch = (m) => `
            <div class="fasefinal-match">

                <div class="match-meta">
                    ${m.date || ""} • ${m.time || ""}
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
        `;

        container.innerHTML = `
        <div class="bracket-side left">
            <div class="fasefinal-round">
                <div class="round-title">16AVOS</div>
                ${round16Left.map(renderMatch).join("")}
            </div>
        </div>

        <div class="bracket-center">
            <div class="fasefinal-final">
                <div class="round-title">GRAN FINAL</div>
                <div class="fasefinal-match placeholder">Final</div>
            </div>
        </div>

        <div class="bracket-side right">
            <div class="fasefinal-round">
                <div class="round-title">16AVOS</div>
                ${round16Right.map(renderMatch).join("")}
            </div>
        </div>
        `;

    } catch (err) {
        console.error("Error loading fasefinal:", err);
    }
}

/* =========================
   INIT SAFE
========================= */

document.addEventListener("DOMContentLoaded", () => {
    loadFaseFinal();
});
