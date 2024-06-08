const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../modules/lesting.js");


const mogoose_url = "mongodb://127.0.0.1:27017/wanderlust";

const dbConction = async () => {
    await mongoose.connect(mogoose_url);
};

dbConction().then(() => {
    console.log("db connected succfully");
}).catch((err) => {
    console.log("some err in db connection", err);
});

const initDB = async () => {
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};

initDB();