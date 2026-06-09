const API_BASE = "https://footbal-api.otanomix.workers.dev";

async function testAPI() {
    try {
        const response = await fetch(`${API_BASE}/status`);
        const data = await response.json();

        console.log("API OK", data);
        window.apiFootball = data;

    } catch (error) {
        console.error("API ERROR", error);
    }
}

testAPI();
