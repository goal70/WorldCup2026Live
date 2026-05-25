/*
=================================
WORLD GOAL 2026
APP
=================================
*/

let allMatches = [];

document.addEventListener("DOMContentLoaded", async () => {

    await loadMatches();

    setupNavigation();

});

/*
=================================
LOAD JSON
=================================
*/

async function loadMatches(){

    try{

        const response =
        await fetch("data/matches.json");

        allMatches =
        await response.json();

        showToday();

    }

    catch(error){

        console.error(error);

        document.getElementById(
            "todayMatches"
        ).innerHTML = `
            <div class="match-card">
                Unable to load matches.
            </div>
        `;
    }

}

/*
=================================
DATE FILTERS
=================================
*/

function showToday(){

    const today =
    new Date().toISOString().split("T")[0];

    const matches =
    allMatches.filter(
        m => m.date === today
    );

    renderMatches(matches);

}

function showYesterday(){

    const date =
    new Date();

    date.setDate(
        date.getDate() - 1
    );

    const target =
    date.toISOString().split("T")[0];

    const matches =
    allMatches.filter(
        m => m.date === target
    );

    renderMatches(matches);

}

function showTomorrow(){

    const date =
    new Date();

    date.setDate(
        date.getDate() + 1
    );

    const target =
    date.toISOString().split("T")[0];

    const matches =
    allMatches.filter(
        m => m.date === target
    );

    renderMatches(matches);

}

/*
=================================
BUTTONS
=================================
*/

function setupNavigation(){

    const yesterday =
    document.getElementById(
        "yesterdayBtn"
    );

    const today =
    document.getElementById(
        "todayBtn"
    );

    const tomorrow =
    document.getElementById(
        "tomorrowBtn"
    );

    yesterday?.addEventListener(
        "click",
        () => {

            setActiveButton(
                yesterday
            );

            showYesterday();
        }
    );

    today?.addEventListener(
        "click",
        () => {

            setActiveButton(
                today
            );

            showToday();
        }
    );

    tomorrow?.addEventListener(
        "click",
        () => {

            setActiveButton(
                tomorrow
            );

            showTomorrow();
        }
    );

}

function setActiveButton(button){

    document
    .querySelectorAll(".day-btn")
    .forEach(btn =>
        btn.classList.remove(
            "active"
        )
    );

    button.classList.add(
        "active"
    );

}

/*
=================================
RENDER
=================================
*/

function renderMatches(matches){

    const container =
    document.getElementById(
        "todayMatches"
    );

    container.innerHTML = "";

    if(matches.length === 0){

        container.innerHTML = `
        <div class="match-card">
            No matches scheduled.
        </div>
        `;

        return;
    }

    matches.forEach(match => {

        container.innerHTML += `

        <article class="match-card">

            <div class="match-top">

                <div class="match-status">
                    ${match.status}
                </div>

            </div>

            <div class="match-center">

                <div class="team">

                    <span class="flag">
                        ${match.homeFlag}
                    </span>

                    <div class="team-name">
                        ${match.homeTeam}
                    </div>

                </div>

                <div class="score">

                    <div class="score-number">

                        ${
                            match.homeScore !== null
                            ? `${match.homeScore} - ${match.awayScore}`
                            : "vs"
                        }

                    </div>

                </div>

                <div class="team">

                    <span class="flag">
                        ${match.awayFlag}
                    </span>

                    <div class="team-name">
                        ${match.awayTeam}
                    </div>

                </div>

            </div>

            <div class="match-details">

                <div>
                    Group ${match.group}
                </div>

                <div>
                    🕒 ET:
                    ${match.localTime}
                </div>

                <div>
                    🇦🇷 Argentina:
                    ${match.argentinaTime}
                </div>

                <div>
                    🏟 ${match.stadium}
                </div>

                <div>
                    📍 ${match.city}
                </div>

            </div>

        </article>

        `;

    });

}
