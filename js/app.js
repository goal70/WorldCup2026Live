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
LOAD GROUPS
=================================
*/

async function loadMatches(){

    try{

        const groups = [
            "a","b","c","d","e","f",
            "g","h","i","j","k","l"
        ];

        allMatches = [];

        for(const group of groups){

            const response =
            await fetch(
                `data/groups/groups-${group}.json`
            );

            const matches =
            await response.json();

            matches.forEach(match => {

                allMatches.push({

                    id: match.id,

                    group: match.group,

                    date: match.date,

                    status: match.status,

                    homeTeam: match.team1,
                    awayTeam: match.team2,

                    homeFlag: match.flag1,
                    awayFlag: match.flag2,

                    homeScore: null,
                    awayScore: null,

                    stadium: match.stadium,
                    city: match.city,

                    localTime: match.timeET,
                    argentinaTime: match.timeAR

                });

            });

        }

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

    const firstDate =
    [...allMatches]
    .sort(
        (a,b)=>
        new Date(a.date)-
        new Date(b.date)
    )[0].date;

    const matches =
    allMatches.filter(
        match =>
        match.date === firstDate
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

                    <img
                        class="flag"
                        src="https://flagcdn.com/w80/${match.homeFlag}.png"
                        alt="${match.homeTeam}"
                    >

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

                    <img
                        class="flag"
                        src="https://flagcdn.com/w80/${match.awayFlag}.png"
                        alt="${match.awayTeam}"
                    >

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

            <!-- 🔥 BOTONES A LA DERECHA -->
            <div class="match-actions">

    ${match.links?.map(link => `
        <a href="${link.url}" target="_blank">
            <img src="${link.logo}" alt="${link.name}">
        </a>
    `).join('') || ''}

</div>

        </article>

        `;

    });

}
