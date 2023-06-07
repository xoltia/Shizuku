import { useState } from "react";
import { FormControl, Input, Box, View } from "native-base";
import { useQuery } from "../database/RealmConfig";
import Activity from "../database/models/Activity";
import Table, { ITableProps } from "../components/Table";

function capitalize(str: string) {
    return str[0].toUpperCase() + str.slice(1);
}

function appendColumns(activity: Activity) {
    const start = new Date(activity.timeRange.getStartTime());
    const end = new Date(activity.timeRange.getEndTime());
    const totalSeconds = activity.timeRange.timespan;
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const readableSpan = `${hours}h ${minutes}m ${seconds}s`;

    const typeTitle = `${capitalize(activity.type)} - ${activity.title}`;
    const timeRangeInfo =  activity.timeRange.isDateOnly ? (
        `${activity.timeRange.timestamp.toLocaleDateString()}`
    ) : (
        `${start.toLocaleString()} - ${end.toLocaleString()}`
    ) + ` (${readableSpan})`;
    
    return {
        _id: activity._id,
        title: activity.title,
        type: activity.type,
        timeRange: {
            timestamp: activity.timeRange.timestamp,
            isDateOnly: activity.timeRange.isDateOnly,
            timespan: activity.timeRange.timespan,
        },
        'type and title': typeTitle,
        'time range': timeRangeInfo,
    };
}

export default function BrowseScreen() {
    const activites = useQuery(Activity);
    const [searchTerm, setSearchTerm] = useState('');
    const filteredActivities = activites
        .filtered('title CONTAINS[c] $0', searchTerm)
        .map(appendColumns);

    const tableProps: ITableProps<ReturnType<typeof appendColumns>> = {
        data: filteredActivities,
        selectedColumns: new Set(['type and title', 'time range']),
        possibleColumns: ['type and title', 'time range', 'title', 'type'],
        renderCell: (item, column, fallback) => {
            return fallback(item, column);
        },
    };

    return (
        <View>
            <FormControl mb={3} p={3}>
                <Input
                    placeholder="Search"
                    onChangeText={setSearchTerm}
                />
            </FormControl>
            <Box borderTopWidth={1} borderTopColor="gray.200">
                <Table {...tableProps} />
            </Box>
        </View>
    );
}