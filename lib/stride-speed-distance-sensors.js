"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Ant = require("./ant");
var Constants = Ant.Constants;
var Messages = Ant.Messages;
var StrideSpeedDistanceSensorState = /** @class */ (function () {
    function StrideSpeedDistanceSensorState(deviceId) {
        this.DeviceID = deviceId;
    }
    return StrideSpeedDistanceSensorState;
}());
var StrideSpeedDistanceScanState = /** @class */ (function (_super) {
    __extends(StrideSpeedDistanceScanState, _super);
    function StrideSpeedDistanceScanState() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return StrideSpeedDistanceScanState;
}(StrideSpeedDistanceSensorState));
var PageState;
(function (PageState) {
    PageState[PageState["INIT_PAGE"] = 0] = "INIT_PAGE";
    PageState[PageState["STD_PAGE"] = 1] = "STD_PAGE";
    PageState[PageState["EXT_PAGE"] = 2] = "EXT_PAGE";
})(PageState || (PageState = {}));
var StrideSpeedDistanceSensor = /** @class */ (function (_super) {
    __extends(StrideSpeedDistanceSensor, _super);
    function StrideSpeedDistanceSensor(stick) {
        var _this = _super.call(this, stick) || this;
        _this.decodeDataCbk = _this.decodeData.bind(_this);
        return _this;
    }
    StrideSpeedDistanceSensor.prototype.attach = function (channel, deviceID) {
        _super.prototype.attach.call(this, channel, 'receive', deviceID, StrideSpeedDistanceSensor.deviceType, 0, 255, 8134);
        this.state = new StrideSpeedDistanceSensorState(deviceID);
    };
    StrideSpeedDistanceSensor.prototype.decodeData = function (data) {
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
                var page = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA);
                if (page === 1) {
                    this.state.TimeFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 1);
                    this.state.TimeInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 2);
                    this.state.DistanceInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
                    this.state.DistanceFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) >>> 4;
                    this.state.SpeedInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) & 0x0F;
                    this.state.SpeedFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 5);
                    this.state.StrideCount = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 6);
                    this.state.UpdateLatency = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 7);
                }
                else if (page >= 2 && page <= 15) {
                    this.state.CadenceInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
                    this.state.CadenceFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) >>> 4;
                    this.state.SpeedInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) & 0x0F;
                    this.state.SpeedFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 5);
                    this.state.Status = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 7);
                    switch (page) {
                        case 3:
                            this.state.Calories = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 6);
                            break;
                        default:
                            break;
                    }
                }
                this.emit('ssddata', this.state);
                break;
            case Constants.MESSAGE_CHANNEL_ID:
                this.deviceID = data.readUInt16LE(Messages.BUFFER_INDEX_MSG_DATA);
                this.transmissionType = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
                this.state.DeviceID = this.deviceID;
                break;
            default:
                break;
        }
    };
    StrideSpeedDistanceSensor.deviceType = 124;
    return StrideSpeedDistanceSensor;
}(Ant.AntPlusSensor));
exports.StrideSpeedDistanceSensor = StrideSpeedDistanceSensor;
var StrideSpeedDistanceScanner = /** @class */ (function (_super) {
    __extends(StrideSpeedDistanceScanner, _super);
    function StrideSpeedDistanceScanner(stick) {
        var _this = _super.call(this, stick) || this;
        _this.states = {};
        _this.decodeDataCbk = _this.decodeData.bind(_this);
        return _this;
    }
    StrideSpeedDistanceScanner.prototype.scan = function () {
        _super.prototype.scan.call(this, 'receive');
    };
    StrideSpeedDistanceScanner.prototype.decodeData = function (data) {
        if (data.length <= (Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 3) || !(data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN) & 0x80)) {
            console.log('wrong message format');
            return;
        }
        var deviceId = data.readUInt16LE(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 1);
        var deviceType = data.readUInt8(Messages.BUFFER_INDEX_EXT_MSG_BEGIN + 3);
        if (deviceType !== StrideSpeedDistanceScanner.deviceType) {
            return;
        }
        if (!this.states[deviceId]) {
            this.states[deviceId] = new StrideSpeedDistanceScanState(deviceId);
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
                var page = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA);
                if (page === 1) {
                    this.states[deviceId].TimeFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 1);
                    this.states[deviceId].TimeInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 2);
                    this.states[deviceId].DistanceInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
                    this.states[deviceId].DistanceFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) >>> 4;
                    this.states[deviceId].SpeedInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) & 0x0F;
                    this.states[deviceId].SpeedFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 5);
                    this.states[deviceId].StrideCount = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 6);
                    this.states[deviceId].UpdateLatency = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 7);
                }
                else if (page >= 2 && page <= 15) {
                    this.states[deviceId].CadenceInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 3);
                    this.states[deviceId].CadenceFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) >>> 4;
                    this.states[deviceId].SpeedInteger = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 4) & 0x0F;
                    this.states[deviceId].SpeedFractional = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 5);
                    this.states[deviceId].Status = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 7);
                    switch (page) {
                        case 3:
                            this.states[deviceId].Calories = data.readUInt8(Messages.BUFFER_INDEX_MSG_DATA + 6);
                            break;
                        default:
                            break;
                    }
                }
                this.emit('ssddata', this.states[deviceId]);
                break;
            default:
                break;
        }
    };
    StrideSpeedDistanceScanner.deviceType = 124;
    return StrideSpeedDistanceScanner;
}(Ant.AntPlusScanner));
exports.StrideSpeedDistanceScanner = StrideSpeedDistanceScanner;
//# sourceMappingURL=stride-speed-distance-sensors.js.map