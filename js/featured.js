document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("featured-container");

    try {

        console.log("JS OK");

        const response = await fetch("featured.json");

        console.log("STATUS:", response.status);

        const text = await response.text();

        console.log("RAW:", text);

        const articles = JSON.parse(text);

        container.innerHTML =
            `<h2 style="color:white">Artículos encontrados: ${articles.length}</h2>`;

    } catch (err) {

        console.error("ERROR:", err);

        container.innerHTML = `
            <div style="padding:20px;color:red">
                ${err}
            </div>
        `;
    }

});
