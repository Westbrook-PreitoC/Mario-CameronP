game.PlayerEntity = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mario",
                spritewidth: "128",
                spiteheight: "128",
                width: 128,
                height: 128,
                getShape: function() {
                    return (new me.Rect(0, 0, 30, 128)).toPolygon();
                }
            }]);

        this.renderable.addAnimation("idle", [3]);
        this.renderable.addAnimation("bigIdle", [19]),
                //creates an animation called smallWalk that uses pictures from the image above, mario
                //uses pictures 8-13 for our animation
                //flips through the pictures every 80 milliseconds
                this.renderable.addAnimation("smallWalk", [8, 9, 10, 11, 12, 13], 80);

        this.renderable.addAnimation("bigWalk", [14, 15, 16, 17, 18, 19], 80);
        this.renderable.addAnimation("shrink", [0, 1, 2, 3], 80);
        this.renderable.addAnimation("grow", [4, 5, 6, 7], 80);


        this.renderable.setCurrentAnimation("idle");


        //creates a variable that tells us whether we are big(whether the mushroom powerup is active) 
        this.big = false;

        //sets the speed of mario. The first number represents speed on the x axis, 2nd on the y axis
        this.body.setVelocity(5, 20);

        //makes the camera(viewport) follow mario's position (this.pos) on both axes
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);

    },
    update: function(delta) {
        // checks if the right button is pressed, and if so executes the next line of code
        if (me.input.isKeyPressed("right")) {
            this.flipX(false);
            //sets the x position of mario by adding the velocity set above in setVelocity() times me.timer.tick
            //me.timer.tick makes the character move at a smooth pace even if updates are irregular    
            this.body.vel.x += this.body.accel.x * me.timer.tick;

        } else if (me.input.isKeyPressed("left")) {
            this.flipX(true);
            this.body.vel.x -= this.body.accel.x / me.timer.tick;

        }
        else {
            this.body.vel.x = 0;
        }
        //sets the y position of mario by adding the velocity set above in setVelocity() times me.timer.tick
        //me.timer.tick makes the character move at a smooth pace even if updates are irregular  

        if (me.input.isKeyPressed("up")) {

            this.body.vel.y -= this.body.accel.y * me.timer.tick;
        }


        this.body.update(delta);
        //collision.check is a function that passes 4 parameters to determine and resolve mario walking into objects
        //the first parameter passes this object as one of the ones hit, the third parameter passes all the information to
        //a function named collideHandler
        me.collision.check(this, true, this.collideHandler.bind(this), true);

        if (!this.big) {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("smallWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("smallWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("idle");
            }
        } else {
            if (this.body.vel.x !== 0) {
                if (!this.renderable.isCurrentAnimation("bigWalk") && !this.renderable.isCurrentAnimation("grow") && !this.renderable.isCurrentAnimation("shrink")) {
                    this.renderable.setCurrentAnimation("bigWalk");
                    this.renderable.setAnimationFrame();
                }
            } else {
                this.renderable.setCurrentAnimation("bigIdle");
            }
        }

        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function(response) {
        var ydif = this.pos.y - response.b.pos.y;
        console.log(ydif);

        //This tells us where the badguy moves in what direction
        //This states how the badguy moves
        if (response.b.type === 'badguy') {
            if (ydif <= -115) {
                response.b.alive = false;
            } else {
                if (this.big) {
                    this.big = false;
                    this.body.vel.y -= this.body.accel.y * me.timer.tick;
                    this.jumping = true;
                    this.renderable.setCurrentAnimation("shrink", "idle");
                    this.renderable.setAnimationFrame();
                } else if (response.b.alive) {
                    me.state.change(me.state.MENU);
                }
            }
        } else if (response.b.type === 'mushroom') {
            this.renderable.setCurrentAnimation("grow", "bigIdle");
            this.big = true;
            me.game.world.removeChild(response.b);
        }

    }


});

//game.LevelTrigger makes sure you respawn in the right place after yoou die
game.LevelTrigger = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, settings]);
        this.body.onCollision = this.onCollision.bind(this);
        this.level = settings.level;
        this.xSpawn = settings.xSpawn;
        this.ySpawn = settings.ySpawn;
    },
    onCollision: function() {
        this.body.setCollisionMask(me.collision.types.NO_OBJECT);
        // me.levelDirector.loadLevel(this.level);
        console.log(this.level);
        me.levelDirector.loadLevel(this.level);
        me.state.current().resetPlayer(this.xSpawn, this.ySpawn);
    }

});

//game.BadGuy tells us if the dguy is working and killing the mario player
game.BadGuy = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "slime",
                spritewidth: "60",
                spiteheight: "28",
                width: 60,
                height: 28,
                getShape: function() {
                    return (new me.Rect(0, 0, 60, 28)).toPolygon();
                }
            }]);

        //Set up variables for the badguy movement

        this.spritewidth = 60;
        var width = settings.width;
        x = this.pos.x;
        this.startX = x;
        this.endX = x + width - this.spritewidth;
        this.pos.x = x + width - this.spritewidth;
        this.updateBounds();

        this.alwaysUpdate = true;

        this.walkLeft = false;

        //sets variables for bad guy interacting with Mario

        this.alive = true;
        this.type = "badguy";

        //this.renderable.addAnimation("run", [0, 1, 2], 80);
        //this.renderable.setCurrentAnimation("run");

        this.body.setVelocity(4, 6);
    },
    update: function(delta) {

        // updates character animation and checks collisions
        this.body.update(delta);
        me.collision.check(this, true, this.collideHandler.bind(this), true);


        if (this.alive) {
            if (this.walkLeft && this.pos.x <= this.startX) {
                this.walkLeft = false;
            } else if (!this.walkLeft && this.pos.x >= this.endX) {
                this.walkLeft = true;
            }
            this.flipX(!this.walkLeft);
            this.body.vel.x += (this.walkLeft) ? -this.body.accel.x * me.timer.tick : this.body.accel.x * me.timer.tick;

        } else {
            me.game.world.removeChild(this);
        }


        this._super(me.Entity, "update", [delta]);
        return true;
    },
    collideHandler: function() {

    }

});

//game.Mushrooom tells us to make sure the mushroom s running and helping the mario player grow
game.Mushroom = me.Entity.extend({
    init: function(x, y, settings) {
        this._super(me.Entity, 'init', [x, y, {
                image: "mushroom",
                spritewidth: "64",
                spiteheight: "64",
                width: 64,
                height: 64,
                getShape: function() {
                    return (new me.Rect(0, 0, 64, 64)).toPolygon();
                }
            }]);

        //me.collision.check makes sure you eat the mushroom
        me.collision.check(this);
        this.type = "mushroom";
    }

});