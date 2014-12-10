game.TitleScreen = me.ScreenObject.extend({
    onResetEvent: function() {
        me.game.world.addChild(new me.Sprite(0, 0, me.loader.getImage("title-screen")), -10);
        me.input.bindKey(me.input.KEY.ENTER, "start");

        me.game.world.addChild(new (me.Renderable.extend({
            init: function() {
                this._super(me.Renderable, 'init', [510, 30, me.game.viewport.width, me.game.viewport.height]);
                this.font = new me.Font("Arial", 50, "red");

            },
            //tells you to put title and start button
            draw: function(renderer) {
                this.font.draw(renderer.getContext(), "FakeMario", 450, 130);
                this.font.draw(renderer.getContext(), "Press ENTER to play!", 250, 530);
            }

        })));

        //this code makes sure your play screen works
        this.handler = me.event.subscribe(me.event.KEYDOWN, function(action, keyCode, edge) {
            if (action === "start") {
                me.state.change(me.state.PLAY);
            }
        });
    },
    onDestroyEvent: function() {
        me.input.unbindKey(me.input.KEY.ENTER);
        me.event.unsubscribe(this.handler);
    }
});
