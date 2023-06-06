import { Box, Input, IInputProps, FlatList, Text, Divider, Pressable, Fab } from "native-base";
import { useState } from "react";
import { GestureResponderEvent } from "react-native";

export type SuggestionSorter<T extends ISuggestion> = (a: T, b: T) => number;

export interface ISuggestion {
    text: string
}

export interface ISuggestionProps<SuggestionData extends ISuggestion> {
    data: SuggestionData[],
    onSelect?: (d: ISuggestion) => void
}

function Suggestions<T extends ISuggestion>(props: ISuggestionProps<T> ) {
    return (
        <FlatList keyboardShouldPersistTaps="handled"
            data={props.data}
            renderItem={({ item }) => (
                <Pressable onPress={() => props.onSelect?.(item)}>
                    <Text p={3}>{item.text}</Text>
                    <Divider/>
                </Pressable>
            )}
        />
    );
}

export default function AutofillingInput<T extends ISuggestion>(props: ISuggestionProps<T> & IInputProps) {
    const [showSuggestions, setShowSuggestions] = useState(false)
    const [value, setValue] = useState(props.value);

    const handleChange = (text: string) => {
        if (!showSuggestions)
            setShowSuggestions(true)

        if (typeof props.data.find(s => s.text === text) !== 'undefined')
            setShowSuggestions(false);

        setValue(text);
        props.onChangeText?.(text);
    }

    return <>
        {/* Show suggestions should hide when clicked outside */}
        {/* <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0} background={"red.100"}
            onTouchStart={(e: GestureResponderEvent) => {
                if (e.nativeEvent.target === e.nativeEvent.target && showSuggestions)
                    setShowSuggestions(false);
            }}
        /> */}



        <Input {...props}
            value={value}
            onChangeText={handleChange}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setShowSuggestions(false)}
        />
        {(showSuggestions &&
            <Box position="absolute" top="100%" width="100%" zIndex={1} borderRadius={4}
                _dark={{ bg: "trueGray.700" }}
                _light={{ bg: "light.100" }}
            >
                <Suggestions
                    onSelect={({ text }) => handleChange(text)}
                    data={props.data}
                />
            </Box>
        )}
    </>
}
