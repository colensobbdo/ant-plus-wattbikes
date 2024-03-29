/// <reference types="node" />
import events = require('events');
export declare enum Constants {
    MESSAGE_TX_SYNC = 164,
    DEFAULT_NETWORK_NUMBER = 0,
    MESSAGE_CHANNEL_UNASSIGN = 65,
    MESSAGE_CHANNEL_ASSIGN = 66,
    MESSAGE_CHANNEL_ID = 81,
    MESSAGE_CHANNEL_PERIOD = 67,
    MESSAGE_CHANNEL_SEARCH_TIMEOUT = 68,
    MESSAGE_CHANNEL_FREQUENCY = 69,
    MESSAGE_CHANNEL_TX_POWER = 96,
    MESSAGE_NETWORK_KEY = 70,
    MESSAGE_TX_POWER = 71,
    MESSAGE_PROXIMITY_SEARCH = 113,
    MESSAGE_ENABLE_RX_EXT = 102,
    MESSAGE_LIB_CONFIG = 110,
    MESSAGE_CHANNEL_OPEN_RX_SCAN = 91,
    MESSAGE_STARTUP = 111,
    MESSAGE_SYSTEM_RESET = 74,
    MESSAGE_CHANNEL_OPEN = 75,
    MESSAGE_CHANNEL_CLOSE = 76,
    MESSAGE_CHANNEL_REQUEST = 77,
    MESSAGE_CHANNEL_BROADCAST_DATA = 78,
    MESSAGE_CHANNEL_ACKNOWLEDGED_DATA = 79,
    MESSAGE_CHANNEL_BURST_DATA = 80,
    MESSAGE_CHANNEL_EVENT = 64,
    MESSAGE_CHANNEL_STATUS = 82,
    MESSAGE_VERSION = 62,
    MESSAGE_CAPABILITIES = 84,
    MESSAGE_SERIAL_NUMBER = 97,
    CHANNEL_TYPE_TWOWAY_RECEIVE = 0,
    CHANNEL_TYPE_TWOWAY_TRANSMIT = 16,
    CHANNEL_TYPE_SHARED_RECEIVE = 32,
    CHANNEL_TYPE_SHARED_TRANSMIT = 48,
    CHANNEL_TYPE_ONEWAY_RECEIVE = 64,
    CHANNEL_TYPE_ONEWAY_TRANSMIT = 80,
    RADIO_TX_POWER_MINUS20DB = 0,
    RADIO_TX_POWER_MINUS10DB = 1,
    RADIO_TX_POWER_0DB = 2,
    RADIO_TX_POWER_PLUS4DB = 3,
    RESPONSE_NO_ERROR = 0,
    EVENT_RX_SEARCH_TIMEOUT = 1,
    EVENT_RX_FAIL = 2,
    EVENT_TX = 3,
    EVENT_TRANSFER_RX_FAILED = 4,
    EVENT_TRANSFER_TX_COMPLETED = 5,
    EVENT_TRANSFER_TX_FAILED = 6,
    EVENT_CHANNEL_CLOSED = 7,
    EVENT_RX_FAIL_GO_TO_SEARCH = 8,
    EVENT_CHANNEL_COLLISION = 9,
    EVENT_TRANSFER_TX_START = 10,
    CHANNEL_IN_WRONG_STATE = 21,
    CHANNEL_NOT_OPENED = 22,
    CHANNEL_ID_NOT_SET = 24,
    CLOSE_ALL_CHANNELS = 25,
    TRANSFER_IN_PROGRESS = 31,
    TRANSFER_SEQUENCE_NUMBER_ERROR = 32,
    TRANSFER_IN_ERROR = 33,
    MESSAGE_SIZE_EXCEEDS_LIMIT = 39,
    INVALID_MESSAGE = 40,
    INVALID_NETWORK_NUMBER = 41,
    INVALID_LIST_ID = 48,
    INVALID_SCAN_TX_CHANNEL = 49,
    INVALID_PARAMETER_PROVIDED = 51,
    EVENT_QUEUE_OVERFLOW = 53,
    USB_STRING_WRITE_FAIL = 112,
    CHANNEL_STATE_UNASSIGNED = 0,
    CHANNEL_STATE_ASSIGNED = 1,
    CHANNEL_STATE_SEARCHING = 2,
    CHANNEL_STATE_TRACKING = 3,
    CAPABILITIES_NO_RECEIVE_CHANNELS = 1,
    CAPABILITIES_NO_TRANSMIT_CHANNELS = 2,
    CAPABILITIES_NO_RECEIVE_MESSAGES = 4,
    CAPABILITIES_NO_TRANSMIT_MESSAGES = 8,
    CAPABILITIES_NO_ACKNOWLEDGED_MESSAGES = 16,
    CAPABILITIES_NO_BURST_MESSAGES = 32,
    CAPABILITIES_NETWORK_ENABLED = 2,
    CAPABILITIES_SERIAL_NUMBER_ENABLED = 8,
    CAPABILITIES_PER_CHANNEL_TX_POWER_ENABLED = 16,
    CAPABILITIES_LOW_PRIORITY_SEARCH_ENABLED = 32,
    CAPABILITIES_SCRIPT_ENABLED = 64,
    CAPABILITIES_SEARCH_LIST_ENABLED = 128,
    CAPABILITIES_LED_ENABLED = 1,
    CAPABILITIES_EXT_MESSAGE_ENABLED = 2,
    CAPABILITIES_SCAN_MODE_ENABLED = 4,
    CAPABILITIES_PROX_SEARCH_ENABLED = 16,
    CAPABILITIES_EXT_ASSIGN_ENABLED = 32,
    CAPABILITIES_FS_ANTFS_ENABLED = 64,
    TIMEOUT_NEVER = 255,
}
export declare class Messages {
    static BUFFER_INDEX_MSG_LEN: number;
    static BUFFER_INDEX_MSG_TYPE: number;
    static BUFFER_INDEX_CHANNEL_NUM: number;
    static BUFFER_INDEX_MSG_DATA: number;
    static BUFFER_INDEX_EXT_MSG_BEGIN: number;
    static resetSystem(): Buffer;
    static requestMessage(channel: number, messageID: number): Buffer;
    static setNetworkKey(): Buffer;
    static assignChannel(channel: number, type?: string): Buffer;
    static setDevice(channel: number, deviceID: number, deviceType: number, transmissionType: number): Buffer;
    static searchChannel(channel: number, timeout: number): Buffer;
    static setPeriod(channel: number, period: number): Buffer;
    static setFrequency(channel: number, frequency: number): Buffer;
    static setRxExt(): Buffer;
    static libConfig(how: number): Buffer;
    static openRxScan(): Buffer;
    static openChannel(channel: number): Buffer;
    static closeChannel(channel: number): Buffer;
    static unassignChannel(channel: number): Buffer;
    static buildMessage(payload?: number[], msgID?: number): Buffer;
    static intToLEHexArray(int: number, numBytes?: number): number[];
    static decimalToHex(d: number, numDigits: number): string;
    static getChecksum(message: any[]): number;
}
export declare class USBDriver extends events.EventEmitter {
    private idVendor;
    private idProduct;
    private usb;
    private device;
    private iface;
    private inEp;
    private outEp;
    private leftover;
    private usedChannels;
    private attachedSensors;
    maxChannels: number;
    canScan: boolean;
    constructor(idVendor: number, idProduct: number, dbgLevel?: number);
    is_present(): boolean;
    open(): boolean;
    close(): void;
    reset(): void;
    isScanning(): boolean;
    attach(sensor: BaseSensor, forScan: boolean): boolean;
    detach(sensor: BaseSensor): boolean;
    detach_all(): void;
    write(data: Buffer): void;
    read(data: Buffer): void;
}
export declare class GarminStick2 extends USBDriver {
    constructor(dbgLevel?: number);
}
export declare class GarminStick3 extends USBDriver {
    constructor(dbgLevel?: number);
}
export interface IDecodeDataCallback {
    (data: Buffer): void;
}
export declare class BaseSensor extends events.EventEmitter {
    private stick;
    channel: number;
    deviceID: number;
    transmissionType: number;
    protected decodeDataCbk: IDecodeDataCallback;
    constructor(stick: USBDriver);
    protected scan(type: string, frequency: number): void;
    protected attach(channel: number, type: string, deviceID: number, deviceType: number, transmissionType: number, timeout: number, period: number, frequency: number): void;
    detach(): void;
    protected write(data: Buffer): void;
    private handleEventMessages(data);
}
export declare class AntPlusBaseSensor extends BaseSensor {
    protected scan(type: string): void;
    protected attach(channel: number, type: string, deviceID: number, deviceType: number, transmissionType: number, timeout: number, period: number): void;
}
export declare class AntPlusSensor extends AntPlusBaseSensor {
    protected scan(): void;
    protected attach(channel: number, type: string, deviceID: number, deviceType: number, transmissionType: number, timeout: number, period: number): void;
}
export declare class AntPlusScanner extends AntPlusBaseSensor {
    protected scan(type: string): void;
    protected attach(): void;
}
