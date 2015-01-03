Session.setDefault("counter", 0);

Template.main.rendered = function () {
    //Meteor.call('removeAllScores');
};

Template.main.helpers({
    counter: function () {
        return Session.get("counter");
    },

    scores: function () {
        return Scores.find({});
    }
});

Template.main.events({
    'click button': function () {
        var currentScore = Scores.findOne({
            owner: Meteor.userId()
        });

        if (!currentScore) {
            Scores.insert({
                score: Session.get("counter"),
                time: new Date(),
                owner: Meteor.userId()
                //username: Meteor.user().username
            });
        } else {
            Session.set("counter", Session.get("counter") + 1);
            Meteor.call('updateScore', Session.get("counter"));
        }
    }
});

Accounts.ui.config({
    passwordSignupFields: "USERNAME_ONLY"
});