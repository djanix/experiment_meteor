Meteor.startup(function () {
    return Meteor.methods({
        updateScore: function (score) {
            Scores.update({
                owner: Meteor.userId()
            }, {
                $set: {
                    score: score,
                    time: new Date()
                }
            });
        },

        removeAllScores: function () {
            return Scores.remove({});
        }
    });
});