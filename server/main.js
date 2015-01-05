Meteor.methods({
    updateScore: function (userId, score) {
        var previousTopScore = Meteor.call("getUserTopScore", userId);

        if (previousTopScore < score) {
            Scores.update({
                owner: userId
            }, {
                $set: {
                    score: score,
                    time: new Date()
                }
            });
        }
    },

    removeAllScores: function () {
        return Scores.remove({});
    },

    getUserTopScore: function (userId) {
        var currentScore = Scores.findOne({
            owner: userId
        });

        if (!currentScore) {
            return null;
        }

        return currentScore.score;
    }
});