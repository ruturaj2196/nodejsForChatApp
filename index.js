
import {initializeApp, applicationDefault} from 'firebase-admin/app';
import {getFirestore, getMessaging} from 'firebase-admin/messaging';
import express, {json} from 'express';

process.env.GOOGLE_APPLICATION_CREDENTIAL;

const app = express();
app.use(express.json());



app.use(function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  next();
});

initializeApp({
  credential: applicationDefault(),
  projectId: 'your-project-id',
});

app.post('/send', async (req, res) => {
  const {title, body, token} = req.body;

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await getFirestore().send(message);
    res.status(200).send(`Notification sent successfully: ${response}`);
  } catch (error) {
    res.status(500).send(`Error sending notification: ${error}`);
  }

  getMessaging().send(message).then((response) => {
  res.status(200).json({
    message: 'Notification sent successfully', 
    response: response,
    token: token,
  });
  console.log('Notification sent successfully:', response);
  }).catch((error) => {
    res.status(400);
    res.send(error);
    console.error('Error sending notification:', error);
  });

});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 