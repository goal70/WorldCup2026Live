document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("featured-container");

    try {

        const response = await fetch("featured.json");
        const articles = await response.json();

        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        container.innerHTML = articles.map(article => `

            <article class="featured-card">

                <div class="featured-date">
                    ${article.date}
                </div>

                <div class="featured-layout">

                    <div class="featured-image">
                        <img src="${article.image}" alt="${article.title}">
                    </div>

                    <div class="featured-content">

                        <span class="featured-category">
                            ${article.category}
                        </span>

                        <h2>${article.title}</h2>

                        <p>${article.description}</p>

                    </div>

                </div>

            </article>

        `).join("");

    } catch (err) {

        console.error(err);

        container.innerHTML = `
            <div class="error-box">
                Error loading featured articles.
            </div>
        `;
    }

});
