/// <reference types="node" />
import Ant = require('./ant');
export declare class HeartRateSensor extends Ant.AntPlusSensor {
    constructor(stick: any);
    static deviceType: number;
    attach(channel: any, deviceID: any): void;
    private state;
    private oldPage;
    private pageState;
    private static TOGGLE_MASK;
    decodeData(data: Buffer): void;
    private DecodeDefaultHRM(pucPayload);
}
export declare class HeartRateScanner extends Ant.AntPlusScanner {
    constructor(stick: any);
    static deviceType: number;
    scan(): void;
    private states;
    private oldPage;
    private pageState;
    private static TOGGLE_MASK;
    decodeData(data: Buffer): void;
    private DecodeDefaultHRM(deviceId, pucPayload);
}
