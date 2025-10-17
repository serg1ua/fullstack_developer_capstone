import React, { useState, useEffect, useCallback } from "react";
import reviewIcon from "../assets/reviewicon.png";
import "../assets/style.css";
import "./Dealers.css";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [states, setStates] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = Boolean(sessionStorage.getItem("username"));
  const BASE_URL = "/djangoapp";

  // --- Fetch all dealers ---
  const fetchDealers = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/get_dealers`);
      const data = await res.json();

      if (data.status === 200 && Array.isArray(data.dealers)) {
        const allDealers = data.dealers;
        setDealers(allDealers);

        // Extract unique states
        const uniqueStates = [...new Set(allDealers.map((d) => d.state))];
        setStates(uniqueStates);
      }
    } catch (err) {
      console.error("Failed to fetch dealers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // --- Fetch dealers by state ---
  const fetchDealersByState = useCallback(
    async (state) => {
      if (state === "All") return fetchDealers();

      setIsLoading(true);
      try {
        const res = await fetch(`${BASE_URL}/get_dealers/${state}`);
        const data = await res.json();

        if (data.status === 200 && Array.isArray(data.dealers)) {
          setDealers(data.dealers);
        }
      } catch (err) {
        console.error("Failed to fetch dealers by state:", err);
      } finally {
        setIsLoading(false);
      }
    },
    [fetchDealers]
  );

  // --- Initial load ---
  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  const handleStateChange = (e) => {
    const value = e.target.value;
    setSelectedState(value);
    fetchDealersByState(value);
  };

  return (
    <div className="dealers-container">
      <table className="table">
        <thead style={{ border: "inset" }}>
          <tr>
            <th>ID</th>
            <th>Dealer Name</th>
            <th>City</th>
            <th>Address</th>
            <th>Zip</th>
            <th>
              <select
                style={{ padding: "8px 0" }}
                name="state"
                id="state"
                value={selectedState}
                onChange={handleStateChange}
              >
                <option value="" disabled hidden>
                  State
                </option>
                <option value="All">All States</option>
                {states.map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </th>
            {isLoggedIn && <th>Review Dealer</th>}
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={isLoggedIn ? 7 : 6}>Loading...</td>
            </tr>
          ) : dealers.length === 0 ? (
            <tr>
              <td colSpan={isLoggedIn ? 7 : 6}>No dealers found.</td>
            </tr>
          ) : (
            dealers.map((dealer) => (
              <tr style={{ border: "inset" }} key={dealer.id}>
                <td>{dealer.id}</td>
                <td>
                  <a href={`/dealer/${dealer.id}`}>{dealer.full_name}</a>
                </td>
                <td>{dealer.city}</td>
                <td>{dealer.address}</td>
                <td>{dealer.zip}</td>
                <td>{dealer.state}</td>
                {isLoggedIn && (
                  <td>
                    <a href={`/postreview/${dealer.id}`}>
                      <img src={reviewIcon} className="review_icon" alt="Post Review" />
                    </a>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dealers;
