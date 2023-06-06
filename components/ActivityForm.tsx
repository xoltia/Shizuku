import { FormControl, Input, Select, Button, HStack, Center, Icon, Switch, Text, Box, useTheme } from "native-base";
import { useState, useRef } from "react";
import AutofillingInput, { ISuggestion } from "./AutofillingInput";
import { DateTimePickerAndroid, DateTimePickerEvent, AndroidNativeProps } from "@react-native-community/datetimepicker";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useRealm, useQuery } from "../database/RealmConfig";
import Activity from "../database/models/Activity";

enum ActivityType {
    Reading = 'reading',
    Listening = 'listening',
    Writing = 'writing',
    Speaking = 'speaking',
}

export default function ActivityForm() {
    const realm = useRealm();
    const activites = useQuery(Activity);

    const [title, setTitle] = useState('');
    const [type, setType] = useState(ActivityType.Reading);
    const [finishTime, setFinishTime] = useState(new Date());
    const [isTimeSignificant, setIsTimeSignificant] = useState(true);

    const [showTimeHelp, setShowTimeHelp] = useState(false);
    const pendingSubmission = useRef(false);
    const timespan = useRef(0);

    const canSubmit = title.length > 0;

    const submit = () => {        
        const doc = {
            title,
            type,
            timeRange: {
                timespan: timespan.current,
                timestamp: finishTime,
                isDateOnly: !isTimeSignificant,
            },
        };

        realm.write(() => {
            try {
                realm.create('Activity', doc);
            }
            catch (e) {
                console.error(e);
                throw e;
            }
        });
    };

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        // if this is not the submission timestamp picker,
        // then update the finish time
        if (!pendingSubmission) {
            if (selectedDate) setFinishTime(selectedDate);
            return;
        }

        // otherwise, continue with the submission process
        pendingSubmission.current = false;

        if (event.type === 'dismissed' || !selectedDate)
            return;
        
        timespan.current = selectedDate.getHours() * 3600 +
            selectedDate.getMinutes() * 60;

        submit();
    };

    const showMode = (currentMode: 'date' | 'time') => {
        // whether or not this time picker is being used
        // for the final 'timestamp' field, rather than the
        // 'finishTime' field
        const isTimespan = pendingSubmission.current;
        
        const options: AndroidNativeProps = {
            onChange,
            mode: currentMode,
            is24Hour: true,

            value: isTimespan ? new Date(0, 0, 0, 0, 0, 0, 0) : finishTime,
            display: isTimespan ? 'spinner' : 'default'
        };

        DateTimePickerAndroid.open(options);
    };

    const showDatepicker = () => {
        showMode('date');
    };

    const showTimepicker = () => {
        showMode('time');
    };

    const submitActivity = () => {
        pendingSubmission.current = true;
        showTimepicker();
    };

    const data = activites
        .filtered('title CONTAINS[c] $0', title)
        .map(a => ({ text: a.title }))
        .filter((v, i, a) => a.findIndex(t => t.text === v.text) === i);

    const onTypeSelect = (selected: string) => setType(selected as ActivityType);

    return <>
        <FormControl isRequired isInvalid={false} zIndex={1}>
            <FormControl.Label>Title</FormControl.Label>
            <AutofillingInput py={2}
                value={title}
                onChangeText={setTitle}
                data={title ? data : []}
            />
            <FormControl.ErrorMessage>Something is wrong.</FormControl.ErrorMessage>
        </FormControl>

        <FormControl isRequired isInvalid={false} >
            <FormControl.Label>Type</FormControl.Label>
            <Select defaultValue={type} onValueChange={onTypeSelect}>
                <Select.Item label="Reading" value={ActivityType.Reading} />
                <Select.Item label="Listening" value={ActivityType.Listening} />
                <Select.Item label="Speaking" value={ActivityType.Speaking} />
                <Select.Item label="Writing" value={ActivityType.Writing} />
            </Select>
            <FormControl.ErrorMessage>Something is wrong.</FormControl.ErrorMessage>
        </FormControl>

        <FormControl>
            <FormControl.Label>Finish Time</FormControl.Label>
            <HStack space="3" alignItems="center">
                {isTimeSignificant &&
                    <Button
                        flexGrow={1}
                        onPress={showTimepicker}>
                            { finishTime.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}) }
                    </Button>}
                <Button flexGrow={1} onPress={showDatepicker}>{ finishTime.toLocaleDateString() }</Button>
                <Button flexGrow={1} onPress={() => setFinishTime(new Date())}>
                    <Icon as={Ionicons} name="refresh" color="white" size="md"/>
                </Button>
            </HStack>
            <HStack space={2} my={2} alignItems="center">
                <Text>Time Significant</Text>
                <Switch
                    isChecked={isTimeSignificant}
                    onToggle={() => setIsTimeSignificant(!isTimeSignificant)}
                />
                <Box
                    _dark={{ borderColor: "white" }}
                    _light={{ borderColor: useTheme().colors.primary[600]  }}
                    borderWidth={1}
                    rounded="full"
                    p={1}
                    ml="auto"
                    onTouchEnd={() => setShowTimeHelp(!showTimeHelp)}>
                    <Icon as={Ionicons} name="help"
                        _dark={{ color: "white" }}
                        _light={{ color: useTheme().colors.primary[600] }}
                    />
                </Box>
                
            </HStack>
            {showTimeHelp &&
                <FormControl.HelperText mt={0} mb={2}>
                    The end time will be determined based on the current time if not set manually.
                    Unchecking "time significant" means that the time of the activity is unknown and 
                    should not be logged.
                </FormControl.HelperText>
            }
        </FormControl>

        <Button onPress={submitActivity} isDisabled={!canSubmit}>Submit</Button>
    </>;
}
