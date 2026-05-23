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

        showError(
            "todayMatches"
        );

        showError(
            "previousMatches"
        );

        showError(
            "upcomingMatches"
        );

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
            getStatusClass(
                match.status
            );

        const card = createMatchCard(
            match,
            statusClass
        );

        container.insertAdjacentHTML(
            "beforeend",
            card
        );

    });

}

/*
=========================================
MATCH CARD TEMPLATE
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

        ${renderExtraInfo(match)}

        <a href="#"
           class="btn btn-primary match-btn">

           Match Center

        </a>

    </article>

    `;
}

/*
=========================================
EXTRA INFO
=========================================
*/

function renderExtraInfo(match) {

    const stadium =
        match.stadium || "";

    const city =
        match.city || "";

    const timeET =
        match.timeET || "";

    const timeAR =
        match.timeAR || "";

    if (
        !stadium &&
        !city &&
        !timeET &&
        !timeAR
    ) {
        return "";
    }

    return `

    <div class="match-details">

        ${timeET ? `
        <div>
            <strong>ET:</strong>
            ${timeET}
        </div>
        ` : ""}

        ${timeAR ? `
        <div>
            <strong>Argentina:</strong>
            ${timeAR}
        </div>
        ` : ""}

        ${stadium ? `
        <div>
            🏟 ${stadium}
        </div>
        ` : ""}

        ${city ? `
        <div>
            📍 ${city}
        </div>
        ` : ""}

    </div>

    `;
}

/*
=========================================
STATUS COLORS
=========================================
*/

function getStatusClass(status) {

    switch (status) {

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
ERROR HANDLER
=========================================
*/

function showError(containerId) {

    const container =
        document.getElementById(containerId);

    if (!container) return;

    container.innerHTML = `
    <div class="match-card">
        <p>Unable to load data.</p>
    </div>
    `;
}
