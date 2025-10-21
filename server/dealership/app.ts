import express from "express";
import { connect } from "mongoose";
import { readFileSync } from "fs";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";

import { DealershipModel } from "./dealership.ts";
import { ReviewModel } from "./review.ts";

const app = express();
const PORT = 3030;

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

const reviews = JSON.parse(readFileSync("./data/reviews.json", "utf8"));
const dealerships = JSON.parse(readFileSync("./data/dealerships.json", "utf8"));

connect(process.env.NODE_ENV !== "dev" ? "mongodb://mongo_db" : "mongodb://127.0.0.1", {
  dbName: "dealershipsDB",
});

try {
  ReviewModel.deleteMany({}).then(() => {
    ReviewModel.insertMany(reviews["reviews"]);
  });
  DealershipModel.deleteMany({}).then(() => {
    DealershipModel.insertMany(dealerships["dealerships"]);
  });

  console.log("Data imported successfully");
} catch (error) {
  console.error({ error: "Error fetching documents" });
}

app.get("/", async (req, res) => {
  res.send("Welcome to the Mongoose API");
});

app.get("/fetchReviews", async (req, res) => {
  try {
    const documents = await ReviewModel.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/fetchReviews/dealer/:id", async (req, res) => {
  try {
    const documents = await ReviewModel.find({ dealership: req.params.id });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/fetchDealers", async (req, res) => {
  try {
    const documents = await DealershipModel.find();
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/fetchDealers/:state", async (req, res) => {
  try {
    const documents = await DealershipModel.find({
      state: { $regex: new RegExp(req.params.state, "i") },
    });
    res.json(documents);
  } catch (error) {
    res.status(500).json({ error: "Error fetching documents" });
  }
});

app.get("/fetchDealer/:id", async (req, res) => {
  try {
    const document = await DealershipModel.findOne({ id: req.params.id });
    res.json(document);
  } catch (error) {
    res.status(500).json({ error: "Error fetching document" });
  }
});

app.post("/insert_review", express.raw({ type: "*/*" }), async (req, res) => {
  const data = JSON.parse(req.body);
  const documents = await ReviewModel.find().sort({ id: -1 });
  const id = documents[0]["id"] + 1;

  const review = new ReviewModel({
    id,
    name: data["name"],
    dealership: data["dealership"],
    review: data["review"],
    purchase: data["purchase"],
    purchase_date: data["purchase_date"],
    car_make: data["car_make"],
    car_model: data["car_model"],
    car_year: data["car_year"],
  });

  try {
    const savedReview = await review.save();
    res.json(savedReview);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Error inserting review" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
