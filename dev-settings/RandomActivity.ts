import { ITimeRange, IActivity, TimeRange } from '../database/models/Activity';

const NUM_DAYS = 30;
const MAX_ACTIVITY_DURATION = 60 * 60 * 2;
const MAX_ACTIVITY_PER_DAY = 5;
const RANDOM_ACTIVITIES = {
    'やはり俺の青春ラブコメはまちがっている。': 'reading',
    'ハイキュー!!': 'reading',
    'かぐや様は告らせたい': 'reading',
    'ワンパンマン': 'reading',
    '推しの子': 'listening',
    'ホリミヤ': 'listening',
    'ぼっち・ざ・ろっく！': 'listening',
    'Meeting': 'speaking',
    'Journal': 'writing',
}

type RandomActivity = typeof RANDOM_ACTIVITIES[keyof typeof RANDOM_ACTIVITIES];

const RANDOM_ACTIVITIES_NAMES =
    Object.keys(RANDOM_ACTIVITIES) as (keyof typeof RANDOM_ACTIVITIES)[];

export function randomActivity(day: Date): IActivity {
    const activityIndex = Math.floor(Math.random() * RANDOM_ACTIVITIES_NAMES.length);
    const activity = RANDOM_ACTIVITIES_NAMES[activityIndex];
    const type = RANDOM_ACTIVITIES[activity];
    const timeRange: ITimeRange = {
        timespan: Math.floor(Math.random() * MAX_ACTIVITY_DURATION),
        timestamp: new Date(day.getTime() + Math.floor(Math.random() * 24 * 60 * 60 * 1000)),
        isDateOnly: false,
    };

    return {
        title: activity as string,
        type,
        timeRange,
        tags: [],
    };
}

export function randomDayOfActivity(day: Date): IActivity[] {
    const activities: IActivity[] = [];
    const numActivities = Math.floor(Math.random() * MAX_ACTIVITY_PER_DAY);
    for (let i = 0; i < numActivities; i++) {
        const activity = randomActivity(day);
        activities.push(activity);
    }
    return activities;
}

export function randomBlockOfActivity(
    final?: Date,
    nDays: number = NUM_DAYS
): IActivity[] {
    const finalDate = final || new Date();
    const activities: IActivity[] = [];
    const startDay = new Date();
    startDay.setDate(startDay.getDate() - NUM_DAYS);
    startDay.setHours(0, 0, 0, 0);
    while (startDay <= finalDate) {
        const dayActivities = randomDayOfActivity(startDay);
        activities.push(...dayActivities);
        startDay.setDate(startDay.getDate() + 1);
    }
    return activities;
}