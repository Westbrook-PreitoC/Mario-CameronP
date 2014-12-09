game.PlayScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        game.data.score = 0;

        me.levelDirector.loadLevel("CameronPlevel04");

        this.resetPlayer(0, 400);

        //me.input.bindKey lets us know which keys are functioning and which buttons to press
        me.input.bindKey(me.input.KEY.RIGHT, "right");
        me.input.bindKey(me.input.KEY.LEFT, "left");
        me.input.bindKey(me.input.KEY.UP, "up");

        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
    },
    //Restarts when player is eliminated
    onDestroyEvent: function() {
        me.game.world.removeChild(this.HUD);
    },
    resetPlayer: function(x, y) {
        var player = me.pool.pull("mario", 0, 420, {});
        me.game.world.addChild(player, 5);
    }
});
