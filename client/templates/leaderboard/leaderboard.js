Template.leaderboard.helpers({
    scores: function () {
        return Scores.find({}, {sort: {score: -1}});
    }
});