Session.setDefault("counter", 0);
Session.setDefault("topScore", 0);
Session.setDefault("gameActive", 0);

var sequenceGenerated = false;

Template.main.rendered = function () {
    //Meteor.call('removeAllScores');

    Meteor.call('getUserTopScore', Meteor.userId(), function (err, data) {
        if (err) {
            return console.log(err);
        }

        if (!data) {
            var userData = Meteor.users.findOne({_id: Meteor.userId()});

            Scores.insert({
                score: Session.get("counter"),
                time: new Date(),
                owner: Meteor.userId(),
                username: userData.username
            });
        } else {
            Session.set("topScore", data);
        }
    });
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

    scores: function () {
        return Scores.find({});
    }
});

Template.main.events({
    'click .start': function () {
        Session.set("gameActive", !Session.get("gameActive"));

        if (!sequenceGenerated) {
            Meteor.call('createSequence', Meteor.userId(), $('.item').length, Session.get("counter") + 1, function (err, data) {
                if (err) { return console.log(err); }
                sequenceGenerated = true;
            });
        }
    },

    'click .item': function () {
        if (!Session.get("gameActive")) { return; }
        //Session.set("counter", Session.get("counter") + 1);
        //Meteor.call('updateScore', Meteor.userId(), Session.get("counter"));
        //
        //if (Session.get("counter") > Session.get("topScore")) {
        //    Session.set("topScore", Session.get("counter"));
        //}

        var sequence = Scores.findOne({owner: Meteor.userId()}).currentSequence;
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});