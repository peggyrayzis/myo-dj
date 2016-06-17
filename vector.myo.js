
(function(){
	Myo.plugins = Myo.plugins || {};

	Myo.plugins.vector = true;

	var Angles = {
		roll : function(q){
			return Math.atan2(2.0*(q.y*q.z + q.w*q.x), q.w*q.w - q.x*q.x - q.y*q.y + q.z*q.z);
		},
		pitch : function(q){
			return Math.asin(-2.0*(q.x*q.z - q.w*q.y));
		},
		yaw : function(q){
			return Math.atan2(2.0*(q.x*q.y + q.w*q.z), q.w*q.w + q.x*q.x - q.y*q.y - q.z*q.z);
		}
	};

	Myo.on('orientation', function(quanternion){
		var horizontalComponent = Math.sin(Angles.yaw(quanternion)) * Math.cos(Angles.pitch(quanternion));
		var verticalComponent   = Math.sin(Angles.pitch(quanternion));

		var rawTheta = Angles.roll(this.orientationOffset)
		this.trigger('vector', {
			x     : Math.sin(rawTheta) * verticalComponent - Math.cos(rawTheta) * horizontalComponent,
			y     : Math.cos(rawTheta) * verticalComponent + Math.sin(rawTheta) * horizontalComponent,
			theta : Math.sin(Angles.roll(quanternion))
		});
	});
}());