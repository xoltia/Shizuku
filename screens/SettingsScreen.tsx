import { View, Text, Divider } from "native-base";
import DataSettings from "../components/DataSettings";

interface ISectionProps {
    title: string;
    component: JSX.Element;
}

function Section(props: ISectionProps) {
    return <View>
        <Text fontSize="xl" fontWeight="bold">{props.title}</Text>
        <Divider my={2}/>
        {props.component}
    </View>
}

export default function SettingsScreen() {
    return <View p={3}>
        <Section title="Data" component={<DataSettings/>}/>
    </View>
}