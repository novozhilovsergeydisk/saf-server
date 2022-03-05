import { watch } from 'fs';
watch('./', (eventType, filename) => {
    console.log(`event type is: ${eventType}`);
    if (filename) {
        console.log(`filename provided: ${filename}`);
    } else {
        console.log('filename not provided');
    }

    console.log('END method watch() --------------------------');
});