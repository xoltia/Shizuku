import Activity, { TimeRange } from './models/Activity';
import TimeUnit from './models/TimeUnit';
import { createRealmContext } from '@realm/react';

export const RealmConfig = {
    schema: [Activity, TimeRange, TimeUnit],
    inMemory: false,
};

export const {
    RealmProvider,
    useObject,
    useQuery,
    useRealm
} = createRealmContext(RealmConfig);
