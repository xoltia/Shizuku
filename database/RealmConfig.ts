import Activity, { TimeRange } from './models/Activity';
import TimeUnit from './models/TimeUnit';
import { createRealmContext } from '@realm/react';

export const {
    RealmProvider,
    useObject,
    useQuery,
    useRealm
} = createRealmContext({
    schema: [Activity, TimeRange, TimeUnit],
    inMemory: true,
});