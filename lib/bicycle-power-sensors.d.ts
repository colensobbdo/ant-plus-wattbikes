/// <reference types="node" />
import Ant = require('./ant');
export declare class BicyclePowerSensor extends Ant.AntPlusSensor {
    constructor(stick: any);
    static deviceType: number;
    attach(channel: any, deviceID: any): void;
    private state;
    decodeData(data: Buffer): void;
}
export declare class BicyclePowerScanner extends Ant.AntPlusScanner {
    constructor(stick: any);
    static deviceType: number;
    scan(): void;
    private states;
    decodeData(data: Buffer): void;
}
