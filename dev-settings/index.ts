import { DevSettings } from 'react-native';
import Realm from 'realm';
import { RealmConfig } from '../database/RealmConfig';
import { randomBlockOfActivity } from './RandomActivity';

DevSettings.addMenuItem('Random Activities (Destructive)', () => {
    Realm.open(RealmConfig).then(realm => {
        realm.write(() => {
            realm.deleteAll();
            const activities = randomBlockOfActivity();
            activities.forEach(activity => {
                realm.create('Activity', activity);
            });
        });
    });
});