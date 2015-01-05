Meteor.methods({
    createSequence: function (userId, choices, sequenceLength) {
        var sequence = [];

        for (var i = 0; i < sequenceLength; i++) {
            sequence[i] = Math.floor(Math.random() * choices);
        }

        Scores.update({
            owner: userId
        }, {
            $set: {
                currentSequence: sequence
            }
        });

        return sequence;
    }
});