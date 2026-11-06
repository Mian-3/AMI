// Master switch for file uploads in the admin (images, PDFs and videos).
//   false = the Upload buttons stay visible but greyed out. Clicking one only shows a message
//           ("switched off by the developer, please contact the developer"), and the upload routes
//           on the server refuse any upload.
//   true  = uploads work again exactly as before.
// To switch uploads back on later, change this one word to true and redeploy.
export const UPLOADS_ENABLED = false;

// Shown when someone clicks a greyed out Upload button.
export const UPLOADS_OFF_MESSAGE = "Uploading is temporarily switched off by the developer. Please contact the developer.";
