import React, { useState, useEffect, useCallback } from "react";
import { useDebouncedCallback } from "use-debounce";
import reviewIcon from "../assets/reviewicon.png";
import "./Dealers.css";

const Dealers = () => {
  const [dealers, setDealers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isLoggedIn = Boolean(sessionStorage.getItem("username"));
  const BASE_URL = "/djangoapp";

  const fetchDealers = useCallback(async (value) => {
    setIsLoading(true);

    try {
      const res = await fetch(
        !value ? `${BASE_URL}/get_dealers` : `${BASE_URL}/get_dealers/${value}`
      );
      const data = await res.json();

      if (data.status === 200 && Array.isArray(data.dealers)) {
        const allDealers = data.dealers;
        setDealers(allDealers);
      }
    } catch (err) {
      console.error("Failed to fetch dealers:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDealers();
  }, [fetchDealers]);

  const debounced = useDebouncedCallback((value) => {
    fetchDealers(value);
  }, 500);

  const handleInputChange = (event) => {
    const value = event.target.value?.trim();
    setSearchQuery(value);
    debounced(value);
  };

  return (
    <div className="table-responsive">
      <table className="table">
        <thead>
          <tr>
            <th class="col">ID</th>
            <th class="col-3">Dealer Name</th>
            <th class="col-2">City</th>
            <th class="col-3">Address</th>
            <th class="col">Zip</th>
            <th class="col-2">
              <input
                type="text"
                placeholder="Search states..."
                onChange={handleInputChange}
                value={searchQuery}
              />
            </th>
            {isLoggedIn && <th class="col">Review</th>}
          </tr>
        </thead>
        {isLoading ? (
          <div class="text-center spinner">
            <div class="spinner-border" role="status"></div>
          </div>
        ) : (
          <tbody>
            {dealers.length === 0 ? (
              <tr>
                <td colSpan={isLoggedIn ? 7 : 6}>No dealers found.</td>
              </tr>
            ) : (
              dealers.map((dealer) => (
                <tr key={dealer.id}>
                  <td>{dealer.id}</td>
                  <td>
                    <a className="dealer-name" href={`/dealer/${dealer.id}`}>
                      {dealer.full_name}
                    </a>
                  </td>
                  <td>{dealer.city}</td>
                  <td>{dealer.address}</td>
                  <td>{dealer.zip}</td>
                  <td>{dealer.state}</td>
                  {isLoggedIn && (
                    <td>
                      <a href={`/postreview/${dealer.id}`}>
                        <img src={reviewIcon} className="review-icon" alt="Post Review" />
                      </a>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Dealers;
