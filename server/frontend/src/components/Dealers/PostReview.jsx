import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./Dealers.css";

const PostReview = () => {
  const [dealer, setDealer] = useState({});
  const [review, setReview] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [date, setDate] = useState("");
  const [carmodels, setCarmodels] = useState([]);

  const { id } = useParams();

  const rootUrl = window.location.origin + "/";
  const dealerUrl = `${rootUrl}djangoapp/dealers/${id}`;
  const reviewUrl = `${rootUrl}djangoapp/add_review`;
  const carmodelsUrl = `${rootUrl}djangoapp/get_cars`;

  useEffect(() => {
    const getDealer = async () => {
      try {
        const res = await fetch(dealerUrl);
        const data = await res.json();
        if (data.status === 200 && data.dealer) {
          setDealer(data.dealer);
        }
      } catch (err) {
        console.error("Failed to fetch dealer:", err);
      }
    };

    const getCars = async () => {
      try {
        const res = await fetch(carmodelsUrl);
        const data = await res.json();
        if (Array.isArray(data.CarModels)) {
          setCarmodels(data.CarModels);
        }
      } catch (err) {
        console.error("Failed to fetch car models:", err);
      }
    };

    getDealer();
    getCars();
  }, [dealerUrl, carmodelsUrl]);

  const handleSubmit = async () => {
    const name =
      [sessionStorage.firstName, sessionStorage.lastName].filter(Boolean).join(" ") ||
      sessionStorage.username;

    const [makeChosen, modelChosen] = model.split(" ");

    const payload = {
      name,
      dealership: id,
      review,
      purchase: true,
      purchase_date: date,
      car_make: makeChosen,
      car_model: modelChosen,
      car_year: year,
    };

    try {
      const res = await fetch(reviewUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const json = await res.json();
      if (json.status === 200) {
        window.location.href = `${window.location.origin}/dealer/${id}`;
      } else {
        alert("Something went wrong while posting the review.");
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    }
  };

  const isFormValid = model && review && date && year;

  return (
    <div>
      <div className="postreview_container">
        <h2>{dealer.full_name}</h2>
        <textarea
          id="review"
          cols="50"
          rows="7"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />

        <div className="input_field">
          Purchase Date <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>

        <div className="input_field">
          Car Make
          <select name="cars" id="cars" value={model} onChange={(e) => setModel(e.target.value)}>
            <option value="" disabled hidden>
              Choose Car Make and Model
            </option>
            {carmodels.map((carmodel, index) => (
              <option key={index} value={`${carmodel.CarMake} ${carmodel.CarModel}`}>
                {carmodel.CarMake} {carmodel.CarModel}
              </option>
            ))}
          </select>
        </div>

        <div className="input_field">
          Car Year{" "}
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            max={2025}
            min={2015}
          />
        </div>

        <div>
          <button className="postreview" onClick={handleSubmit} disabled={!isFormValid}>
            Post Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostReview;
