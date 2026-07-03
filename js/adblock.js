(() => {
    "use strict";

    const STORAGE_KEY = "wg26_adblock_until";
    const REMIND_DAYS = 15;
    const OVERLAY_DELAY = 20000;
    const DETECT_DELAY = 150;

    function getOverlay() {
        return document.getElementById("adblockOverlay");
    }

    function shouldShowAgain() {
        const until = Number(localStorage.getItem(STORAGE_KEY) || 0);
        return Date.now() > until;
    }

    function rememberDismiss() {
        const expires =
            Date.now() + REMIND_DAYS * 24 * 60 * 60 * 1000;

        localStorage.setItem(STORAGE_KEY, String(expires));
    }

    function showOverlay() {
        const overlay = getOverlay();

        if (!overlay) {
            console.warn("No se encontró #adblockOverlay");
            return;
        }

        overlay.style.display = "flex";
    }

    function hideOverlay() {
        const overlay = getOverlay();

        if (!overlay) return;

        overlay.style.display = "none";
    }

    function createBait() {
        const bait = document.createElement("div");

        bait.className = "adsbox";
        bait.style.position = "absolute";
        bait.style.left = "-9999px";
        bait.innerHTML = "&nbsp;";

        document.body.appendChild(bait);

        return bait;
    }

    function detect() {

        if (!shouldShowAgain()) return;

        const bait = createBait();

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

            setTimeout(showOverlay, OVERLAY_DELAY);

        }, DETECT_DELAY);
    }

    window.addEventListener("load", detect);

    document.addEventListener("click", (e) => {

        switch (e.target.id) {

            case "adblockReload":
                location.reload();
                break;

            case "adblockClose":
                hideOverlay();
                rememberDismiss();
                break;
        }

    });

})();
