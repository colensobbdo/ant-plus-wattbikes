/// <reference types="node" />
import Ant = require('./ant');
export declare class SpeedCadenceSensor extends Ant.AntPlusSensor {
    channel: number;
    static deviceType: number;
    private state;
    wheelCircumference: number;
    setWheelCircumference(wheelCircumference: number): void;
    constructor(stick: any);
    attach(channel: any, deviceID: any): void;
    decodeData(data: Buffer): void;
}
export declare class SpeedCadenceScanner extends Ant.AntPlusScanner {
    static deviceType: number;
    wheelCircumference: number;
    private states;
    constructor(stick: any);
    setWheelCircumference(wheelCircumference: number): void;
    scan(): void;
    decodeData(data: Buffer): void;
}
