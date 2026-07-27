const { Storage } = require('@google-cloud/storage');

async function main() {
  const bucketsToTry = [
    'smart-assign-pro.appspot.com',
    'smart-assign-pro.firebasestorage.app'
  ];

  const keysToTry = [
    'C:/Users/gaikw/Downloads/smart-assign-pro-firebase-adminsdk-fbsvc-99ba75ca7b.json',
    'C:/Users/gaikw/Downloads/smartassign-pro-firebase-adminsdk-fbsvc-853938eb92.json'
  ];

  for (const key of keysToTry) {
    console.log(`\nUsing key: ${key}`);
    const storage = new Storage({
      projectId: 'smart-assign-pro',
      keyFilename: key
    });

    for (const bucketName of bucketsToTry) {
      console.log(`Trying bucket: ${bucketName}...`);
      try {
        const bucket = storage.bucket(bucketName);
        await bucket.setCorsConfiguration([
          {
            origin: ['*'],
            method: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD', 'OPTIONS'],
            maxAgeSeconds: 3600,
            responseHeader: ['*']
          }
        ]);
        console.log(`SUCCESS! CORS configured successfully for ${bucketName}`);
        return; // Exit script on first success
      } catch (error) {
        console.log(`Failed for ${bucketName}: ${error.message}`);
      }
    }
  }
}

main();
