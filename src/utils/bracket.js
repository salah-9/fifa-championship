function makeMatch(id, team1 = null, team2 = null) {
  return { id, team1, team2, score1: null, score2: null, winner: null, loser: null, penaltyWinner: null, locked: false };
}

export function generateBracket(teams) {
  const [t1, t2, t3, t4, t5, t6, t7, t8] = teams;
  return {
    status: 'in_progress',
    createdAt: new Date().toISOString(),
    teams,
    winner_bracket: {
      round_of_8: [
        makeMatch('w_r8_1', t1.id, t8.id),
        makeMatch('w_r8_2', t2.id, t7.id),
        makeMatch('w_r8_3', t3.id, t6.id),
        makeMatch('w_r8_4', t4.id, t5.id),
      ],
      semis: [makeMatch('w_s1'), makeMatch('w_s2')],
      final: makeMatch('w_final'),
    },
    lower_bracket: {
      round1: [makeMatch('l_r1_1'), makeMatch('l_r1_2')],
      round2: [makeMatch('l_r2_1'), makeMatch('l_r2_2')],
      semis: [makeMatch('l_s1')],
      final: makeMatch('l_final'),
    },
    grand_final: makeMatch('grand_final'),
  };
}

export function determineWinner(match, score1, score2, penaltyWinner = null) {
  const isDraw = score1 === score2;
  const winner = isDraw ? penaltyWinner : (score1 > score2 ? match.team1 : match.team2);
  const loser = winner === match.team1 ? match.team2 : match.team1;
  return { ...match, score1, score2, winner, loser, penaltyWinner: isDraw ? penaltyWinner : null, locked: true };
}

export function advanceBracket(c, updatedMatch) {
  const championship = JSON.parse(JSON.stringify(c));
  const { id, winner, loser } = updatedMatch;
  const wb = championship.winner_bracket;
  const lb = championship.lower_bracket;

  function update(list, targetId, m) {
    const idx = list.findIndex(i => i.id === targetId);
    if (idx !== -1) list[idx] = m;
  }

  if (id.startsWith('w_r8_')) update(wb.round_of_8, id, updatedMatch);
  else if (id.startsWith('w_s')) update(wb.semis, id, updatedMatch);
  else if (id === 'w_final') wb.final = updatedMatch;
  else if (id.startsWith('l_r1_')) update(lb.round1, id, updatedMatch);
  else if (id.startsWith('l_r2_')) update(lb.round2, id, updatedMatch);
  else if (id === 'l_s1') lb.semis[0] = updatedMatch;
  else if (id === 'l_final') lb.final = updatedMatch;
  else if (id === 'grand_final') championship.grand_final = updatedMatch;

  // WB Quarters → WB Semis (winners) + LB Round 1 (losers)
  if (wb.round_of_8[0].winner) wb.semis[0].team1 = wb.round_of_8[0].winner;
  if (wb.round_of_8[1].winner) wb.semis[0].team2 = wb.round_of_8[1].winner;
  if (wb.round_of_8[2].winner) wb.semis[1].team1 = wb.round_of_8[2].winner;
  if (wb.round_of_8[3].winner) wb.semis[1].team2 = wb.round_of_8[3].winner;

  if (wb.round_of_8[0].loser) lb.round1[0].team1 = wb.round_of_8[0].loser;
  if (wb.round_of_8[1].loser) lb.round1[0].team2 = wb.round_of_8[1].loser;
  if (wb.round_of_8[2].loser) lb.round1[1].team1 = wb.round_of_8[2].loser;
  if (wb.round_of_8[3].loser) lb.round1[1].team2 = wb.round_of_8[3].loser;

  // WB Semis → WB Final (winners) + LB Round 2 (losers paired with LB R1 winners)
  if (wb.semis[0].winner) wb.final.team1 = wb.semis[0].winner;
  if (wb.semis[1].winner) wb.final.team2 = wb.semis[1].winner;

  if (lb.round1[0].winner) lb.round2[0].team1 = lb.round1[0].winner;
  if (wb.semis[0].loser)   lb.round2[0].team2 = wb.semis[0].loser;
  if (lb.round1[1].winner) lb.round2[1].team1 = lb.round1[1].winner;
  if (wb.semis[1].loser)   lb.round2[1].team2 = wb.semis[1].loser;

  // LB Round 2 → LB Semis
  if (lb.round2[0].winner) lb.semis[0].team1 = lb.round2[0].winner;
  if (lb.round2[1].winner) lb.semis[0].team2 = lb.round2[1].winner;

  // LB Semis winner + WB Final loser → LB Final
  if (lb.semis[0].winner) lb.final.team1 = lb.semis[0].winner;
  if (wb.final.loser)     lb.final.team2 = wb.final.loser;

  // WB Final winner + LB Final winner → Grande Final
  if (wb.final.winner)  championship.grand_final.team1 = wb.final.winner;
  if (lb.final.winner)  championship.grand_final.team2 = lb.final.winner;

  return championship;
}