export const voteStrategies = {
  votesInteresting: (fact) => ({
    ...fact,
    votesInteresting: fact.votesInteresting + 1,
  }),
  votesMindblowing: (fact) => ({
    ...fact,
    votesMindblowing: fact.votesMindblowing + 1,
  }),
  votesFalse: (fact) => ({
    ...fact,
    votesFalse: fact.votesFalse + 1,
  }),
};
