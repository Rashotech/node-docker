const express = require('express');
const app = express();
const mongoose = require('mongoose');
const redis = require('redis');
const cors = require('cors');
const session = require('express-session')
let RedisStore = require('connect-redis')(session);
const { MONGO_IP, MONGO_PASSWORD, MONGO_PORT, MONGO_USER, REDIS_URL, REDIS_PORT, SESSION_SECRET } = require('./config/config');

let redisClient = redis.createClient({
    host: REDIS_URL,
    port: REDIS_PORT
});


const postRouter = require("./routes/postRoutes");
const userRouter = require("./routes/userRoutes")

PORT = process.env.PORT || 3000;
const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}`

const connectWithRetry = () => {
    mongoose.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
})
.then(() => console.log("Successfully connected to the database"))
.catch((e) => {
    console.log(e)
    setTimeout(connectWithRetry, 5000);
});
};

connectWithRetry();
app.enable("trust proxy")

app.use(express.json());
app.use(cors({}));
app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      saveUninitialized: false,
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      cookie: { 
          secure: false,
          httpOnly: true,
          maxAge: 3000000000
      },
    })
  )

app.get((req, res) => {
    res.send("Hi there")
});

app.use("/api/v1/post", postRouter);
app.use("/api/v1/users", userRouter);

app.listen(PORT, () => {
    console.log(`Server listening at Port ${PORT}`)
});