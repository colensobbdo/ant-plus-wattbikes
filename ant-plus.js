var Ant = require('./lib/ant');
var HRS = require('./lib/heart-rate-sensors');
var SSD = require('./lib/stride-speed-distance-sensors');
var SC = require('./lib/speed-cadence-sensors');
var BP = require('./lib/bicycle-power-sensors');

module.exports = {
	GarminStick2: Ant.GarminStick2,
	GarminStick3: Ant.GarminStick3,
	HeartRateSensor: HRS.HeartRateSensor,
	HeartRateScanner: HRS.HeartRateScanner,
	StrideSpeedDistanceSensor: SSD.StrideSpeedDistanceSensor,
	StrideSpeedDistanceScanner: SSD.StrideSpeedDistanceScanner,
	SpeedCadenceSensor: SC.SpeedCadenceSensor,
	SpeedCadenceScanner: SC.SpeedCadenceScanner,
	BicyclePowerSensor: BP.BicyclePowerSensor,
	BicyclePowerScanner: BP.BicyclePowerScanner
};
