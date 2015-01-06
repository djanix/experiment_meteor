Session.setDefault("counter", 0);
Session.setDefault("topScore", 0);
Session.setDefault("gameActive", 0);
Session.setDefault("currentSequence", []);
Session.setDefault("sequenceGenerated", false);

Template.main.rendered = function () {
    if (!this.rendered) {
        //Meteor.call('removeAllScores');
        Meteor.call('resetSequence', Meteor.userId());
        this.rendered = true;
    }
};

Template.main.helpers({
    topScore: function () {
        return Session.get("topScore");
    },

    counter: function () {
        return Session.get("counter") + 1;
    },

    gameActive: function () {
        if (Session.get("gameActive")) {
            return 'is-active';
        }

        return '';
    },

    currentSequence: function () {
        var sequence = [];

        $.each(Session.get("currentSequence"), function (index, value) {
            sequence[index] = value + 1;
        });

        return sequence;
    }
});

Template.main.events({
    'click .start': function () {
        Session.set("gameActive", !Session.get("gameActive"));

        if (!Session.get("sequenceGenerated")) {
            Meteor.call('getUserTopScore', Meteor.userId(), function (err, data) {
                if (err) {
                    return console.log(err);
                }

                if (data == null) {
                    Game.createNewUserEntry();
                } else {
                    Session.set("topScore", data);
                    Meteor.call('createSequence', Meteor.userId(), function (err, data) {
                        if (err) { return console.log(err); }
                        Session.set("currentSequence", data);
                        Session.set("sequenceGenerated", true);
                    });
                }
            });
        }
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});