import Realm from "realm";

export interface ITimeRange {
    timespan: number;
    timestamp: Date;
    isDateOnly: boolean;
}

export interface IActivity {
    _id?: Realm.BSON.ObjectId;
    type: string;
    title: string;
    timeRange: ITimeRange;
    tags: string[];
}

export class TimeRange
    extends Realm.Object<TimeRange, 'timespan' | 'timestamp'>
    implements ITimeRange
{
    // The number of *seconds* the activity lasted.
    timespan!: number;
    // The time the activity ended.
    timestamp!: Date;
    // If true, the activity is a date-only activity.
    isDateOnly: boolean = false;

    static schema = {
        name: 'TimeRange',
        embedded: true,
        properties: {
            timespan: 'int',
            timestamp: 'date',
            isDateOnly: {
                type: 'bool',
                default: false,
            },
        },
    };

    /**
     * Returns epoch number representation of activity start time.
     * The value returned is not meaningful if `isDateOnly` is true.
     */
    getStartTime(): number {
        return  this.timestamp.getTime() - this.timespan * 1000;
    }

    /**
     * Returns epoch number representation of activity end time (the time logged).
     * If `isDateOnly` is set to true it is easier to use the stored timestamp directly.
     */
    getEndTime(): number {
        return this.timestamp.getTime();
    }
}

export default class Activity
    extends Realm.Object<Activity, '_id' | 'title' | 'type' | 'timeRange'>
    implements IActivity
{
    _id!: Realm.BSON.ObjectId;
    type!: string;
    title!: string;
    timeRange!: TimeRange;
    tags: string[] = [];

    static schema = {
        name: 'Activity',
        primaryKey: '_id',
        properties: {
            _id: {
                type: 'objectId',
                default: () => new Realm.BSON.ObjectId(),
            },
            title: 'string',
            type: 'string',
            timeRange: 'TimeRange',
            tags: {
                type: 'set',
                objectType: 'string',
                default: [],
            }
        },
    };
}
