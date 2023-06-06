import Realm from "realm";

export default class TimeUnit extends Realm.Object<TimeUnit, 'name' | 'secondsPerUnit' | 'isFluid'> {
    name!: string;
    secondsPerUnit!: number;
    isFluid: boolean = false;

    static schema = {
        primaryKey: 'name',
        name: 'TimeUnit',
        properties: {
            name: 'string',
            secondsPerUnit: 'float',
            isFluid: {
                type: 'bool',
                default: false
            },
        }
    };

    convertToSeconds(valueInThisUnit: number): number {
        return valueInThisUnit * this.secondsPerUnit;
    }
}