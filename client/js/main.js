Session.setDefault("counter", 0);
Session.setDefault("topScore", 0);

Template.main.rendered = function () {
    //Meteor.call('removeAllScores');

    Meteor.call('getUserTopScore', Meteor.userId(), function (err, data) {
        if (err) { return console.log(err); }

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
        return Session.get("counter");
    },

    scores: function () {
        return Scores.find({});
    }
});

Template.main.events({
    'click button': function () {
        Session.set("counter", Session.get("counter") + 1);
        Meteor.call('updateScore', Meteor.userId(), Session.get("counter"));

        if (Session.get("counter") > Session.get("topScore")) {
            Session.set("topScore", Session.get("counter"));
        }
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});