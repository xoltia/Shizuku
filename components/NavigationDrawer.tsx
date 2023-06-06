import { DrawerContentComponentProps, createDrawerNavigator } from "@react-navigation/drawer";
import { useNavigation } from "@react-navigation/native";
import { Box, Pressable, Divider, HStack, Switch, Text, VStack, useColorMode, useTheme } from "native-base";
import React from "react";

const Drawer = createDrawerNavigator();

type Component<T> = (prop: T) => JSX.Element;

export interface Route {
    name: string,
    component: any
}

export interface DrawerProps {
    routes: Route[]
}

function ToggleDarkMode() {
    const { colorMode, toggleColorMode } = useColorMode();
    return (
      <HStack space={2} alignItems="center">
        <Text>Dark</Text>
        <Switch
          isChecked={colorMode === "light"}
          onToggle={toggleColorMode}
          aria-label={
            colorMode === "light" ? "switch to dark mode" : "switch to light mode"
          }
        />
        <Text>Light</Text>
      </HStack>
    );
}

function DrawerContent(props: DrawerContentComponentProps) {
    return <Box>
        <VStack divider={<Divider />}>
            {
                props.state.routeNames.map((name, index) => {
                    return (
                        <Pressable
                            key={name}
                            px="5"
                            py="3"
                            rounded="md"
                            bg={
                                index === props.state.index
                                    ? "rgba(6, 182, 212, 0.1)"
                                    : "transparent"
                            }
                            onPress={()=>{
                                props.navigation.navigate(name);
                            }}
                        >
                            <Text fontWeight="500">{name}</Text>
                        </Pressable>
                    )
                })
            }
        </VStack>
        
        <Box px={5}>
            <ToggleDarkMode/>
        </Box>
    </Box>;
}


function ThemedScreen<PropsType>(component: Component<PropsType>): Component<PropsType> {
    return function(props) {
        return <Box
            minHeight="100%" 
            _dark={{ bg: "trueGray.900" }}
            _light={{ bg: "blueGray.200" }}
        >
            {component(props)}
        </Box>
    }
}

export default function NavigationDrawer(props: DrawerProps) {
    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <Box safeArea flex={1}>
            <Drawer.Navigator
                drawerContent={ThemedScreen(DrawerContent)}
            >
                {
                    props.routes.map(r => 
                        (<Drawer.Screen
                            key={r.name}
                            name={r.name}
                            component={ThemedScreen(r.component)} 
                            options={{
                                headerStyle: {
                                    backgroundColor: colorMode === 'dark' ?
                                        theme.colors.trueGray[800] :
                                        theme.colors.primary[600],
                                },
                                headerTintColor: theme.colors.white
                            }}
                        />)
                    )
                }
            </Drawer.Navigator>
        </Box>
    );
}
