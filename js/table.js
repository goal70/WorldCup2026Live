function calculateStandings(matches) {
  const table = {};

  matches.forEach(m => {
    if (!table[m.teamA]) {
      table[m.teamA] = { pj: 0, g: 0, e: 0, p: 0, gf: 0, ga: 0, pts: 0 };
    }
    if (!table[m.teamB]) {
      table[m.teamB] = { pj: 0, g: 0, e: 0, p: 0, gf: 0, ga: 0, pts: 0 };
    }

    if (!m.played) return;

    const A = table[m.teamA];
    const B = table[m.teamB];

    A.pj++; B.pj++;
    A.gf += m.scoreA;
    A.ga += m.scoreB;
    B.gf += m.scoreB;
    B.ga += m.scoreA;

    if (m.scoreA > m.scoreB) {
      A.g++; B.p++;
      A.pts += 3;
    } else if (m.scoreB > m.scoreA) {
      B.g++; A.p++;
      B.pts += 3;
    } else {
      A.e++; B.e++;
      A.pts += 1;
      B.pts += 1;
    }
  });

  return table;
}
