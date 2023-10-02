import React, { useState, useEffect } from "react";
import Axios from "axios";
import "./Counter.css";

function CountdownTimer({ productId }) {
  const [order, setOrder] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [hours, setHours] = useState("00");
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("00");

  useEffect(() => {
    async function fetchOrder() {
      try {
        const response = await Axios.get(`http://localhost:8080/orders`, {
          withCredentials: true,
        });
        setOrder(response.data);
      } catch (error) {
        console.error(error);
      }
    }
    fetchOrder();
  }, []);

  useEffect(() => {
    if (order.length > 0) {
      const futureDate = new Date(order[0].date_ordered);
      futureDate.setHours(futureDate.getHours() + 1);
      setTimeLeft(Math.round((futureDate.getTime() - Date.now()) / 1000));
    }
  }, [order]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  useEffect(() => {
    if (timeLeft > 0) {
      let remainingTime = timeLeft;
      const hours = Math.floor(remainingTime / 3600);
      remainingTime -= hours * 3600;
      const minutes = Math.floor(remainingTime / 60);
      remainingTime -= minutes * 60;
      const seconds = remainingTime;
      setHours(String(hours).padStart(2, "0"));
      setMinutes(String(minutes).padStart(2, "0"));
      setSeconds(String(seconds).padStart(2, "0"));
    } else {
      setHours("00");
      setMinutes("00");
      setSeconds("00");

      Axios.post(
        "http://localhost:8080/orders",
        {
          productid: productId,
        },
        { withCredentials: true }
      );
    }
  }, [timeLeft]);

  return (
    <div>
      <h2 className="counterText">
        {timeLeft > 0 ? (
          `${hours}:${minutes}:${seconds}`
        ) : (
          <p>Time is UP !!!</p>
        )}
      </h2>
    </div>
  );
}

export default CountdownTimer;
