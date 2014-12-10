var game = {
    data: {
        score: 0
    },
    "onload": function() {
        // Makes the video work
        if (!me.video.init("screen", me.video.CANVAS, 1067, 600, true, 1.0)) {
            alert("Your browser does not support HTML5 canvas.");
            return;
        }

        if (document.location.hash === "#debug") {
            window.onReady(function() {
                me.plugin.register.defer(this, debugPanel, "debug");
            });
        }

        me.audio.init("mp3,ogg");

        me.loader.onload = this.loaded.bind(this);

        me.loader.preload(game.resources);

        me.state.change(me.state.LOADING);
    },
    //Make sure badyguy, mushroom, and player works 
    "loaded": function() {
        me.pool.register("mario", game.PlayerEntity, true);
        me.pool.register("BadGuy", game.BadGuy);
        me.pool.register("mushroom", game.Mushroom);

        //makes sure we can go to our next level
        me.pool.register("levelTrigger", game.LevelTrigger);

        //me.state.set makes sure that the title and play screen are functioned and running
        me.state.set(me.state.MENU, new game.TitleScreen());
        me.state.set(me.state.PLAY, new game.PlayScreen());

        //makes sure menu screen works
        me.state.change(me.state.MENU);
    }
};
