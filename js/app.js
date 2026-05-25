/* =========================================
   WORLD GOAL 2026
   PROFESSIONAL FOOTBALL DESIGN
========================================= */

:root{

    --bg:#06140E;
    --bg2:#0B2017;

    --card:#10291E;
    --card-hover:#17382A;

    --primary:#00D26A;
    --secondary:#FFD447;

    --white:#FFFFFF;
    --text:#D8E4DE;
    --soft:#94A89D;

    --border:#1D4635;

    --live:#00FF84;
    --final:#FFD447;
    --upcoming:#6AB8FF;

    --radius:18px;

    --shadow:
    0 10px 30px rgba(0,0,0,.35);

    --max-width:1400px;
}

/* =========================================
   RESET
========================================= */

*{
    margin:0;
    padding:0;
    box-sizing:border-box;
}

html{
    scroll-behavior:smooth;
}

body{

    font-family:
    Inter,
    Arial,
    Helvetica,
    sans-serif;

    background:
    linear-gradient(
        180deg,
        var(--bg),
        var(--bg2)
    );

    color:var(--white);

    min-height:100vh;
}

/* =========================================
   CONTAINER
========================================= */

.container{

    width:95%;

    max-width:var(--max-width);

    margin:auto;
}

/* =========================================
   HEADER
========================================= */

header{

    position:sticky;

    top:0;

    z-index:1000;

    background:
    rgba(6,20,14,.95);

    backdrop-filter:blur(12px);

    border-bottom:
    1px solid var(--border);
}

.header-inner{

    display:flex;

    justify-content:space-between;

    align-items:center;

    padding:18px 0;
}

.logo{

    font-size:2rem;

    font-weight:800;

    letter-spacing:.5px;
}

.logo span{

    color:var(--primary);
}

nav{

    display:flex;

    gap:30px;
}

nav a{

    color:white;

    text-decoration:none;

    font-weight:700;

    transition:.25s;
}

nav a:hover{

    color:var(--primary);
}

nav a.active{

    color:var(--primary);
}

/* =========================================
   HERO
========================================= */

.hero{

    margin-top:20px;

    border-radius:25px;

    overflow:hidden;

    text-align:center;

    padding:120px 20px;

    background:
    linear-gradient(
        rgba(0,0,0,.55),
        rgba(0,0,0,.55)
    ),
    url("https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1800");

    background-size:cover;

    background-position:center;

    box-shadow:var(--shadow);
}

.hero h1{

    font-size:4rem;

    margin-bottom:15px;

    text-shadow:
    0 4px 12px rgba(0,0,0,.6);
}

.hero p{

    font-size:1.2rem;

    color:#E8E8E8;
}

/* =========================================
   SECTIONS
========================================= */

section{

    margin-top:35px;
}

.section-title{

    font-size:2rem;

    margin-bottom:25px;

    padding-left:15px;

    border-left:
    5px solid var(--primary);
}

/* =========================================
   MATCHES GRID
========================================= */

.matches-grid{

    display:grid;

    gap:20px;
}

/* =========================================
   MATCH CARD
========================================= */

.match-card{

    background:
    linear-gradient(
        180deg,
        #123426,
        #0D241B
    );

    border:
    1px solid var(--border);

    border-radius:var(--radius);

    padding:25px;

    box-shadow:var(--shadow);

    transition:.25s;
}

.match-card:hover{

    transform:translateY(-3px);

    background:
    var(--card-hover);
}

.match-top{

    display:flex;

    justify-content:space-between;

    align-items:center;

    margin-bottom:20px;
}

.match-status{

    font-weight:800;

    font-size:.9rem;
}

.live{

    color:var(--live);
}

.final{

    color:var(--final);
}

.upcoming{

    color:var(--upcoming);
}

.match-center{

    display:flex;

    align-items:center;

    justify-content:space-between;

    gap:20px;
}

.team{

    flex:1;

    text-align:center;
}

.flag{

    display:block;

    font-size:2.5rem;

    margin-bottom:8px;
}

.team-name{

    font-size:1.1rem;

    font-weight:700;
}

.score{

    min-width:140px;

    text-align:center;
}

.score-number{

    font-size:2.4rem;

    font-weight:900;
}

.match-details{

    margin-top:20px;

    display:grid;

    gap:8px;

    color:var(--text);
}

/* =========================================
   BUTTONS
========================================= */

.btn{

    display:inline-block;

    text-decoration:none;

    border:none;

    border-radius:12px;

    padding:12px 24px;

    font-weight:800;

    cursor:pointer;

    transition:.25s;
}

.btn-primary{

    background:var(--primary);

    color:black;
}

.btn-primary:hover{

    transform:translateY(-1px);
}

.match-btn{

    margin-top:20px;
}

/* =========================================
   TABLES
========================================= */

.table-wrapper{

    overflow-x:auto;
}

table{

    width:100%;

    border-collapse:collapse;

    background:var(--card);

    border-radius:var(--radius);

    overflow:hidden;
}

th{

    background:#17382A;
}

th,
td{

    padding:14px;

    text-align:center;

    border:1px solid var(--border);
}

/* =========================================
   ADS
========================================= */

.ad-slot{

    height:140px;

    border:
    2px dashed var(--border);

    border-radius:var(--radius);

    display:flex;

    justify-content:center;

    align-items:center;

    color:var(--soft);

    background:#0C241A;
}

/* =========================================
   FOOTER
========================================= */

footer{

    margin-top:60px;

    border-top:
    1px solid var(--border);
}

.footer-inner{

    padding:40px 0;
}

.footer-links{

    display:flex;

    justify-content:center;

    gap:25px;

    flex-wrap:wrap;
}

.footer-links a{

    color:var(--soft);

    text-decoration:none;
}

.footer-links a:hover{

    color:white;
}

.copyright{

    text-align:center;

    margin-top:20px;

    color:var(--soft);
}

/* =========================================
   MOBILE
========================================= */

@media(max-width:768px){

    .header-inner{

        flex-direction:column;

        gap:15px;
    }

    nav{

        flex-wrap:wrap;

        justify-content:center;
    }

    .hero{

        padding:70px 20px;
    }

    .hero h1{

        font-size:2.2rem;
    }

    .match-center{

        flex-direction:column;
    }

    .score{

        min-width:auto;
    }

    .score-number{

        font-size:2rem;
    }

    .section-title{

        font-size:1.5rem;
    }
}
