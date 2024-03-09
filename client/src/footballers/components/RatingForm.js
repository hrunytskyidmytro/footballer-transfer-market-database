import React, { useState, useContext, useEffect } from "react";
import { Rate, Button, message, Descriptions } from "antd";

import { useHttpClient } from "../../shared/hooks/http-hook";
import { AuthContext } from "../../shared/context/auth-context";

const RatingForm = ({ footballerId }) => {
  const { token } = useContext(AuthContext);
  const { sendRequest } = useHttpClient();
  const [ratingByUser, setRatingByUser] = useState(null);

  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5001/api/ratings/${footballerId}`,
          "GET",
          null,
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );
        setRatingByUser(responseData.rating);
      } catch (err) {}
    };
    fetchRatings();
  }, []);

  const handleDelete = async () => {
    try {
      await sendRequest(
        `http://localhost:5001/api/ratings/${ratingByUser._id}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + token,
        }
      );
      message.success("Rating deleted successfully");
      setRatingByUser(null);
      // updateAverageRating();
      setTimeout(() => {
        message.info("Please reload the page to update the average rating.");
      }, 4000);
    } catch (err) {
      console.log(err.message);
      message.error("Failed to delete rating");
    }
  };

  const handleRatingChange = async (value) => {
    try {
      if (ratingByUser) {
        const responseData = await sendRequest(
          `http://localhost:5001/api/ratings/${ratingByUser._id}`,
          "PATCH",
          JSON.stringify({
            rating: value,
          }),
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );
        setRatingByUser(responseData.rating);
        message.success("Rating updated successfully");
        // updateAverageRating();
        setTimeout(() => {
          message.info("Please reload the page to update the average rating.");
        }, 4000);
      } else {
        const responseData = await sendRequest(
          "http://localhost:5001/api/ratings/new",
          "POST",
          JSON.stringify({
            footballer: footballerId,
            rating: value,
          }),
          {
            Authorization: "Bearer " + token,
            "Content-Type": "application/json",
          }
        );
        setRatingByUser(responseData.rating);
        message.success("Rating added successfully");
        // updateAverageRating();
        setTimeout(() => {
          message.info("Please reload the page to update the average rating.");
        }, 4000);
      }
    } catch (err) {
      message.error("Failed to save rating");
    }
  };

  return (
    <>
      <Descriptions bordered>
        <Descriptions.Item label="Your Rating:">
          <Rate
            allowHalf
            value={ratingByUser?.rating || 0}
            onChange={handleRatingChange}
          />
          <br />
          <br />
          {!ratingByUser && (
            <p style={{ textAlign: "center", fontStyle: "italic" }}>
              What do you think of the player? Leave your rating (assessment).
            </p>
          )}
          {ratingByUser && (
            <Button danger key="delete" onClick={handleDelete}>
              Delete
            </Button>
          )}
        </Descriptions.Item>
      </Descriptions>
    </>
  );
};

export default RatingForm;
