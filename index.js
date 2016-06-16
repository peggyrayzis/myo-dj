const Myo = require('myo');
const robot = require('robotjs');

// myo plugins to extend events
const flex = require('./flex.myo');
const snap = require('./snap.myo');
const hard_tap = require('./hardtap.myo');

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

// traktor key bindings
Myo.on('fist', function(){
	robot.keyTap("w");  
	console.log('Fist!');
	this.vibrate();
});

// this fn should never be called. if it is, something is wrong!
Myo.on('unlock', function(){
	console.log('I HAVE BEEN LOCKED')
});

Myo.on('wave_out', function(){
	robot.keyTap("s");  
	console.log('Wave out');
	this.vibrate();
});


Myo.on('snap', function(){
	console.log('snap');
	robot.keyTap("j"); 
	this.vibrate();
});

// Myo.on('hard_tap', function(){
// 	console.log('tap tap');
// 	this.vibrate();
// });

Myo.on('pose', function(pose_name){
    console.log(`Started ${pose_name}`);
});