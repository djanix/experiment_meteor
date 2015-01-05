Session.setDefault("counter", 0);
Session.setDefault("topScore", 0);
Session.setDefault("gameActive", 0);
Session.setDefault("currentSequence", []);

var userSequence = [];
var sequenceGenerated = false;

Template.main.rendered = function () {
    //Meteor.call('removeAllScores');
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
    },

    currentSequence: function () {
        return Session.get("currentSequence");
    }
});

Template.main.events({
    'click .start': function () {
        Session.set("gameActive", !Session.get("gameActive"));

        if (!sequenceGenerated) {
            Meteor.call('getUserTopScore', Meteor.userId(), function (err, data) {
                if (err) {
                    return console.log(err);
                }

                if (data == null) {
                    var userData = Meteor.users.findOne({_id: Meteor.userId()});

                    Scores.insert({
                        score: Session.get("counter"),
                        time: new Date(),
                        owner: Meteor.userId(),
                        username: userData.username
                    }, function () {
                        Meteor.call('createSequence', Meteor.userId(), $('.item').length, Session.get("counter") + 1, function (err, data) {
                            if (err) { return console.log(err); }
                            Session.set("currentSequence", data);
                            sequenceGenerated = true;
                        });
                    });
                } else {
                    Session.set("topScore", data);

                    Meteor.call('createSequence', Meteor.userId(), $('.item').length, Session.get("counter") + 1, function (err, data) {
                        if (err) { return console.log(err); }
                        Session.set("currentSequence", data);
                        sequenceGenerated = true;
                    });
                }
            });
        }
    },

    'click .item': function (event) {
        if (!Session.get("gameActive")) { return; }

        //var sequence = Scores.findOne({owner: Meteor.userId()}).currentSequence;
        userSequence.push($(event.target).index());

        if (userSequence.equals(Session.get("currentSequence"))) {
            Session.set("counter", Session.get("counter") + 1);
            Meteor.call('updateScore', Meteor.userId(), Session.get("counter"));

            if (Session.get("counter") > Session.get("topScore")) {
                Session.set("topScore", Session.get("counter"));
            }

            Session.set("gameActive", !Session.get("gameActive"));
            Session.set("currentSequence", []);

            userSequence = [];
            sequenceGenerated = false;
        }
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});