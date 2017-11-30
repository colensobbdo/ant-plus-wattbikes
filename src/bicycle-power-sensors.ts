import Ant = require('./ant');

const Constants = Ant.Constants;
const Messages = Ant.Messages;

class BicyclePowerSensorState {
	constructor(deviceID: number) {
		this.DeviceID = deviceID;
	}

	DeviceID: number;
	PedalPower: number;
	Cadence: number;
	AccumulatedPower: number;
	Power: number;
}

class BicyclePowerScanState extends BicyclePowerSensorState {
	Rssi: number;
	Threshold: number;
}

export class BicyclePowerSensor extends Ant.AntPlusSensor {
	constructor(stick) {
		super(stick);
		this.decodeDataCbk = this.decodeData.bind(this);
	}

	static deviceType = 0x0B;

	public attach(channel, deviceID): void {
		super.attach(channel, 'receive', deviceID, BicyclePowerSensor.deviceType, 0, 255, 8182);
		this.state = new BicyclePowerSensorState(deviceID);
	}

	private state: BicyclePowerSensorState;

	decodeData(data: Buffer) {
		if (data.readUInt8(Messages.BUFFER_INDEX_CHANNEL_NUM) !== this.channel) {
			return;
		}

		switch (data.readUInt8(Messages.BUFFER_INDEX_MSG_TYPE)) {
			case Constants.MESSAGE_CHANNEL_BROADCAST_DATA:
			case Constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
			case Constants.MESSAGE_CHANNEL_BURST_DATA:
				if (this.deviceID === 0) {
					this.write(Messages.requestMessage(this.channel, Constants.MESSAGE_CHANNEL_ID));
				}

				const page = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA);
				if (page === 0x10) {
					this.state.PedalPower = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 2);
					this.state.Cadence = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
					this.state.AccumulatedPower = data.readUInt16LE(Messages.BUFFER_INDEX_MSG_DATA + 4);
					this.state.Power = data.readUInt16LE(Messages.BUFFER_INDEX_MSG_DATA + 6);
				}
				this.emit('powerData', this.state);
				break;

			case Constants.MESSAGE_CHANNEL_ID:
				this.deviceID = data.readUInt16LE(Messages.BUFFER_INDEX_MSG_DATA);
				this.transmissionType = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
				this.state.DeviceID = this.deviceID;
				break;
			default:
				break;
		}
	}

}

export class BicyclePowerScanner extends Ant.AntPlusScanner {
	constructor(stick) {
		super(stick);
		this.decodeDataCbk = this.decodeData.bind(this);
	}

	static deviceType = 0x0B;

	public scan() {
		super.scan('receive');
	}

	private states: { [id: number]: BicyclePowerScanState } = {};

	decodeData(data: Buffer) {
		if (data.length <= Messages.BUFFER_INDEX_EXT_MSG_BEGIN || !(data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN) & 0x80)) {
			console.log('wrong message format');
			return;
		}

		const deviceId = data.readUInt16LE(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 1);
		const deviceType = data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 3);

		if (deviceType !== BicyclePowerScanner.deviceType) {
			return;
		}

		if (!this.states[deviceId]) {
			this.states[deviceId] = new BicyclePowerScanState(deviceId);
		}

		if (data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN) & 0x40) {
			if (data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 5) === 0x20) {
				this.states[deviceId].Rssi = data.readInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 6);
				this.states[deviceId].Threshold = data.readInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 7);
			}
		}

		switch (data.readUInt8(Messages.BUFFER_INDEX_MSG_TYPE)) {
			case Constants.MESSAGE_CHANNEL_BROADCAST_DATA:
			case Constants.MESSAGE_CHANNEL_ACKNOWLEDGED_DATA:
			case Constants.MESSAGE_CHANNEL_BURST_DATA:
				const page = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA);
				if (page === 0x10) {
					this.states[deviceId].PedalPower = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 2);
					this.states[deviceId].Cadence = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
					this.states[deviceId].AccumulatedPower = data.readUInt16LE(Messages.BUFFER_INDEX_MSG_DATA + 4);
					this.states[deviceId].Power = data.readUInt16LE(Messages.BUFFER_INDEX_MSG_DATA + 6);
					break;
				}
				this.emit('powerData', this.states[deviceId]);
				break;
			default:
				break;
		}
	}
}
