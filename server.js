const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");


admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
});


const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/get", (req, res) => {
  res.json({ status: "FCM Server Running" });
});

// 🔔 Send Push Notification
app.post("/send", async (req, res) => {
  const { title, body, token, data } = req.body;

  if (!title || !body || !token) {
    return res.status(400).json({
      message: "title, body and token are required",
    });
  }

  const message = {
    token: token,
    notification: {
      title: title,
      body: body,
    },
    data: data || {},
    android: {
      priority: "high",
    },
  };

  try {
    const response = await admin.messaging().send(message);

    return res.status(200).json({
      message: "Notification sent successfully",
      response: response,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error sending notification",
      error: error.message,
    });
  }
});

// 🚀 Start Server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
