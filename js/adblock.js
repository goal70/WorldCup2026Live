(() => {

const STORAGE_KEY = "wg26_adblock_until";

function shouldShowAgain() {
    const until = localStorage.getItem(STORAGE_KEY);
    if (!until) return true;
    return Date.now() > Number(until);
}

if (!shouldShowAgain()) return;

function detect() {

    const bait = document.createElement("div");

    bait.className = "adsbox";
    bait.style.position = "absolute";
    bait.style.left = "-9999px";
    bait.innerHTML = "&nbsp;";

    document.body.appendChild(bait);

    setTimeout(() => {

        const style = getComputedStyle(bait);

        const blocked =
            bait.offsetParent === null ||
            bait.offsetHeight === 0 ||
            bait.offsetWidth === 0 ||
            style.display === "none" ||
            style.visibility === "hidden";

        bait.remove();

        if (!blocked) return;

        setTimeout(() => {

            const overlay = document.getElementById("adblockOverlay");

            if (!overlay) return;

            overlay.style.display = "flex";

        }, 20000);

    }, 150);

}

window.addEventListener("load", detect);

document.addEventListener("click", e => {

    if (e.target.id === "adblockReload") {
        location.reload();
    }

    if (e.target.id === "adblockClose") {

        const overlay = document.getElementById("adblockOverlay");

        if (overlay) {
            overlay.style.display = "none";
        }

        const fifteenDays = 15 * 24 * 60 * 60 * 1000;

        localStorage.setItem(
            STORAGE_KEY,
            String(Date.now() + fifteenDays)
        );
    }

});

})();
