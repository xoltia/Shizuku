import { useState, useRef } from 'react';
import { Box, FormControl, Button, AlertDialog } from "native-base";
import { useRealm } from "../database/RealmConfig";
import Activity from "../database/models/Activity";

export default function DataSettings () {
    const realm = useRealm();
    const activities = realm.objects<Activity>('Activity');

    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const cancelRef = useRef(null);

    return <Box>
        <FormControl>
            <FormControl.Label>Import Data</FormControl.Label>
            <Button onPress={() => {}}>WIP</Button>
            <FormControl.HelperText>Import your data from a JSON file.</FormControl.HelperText>
        </FormControl>

        <FormControl>
            <FormControl.Label>Export Data</FormControl.Label>
            <Button onPress={() => {}}>WIP</Button>
            <FormControl.HelperText>Export your data as a JSON file.</FormControl.HelperText>
        </FormControl>

        <FormControl>
            <FormControl.Label>Delete Data</FormControl.Label>
            <Button colorScheme="error" onPress={() => setShowDeleteAlert(true)}>Delete</Button>
            <FormControl.HelperText>Warning: this will delete all your data.</FormControl.HelperText>
        </FormControl>
        
        <AlertDialog
            isOpen={showDeleteAlert}
            onClose={() => setShowDeleteAlert(false)}
            leastDestructiveRef={cancelRef}
        >
            <AlertDialog.Content>
                <AlertDialog.Header fontSize="lg" fontWeight="bold">
                    Delete Data
                </AlertDialog.Header>
                <AlertDialog.Body>
                    Are you sure? You can't undo this action afterwards.
                </AlertDialog.Body>
                <AlertDialog.Footer>
                    <Button variant="unstyled" onPress={() => setShowDeleteAlert(false)}>Cancel</Button>
                    <Button colorScheme="error" onPress={() => {
                        realm.write(() => {
                            realm.delete(activities);
                        });
                        setShowDeleteAlert(false);
                    }}>Delete</Button>
                </AlertDialog.Footer>
            </AlertDialog.Content>
        </AlertDialog>
    </Box>
}