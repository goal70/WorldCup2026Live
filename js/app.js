/*
=========================================
WORLD GOAL 2026
MAIN APPLICATION
=========================================
*/

document.addEventListener("DOMContentLoaded", () => {

    loadMatches();

});

/*
=========================================
LOAD MATCHES
=========================================
*/

async function loadMatches() {

    try {

        const response = await fetch("data/matches.json");

        if (!response.ok) {
            throw new Error("Unable to load matches.json");
        }

        const data = await response.json();

        renderMatches(
            data.today || [],
            "todayMatches"
        );

        renderMatches(
            data.previous || [],
            "previousMatches"
        );

        renderMatches(
            data.upcoming || [],
            "upcomingMatches"
        );

    } catch (error) {

        console.error(error);

        showError("todayMatches");
        showError("previousMatches");
        showError("upcomingMatches");

    }

}

/*
=========================================
RENDER MATCHES
=========================================
*/

function renderMatches(matches, containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = "";

    if (matches.length === 0) {

        container.innerHTML = `
            <div class="match-card">
                <p>No matches available.</p>
            </div>
        `;

        return;
    }

    matches.forEach(match => {

        const statusClass =
            getStatusClass(match.status);

        const card =
            createMatchCard(match, statusClass);

        container.insertAdjacentHTML(
            "beforeend",
            card
        );

    });

}

/*
=========================================
MATCH CARD
=========================================
*/

function createMatchCard(match, statusClass) {

    return `

    <article class="match-card">

        <div class="match-top">

            <div class="match-status ${statusClass}">
                ${match.status || ""}
            </div>

            <div class="match-time">
                ${match.minute || ""}
            </div>

        </div>

        <div class="match-center">

            <div class="team">

                <span class="flag">
                    ${match.flag1 || ""}
                </span>

                <div class="team-name">
                    ${match.team1 || ""}
                </div>

            </div>

            <div class="score">

                <div class="score-number">
                    ${match.score || "-"}
                </div>

            </div>

            <div class="team">

                <span class="flag">
                    ${match.flag2 || ""}
                </span>

                <div class="team-name">
                    ${match.team2 || ""}
                </div>

            </div>

        </div>

        <div class="match-details">

            ${match.group ? `
            <div>
                <strong>${match.group}</strong>
            </div>
            ` : ""}

            ${match.timeET ? `
            <div>
                🕒 ET: ${match.timeET}
            </div>
            ` : ""}

            ${match.timeAR ? `
            <div>
                🇦🇷 Argentina: ${match.timeAR}
            </div>
            ` : ""}

            ${match.stadium ? `
            <div>
                🏟 ${match.stadium}
            </div>
            ` : ""}

            ${match.city ? `
            <div>
                📍 ${match.city}
            </div>
            ` : ""}

        </div>

        <a href="#"
           class="btn btn-primary match-btn">

           Match Center

        </a>

    </article>

    `;
}

/*
=========================================
STATUS COLORS
=========================================
*/

function getStatusClass(status) {

    switch(status){

        case "LIVE":
            return "live";

        case "FINAL":
            return "final";

        case "UPCOMING":
            return "upcoming";

        default:
            return "upcoming";

    }

}

/*
=========================================
ERROR DISPLAY
=========================================
*/

function showError(containerId){

    const container =
        document.getElementById(containerId);

    if(!container) return;

    container.innerHTML = `

        <div class="match-card">

            <p>
                Unable to load match data.
            </p>

        </div>

    `;
}
