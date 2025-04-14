const express = require("express");
const path = require("path");

const port = 7000;
const cors = require("cors");
const nodemailer = require("nodemailer");
const parseTemplate = require("./main");
const { json } = require("stream/consumers");

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.status(201).json({
    success: true,
    message: "server is start to use",
  });
});

app.post("/send", async (req, res) => {
  const { name, email, subject, text } = req.body;

  if (!name || !email || !subject || !text) {
    res.status(401).json({
      message: "something is missing",
      success: false,
    });
  } else {
    const user = {
      email: req.body.email,
      date: new Date(Date.now()).toLocaleString(),
    };

    // console.log(user.email, name);

    const emailTemplate = await parseTemplate(
      path.join(__dirname, "./index.html"),
      {
        name: name,
        email: email,
        subject: subject,
        text: text,
        visitedate: user.date,
      }
    );

    const transporter = await nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: "stylesphere108@gmail.com",
        pass: "********",
      },
    });

    // eyay qzpg cage fvtc

    await transporter.sendMail(
      {
        from: "stylesphere108@gmail.com",
        to: "akhileshg94386@gmail.com",
        subject: "This email for logged in our websites",
        html: emailTemplate,
      },
      (error, result) => {
        if (error) {
          res.status(500).json({
            code: 500,
            message: "Email Could not be sent",
            messageID: "",
            status: false,
            error: error,
            data: [],
          });
        } else {
          console.log("send");
          res.status(200).json({
            code: 200,
            message: "Email is Send",
            messageID: result.messageId,
            status: true,
            error: [],
            data: [],
          });
        }
      }
    );
  }
});

app.listen(port, () => {
  console.log("server is start");
});
