var nbChoices = 4;

Meteor.methods({
    getNbOfChoices: function () {
        return nbChoices;
    },

    createSequence: function (userId) {
        var newSequence = Meteor.call('getPreviousSequence', userId);

        newSequence.push(Math.floor(Math.random() * nbChoices));

        Scores.update({
            owner: userId
        }, {
            $set: {
                currentSequence: newSequence
            }
        });

        return newSequence;
    },

    resetSequence: function (userId) {
        Scores.update({
            owner: userId
        }, {
            $set: {
                currentSequence: []
            }
        });
    },

    getPreviousSequence: function (userId) {
        var scoreObj = Scores.findOne({
            owner: userId
        });

        if (!scoreObj.currentSequence) {
            scoreObj.currentSequence = [];
        }

        return scoreObj.currentSequence;
    }
});