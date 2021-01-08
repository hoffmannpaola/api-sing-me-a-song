
async function createRecomendations(db, candidateNumber, numberOfVotes) {
    for (let i = 0; i < numberOfVotes; i++) await createVote(db, candidateNumber);
  }