define(function() {
    'use strict';
    function CountDown(options) {
        this.timer = null;
        this.opts = CountDown.DEFAULT_OPTIONS;
        for (var key in options) {
            this.opts[key] = options[key];
        }
        this.runningTask = [];
        this.endTask = [];
        this.beginTime = new Date().valueOf();
        this.endTime = this.opts.endTime || (this.beginTime + (this.opts.offset || 0));
        this.start();
    }

    CountDown.DEFAULT_OPTIONS = {
        endTime: false,
        offset: false,
        delay: 200,
        dayUnit: false
    };

    CountDown.prototype.start = function() {
        var self = this;
        this.timer = setInterval(function() {
            self._running();
        }, this.opts.delay);
    };

    CountDown.prototype.stop = function() {
        clearInterval(this.timer);
        this.timer = null;
    };

    CountDown.prototype._end = function() {
        for (var i = 0; i < this.endTask.length; i++) {
            this.endTask[i]();
        }
        this.stop();
    };

    CountDown.prototype._calcOffsetTime = function(time) {
        var seconds = parseInt(time / 1e3) % 60,
            minutes = parseInt(time / 6e4) % 60,
            hours = parseInt(time / 36e5),
            days = parseInt(time / 864e5);
        if(this.opts.dayUnit){
            hours = hours % 24;
        }
        return {
            s: seconds,
            m: minutes,
            h: hours,
            d: days
        };
    };

    CountDown.prototype._running = function() {
        var now = new Date().valueOf();
        if (now > this.endTime) {
            return this._end();
        }
        var offsetTime = this._calcOffsetTime(this.endTime - now + 999);
        for (var i = 0; i < this.runningTask.length; i++) {
            this.runningTask[i](offsetTime.h, offsetTime.m, offsetTime.s, offsetTime.d);
        }
    };

    CountDown.prototype.on = function(eventName, callback) {
        switch (eventName) {
            case 'running':
                this.runningTask.push(callback);
                break;
            case 'end':
                this.endTask.push(callback);
                break;
            default:
        }
        return this;
    };

    return {
        CountDown: CountDown
    }
});