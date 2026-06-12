function calculateStandings(matches) {
  const table = {};

  matches.forEach(match => {
    const { teamA, teamB, scoreA, scoreB, played } = match;

    if (!table[teamA]) {
      table[teamA] = { points: 0, gf: 0, ga: 0 };
    }
    if (!table[teamB]) {
      table[teamB] = { points: 0, gf: 0, ga: 0 };
    }

    if (!played) return;

    table[teamA].gf += scoreA;
    table[teamA].ga += scoreB;

    table[teamB].gf += scoreB;
    table[teamB].ga += scoreA;

    if (scoreA > scoreB) {
      table[teamA].points += 3;
    } else if (scoreB > scoreA) {
      table[teamB].points += 3;
    } else {
      table[teamA].points += 1;
      table[teamB].points += 1;
    }
  });

  return table;
}
