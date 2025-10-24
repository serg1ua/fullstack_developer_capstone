import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import positiveIcon from "../assets/positive.png";
import neutralIcon from "../assets/neutral.png";
import negativeIcon from "../assets/negative.png";
import reviewIcon from "../assets/reviewbutton.png";
import "./Dealers.css";

const Dealer = () => {
  const { id } = useParams();

  const [dealer, setDealer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState(false);

  const rootUrl = useMemo(() => window.location.origin + "/", []);
  const dealerUrl = `${rootUrl}djangoapp/dealers/${id}`;
  const reviewsUrl = `${rootUrl}djangoapp/reviews/dealer/${id}`;
  const postReviewUrl = `${rootUrl}postreview/${id}`;

  const sentimentIcon = (sentiment) => {
    switch (sentiment) {
      case "positive":
        return positiveIcon;
      case "negative":
        return negativeIcon;
      default:
        return neutralIcon;
    }
  };

  useEffect(() => {
    const fetchDealerAndReviews = async () => {
      try {
        const [dealerRes, reviewsRes] = await Promise.all([fetch(dealerUrl), fetch(reviewsUrl)]);
        const [dealerData, reviewsData] = await Promise.all([dealerRes.json(), reviewsRes.json()]);

        if (dealerData.status === 200 && dealerData.dealer) {
          setDealer(dealerData.dealer);
        } else {
          setFetchError(true);
        }

        if (reviewsData.status === 200) {
          if (Array.isArray(reviewsData.reviews) && reviewsData.reviews.length > 0) {
            setReviews(reviewsData.reviews);
          } else {
            setUnreviewed(true);
          }
        }
      } catch (err) {
        console.error("Failed to fetch dealer or reviews:", err);
        setFetchError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDealerAndReviews();
  }, [dealerUrl, reviewsUrl]);

  const isLoggedIn = Boolean(sessionStorage.getItem("username"));

  if (fetchError) {
    return (
      <div className="dealer-error-container">
        <h2 className="dealer-error">Dealer not found</h2>
      </div>
    );
  }

  return (
    <div className="dealer-container">
      {dealer && (
        <div className="dealer-content">
          <h1>
            {dealer.full_name}
            {isLoggedIn && (
              <a href={postReviewUrl}>
                <img src={reviewIcon} alt="Post Review" />
              </a>
            )}
          </h1>
          <h4>
            {dealer.city}, {dealer.address}, Zip - {dealer.zip}, {dealer.state}
          </h4>
        </div>
      )}

      <div className="review-panel">
        {isLoading ? (
          <span>Loading Reviews...</span>
        ) : unreviewed ? (
          <div>No reviews yet!</div>
        ) : (
          reviews.map((review) => (
            <div key={review.id || `${review.name}-${review.review}`} className="review-card">
              <img
                src={sentimentIcon(review.sentiment)}
                className="emotion-icon"
                alt={review.sentiment}
              />
              <div className="review">{review.review}</div>
              <div className="reviewer">
                {review.name} {review.car_make} {review.car_model} {review.car_year}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dealer;
