import { HStack, VStack, useTheme, Divider, Box, Text, Center, Icon, Select } from "native-base";
import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from "react";

type ColumnName<T> = keyof T & string;

export type DefaultCellRenderer<T> = (item: T, column: ColumnName<T>) => JSX.Element;
export type CellRenderer<T> = (item: T, column: ColumnName<T>, fallback: DefaultCellRenderer<T>) => JSX.Element;

export interface ITableProps<T> {
    data: T[];
    numColumns?: number;
    selectedColumns?: Set<ColumnName<T>>;
    possibleColumns: ReadonlyArray<ColumnName<T>>;
    columnTitleFormatter?: (column: ColumnName<T>) => string;
    renderCell?: CellRenderer<T>;
}

export default function Table<T>(props: ITableProps<T>) {
    const theme = useTheme();

    const {
        data,
        possibleColumns,
        renderCell
    } = props;

    const numColumns = props.numColumns ?? Math.min(2, possibleColumns.length);
    const [selectedColumns, setSelectedColumns] = useState(props.selectedColumns ?? new Set(possibleColumns.slice(0, numColumns)));
    const cellWidth = 100 / selectedColumns.size;

    const renderCellDefault = (item: T, column: ColumnName<T>) => {
        return <Text>{String(item[column])}</Text>;
    }

    const renderCellFn = renderCell ?? renderCellDefault;
    const titleFormatter = props.columnTitleFormatter ?? ((column: ColumnName<T>) => {
        let title = column.toString();
        return title[0].toUpperCase() + title.slice(1);
    });

    return (
        <VStack divider={<Divider />}>
            <HStack divider={<Divider />}>
                {Array.from(selectedColumns.values(), ((column, i) => (
                    <Box key={i} width={`${cellWidth}%`}>
                        <Select key={i} selectedValue={column} onValueChange={(value) => {
                            selectedColumns.delete(column);
                            selectedColumns.add(value as ColumnName<T>);
                            setSelectedColumns(new Set(selectedColumns));
                        }}>
                            {possibleColumns.map((column, j) => {
                                return (
                                    <Select.Item
                                        key={j}
                                        label={titleFormatter(column)}
                                        value={column} disabled={selectedColumns.has(column)}
                                    />
                                );
                            })}
                        </Select>
                    </Box>
                )))}
            </HStack>
            <Divider />
            {data.map((item, i) => (
                <HStack key={i} divider={<Divider />}>
                    {/* {selectedColumns.map((column, j) => (
                        <Box key={j} width={`${cellWidth}%`} p={2}>
                            {renderCellFn(item, column, renderCellDefault)}
                        </Box>
                    ))} */}

                    {Array.from(selectedColumns.values(), ((column, j) => (
                        <Box key={j} width={`${cellWidth}%`} p={1}>
                            {renderCellFn(item, column, renderCellDefault)}
                        </Box>
                    )))}
                </HStack>
            ))}

            {data.length === 0 && (
                <Center p={6}>
                    <Icon as={Ionicons}
                        name="sad-outline"
                        size={theme.fontSizes['md']}
                    />
                    <Text mt={2} fontSize="md">You haven't added any activities yet.</Text>
                    <Text fontSize="md">Tap the + button to add one.</Text>
                </Center>
            )}
        </VStack>
    );
}
