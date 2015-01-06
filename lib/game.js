Game = {
    userSequence: [],

    createNewUserEntry: function () {
        var userData = Meteor.users.findOne({_id: Meteor.userId()});

        Scores.insert({
            score: Session.get("counter"),
            time: new Date(),
            owner: Meteor.userId(),
            username: userData.username
        }, function () {
            Meteor.call('createSequence', Meteor.userId(), function (err, data) {
                if (err) { return console.log(err); }
                Session.set("currentSequence", data);
                Session.set("sequenceGenerated", true);
            });
        });
    },

    levelCompleted: function () {
        Session.set("counter", Session.get("counter") + 1);
        Meteor.call('updateScore', Meteor.userId(), Session.get("counter"));

        if (Session.get("counter") > Session.get("topScore")) {
            Session.set("topScore", Session.get("counter"));
        }

        this.userSequence = [];

        Session.set("gameActive", false);
        Session.set("currentSequence", []);
        Session.set("sequenceGenerated", false);
    },

    reset: function () {
        Session.set("gameActive", false);
        Session.set("counter", 0);
        Session.set("currentSequence", []);

        if (Meteor.user()) {
            Meteor.call('resetSequence', Meteor.userId());
        }

        Session.set("sequenceGenerated", false);
        this.userSequence = [];
    }
};