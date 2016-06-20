// dependencies
const Myo = require('myo');
const robot = require('robotjs');

// myo plugins to extend events
const flex = require('./flex.myo');
const snap = require('./snap.myo');
const hard_tap = require('./hardtap.myo');
const vector = require('./vector.myo');
const arm_busy = require('./busyarm.myo')

// state vars
var fistOn;
var fingersSpreadOn;
var wavingLeft;
var wavingRight;
var lastRun;
var currentRun;

// connect to Myo Connect control center
Myo.connect('com.myodj.app');

// ensure Myo is connected
Myo.on('connected', function(data, timestamp) {
	console.log("Myo successfully connected. Data: " + JSON.stringify(data) + ". Timestamp: " + timestamp + ".");
	Myo.setLockingPolicy('none')
});

Myo.onError = function () {  
	console.log('Could not connect.');
};

// this fn should never be called. if it is, something is wrong!
Myo.on('unlock', function(){
	console.log('I HAVE BEEN LOCKED')
});

// traktor key bindings
Myo.on('wave_in', function(){
	wavingRight = true;
	robot.keyTap("w");  
	console.log('Play Deck A');
	this.vibrate('short');
});

Myo.on('wave_in_off', function(){
	wavingRight = false;
})

Myo.on('wave_out', function(){
	wavingLeft = true;
	robot.keyTap("s");  
	console.log('Play Deck B');
	this.vibrate('short');
});

Myo.on('wave_out_off', function(){
	wavingLeft = false;
})


Myo.on('fist', function(){
	this.zeroOrientation()
	this.vibrate('short');
	fistOn = true;
	lastRun = new Date()
	console.log('Filter on Deck B.');
});

Myo.on('fist_off', function(){ 
	stepsDeckB = 0;
	robot.keyTap("b");
	fistOn = false;
	console.log('Filter off Deck B.');
});

Myo.on('fingers_spread', function(){
	this.zeroOrientation()
	this.vibrate('short');
	fingersSpreadOn = true;
	lastRun = new Date()
	console.log('Filter on Deck A.');
});

Myo.on('fingers_spread_off', function(){ 
	stepsDeckA = 0;
	robot.keyTap("v");
	fingersSpreadOn = false;
	console.log('Filter off Deck A.');
});

var stepsDeckB = 0;
var stepsDeckA = 0;
Myo.on('vector', function(vector){
	currentRun = new Date()
	if(currentRun - lastRun > 100){
		if(fistOn){
			var stepLevelB = Math.floor(vector.theta * 100 / 12.5)
			var stepsToTakeB = stepLevelB - stepsDeckB;
			if(stepsToTakeB > 0) {
				for(var i=0; i < stepsToTakeB; i++) {
					robot.keyTap("n");
				}
				stepsDeckB = stepLevelB;
			} else {
				for(var i=0; i < Math.abs(stepsToTakeB); i++) {
					robot.keyTap("m");
				}
				stepsDeckB = stepLevelB;
			}
		}
		if(fingersSpreadOn){
			var stepLevelA = Math.floor(vector.theta * 100 / 12.5)
			var stepsToTakeA = stepLevelA - stepsDeckA;
			if(stepsToTakeA > 0) {
				for(var j=0; j < stepsToTakeA; j++) {
					robot.keyTap("x");
				}
				stepsDeckA = stepLevelA;
			} else {
				for(var j=0; j < Math.abs(stepsToTakeA); j++) {
					robot.keyTap("c");
				}
				stepsDeckA = stepLevelA;
			}
		}
	}
})

Myo.on('snap', function(){
	if(!fistOn && !fingersSpreadOn && !wavingLeft && !wavingRight){
		robot.keyTap("t"); 
		console.log('Effect button 2');
		this.vibrate('short');
	}
});

Myo.on('hard_tap', function(){
	if(!fistOn && !fingersSpreadOn && !wavingLeft && !wavingRight){
		robot.keyTap("z");
		console.log('Effect button 3'); 
	}
});