Session.setDefault("nbChoices", 0);

Template.buttons.rendered = function () {
    if (!this.rendered) {
        Meteor.call('getNbOfChoices', function(err, data) {
            Session.set("nbChoices", data);
        });

        this.rendered = true;
    }
};

Template.buttons.helpers({
    buttonList: function () {
        var list = [];

        for (var i = 1; i <= Session.get("nbChoices"); i++) {
            list.push({index: i});
        }

        return list;
    }
});

Template.buttons.events({
    'click .item': function (event) {
        if (!Session.get("gameActive")) { return; }

        Game.userSequence.push($(event.target).index());

        if (Game.userSequence.length < Session.get("currentSequence").length) {
            return;
        }

        if (Game.userSequence.equals(Session.get("currentSequence"))) {
            Game.levelCompleted();
        } else {
            Game.reset();
        }
    }
});

Deps.autorun(function () {
    if (!Meteor.user()) {
        Game.reset();
    }
});