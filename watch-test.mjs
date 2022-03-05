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

// import { watchFile } from 'fs';
//
// watchFile('test.js', (curr, prev) => {
//     console.log(`the current mtime is: ${curr.mtime}`);
//     console.log(`the previous mtime was: ${prev.mtime}`);
//     console.log('END method watchFile() --------------------------');
// });
