window.addEventListener("load", () => {

    const bait = document.createElement("div");

    bait.className = "adsbox";
    bait.style.position = "absolute";
    bait.style.left = "-9999px";
    bait.innerHTML = "&nbsp;";

    document.body.appendChild(bait);

    setTimeout(() => {

        const blocked = bait.offsetHeight === 0;

        bait.remove();

        if(blocked){

            document.getElementById("adblockOverlay").style.display="flex";

        }

    },100);

});

document.getElementById("adblockReload").onclick=()=>{

    location.reload();

};

document.getElementById("adblockClose").onclick=()=>{

    document.getElementById("adblockOverlay").style.display="none";

};
