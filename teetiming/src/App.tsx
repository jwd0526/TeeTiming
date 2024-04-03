import React, { useEffect, useRef, useState } from "react";
import "./App.css";

interface TeeTimeProps {
  day: string;
  url: string;
  teetimes: {
    time: string;
    price: number;
    players: number;
  }[];
}

const getAllAvailableTeeTimes = () => {};
interface TeeProps {
  teetime: TeeTimeProps;
}
const Teetime: React.FC<TeeProps> = ({ teetime }) => {
  return (
    <div className="teetime-container">
      <div>{teetime.day}</div>
      <div>{teetime.url}</div>
      <div>
        {teetime.teetimes.map((currentTeetime) => {
          return (
            <div>
              <div>{currentTeetime.time}</div>
              <div>{currentTeetime.price}</div>
              <div>{currentTeetime.players}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [startTime, setStartTime] = useState("06:00");
  const [endTime, setEndTime] = useState("18:00");
  const [listOfTeeTimes, setListOfTeeTimes] = useState<TeeTimeProps[]>([]);
  const teeBoxRef = useRef<HTMLDivElement | null>(null);
  const [activeDays, setActiveDays] = useState<string[]>([]);
  const [teeBox, setTeeBox] = useState<React.ReactNode[]>([]);

  const getTeeTimes = (day: string): TeeTimeProps => {
    const teetime: TeeTimeProps = {
      day: "",
      url: "",
      teetimes: [],
    };

    const fetchPromise = fetch(`http://localhost:8000/teetimes/${day}`, {
      method: "GET",
      mode: "cors",
    });

    fetchPromise
      .then((response) => {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          return response.json();
        } else {
          return response.text();
        }
      })
      .then((data) => {
        if (Array.isArray(data)) {
          data.forEach((teeTimeInfo) => {
            teetime.day = `Day: ${teeTimeInfo.day}`;
            teetime.url = `URL: ${teeTimeInfo.url}`;
            teetime.teetimes = teeTimeInfo.teetimes.map((teeTimeSlot: any) => ({
              time: `Time: ${teeTimeSlot.time}`,
              price: `Price: ${teeTimeSlot.price}`,
              players: `Players: ${teeTimeSlot.players}`,
            }));
          });
        }
      })
      .catch((error) => {
        console.error("Error fetching tee times:", error);
      });
    return teetime;
  };

  const handleGetFilteredTeeTimes = () => {
    setTeeBox(
      listOfTeeTimes.map((teeTime, index) => (
        <Teetime key={index} teetime={teeTime} />
      ))
    );
  };

  const handleDaySelection = (day: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDay = day.target.value;
    if (activeDays.includes(selectedDay)) {
      setActiveDays(activeDays.filter((day) => day !== selectedDay));
    } else {
      setActiveDays([...activeDays, selectedDay]);
    }
    setTeeBox(
      activeDays.map((day, index) => (
        <Teetime key={index} teetime={getTeeTimes(day)} />
      ))
    );
  };

  useEffect(() => {
    handleGetFilteredTeeTimes();
    setListOfTeeTimes(activeDays.map((day) => getTeeTimes(day)));
  }, [activeDays]);

  return (
    <div className="App">
      <div ref={teeBoxRef} className="teetimes-box">
        {teeBox}
      </div>
      <div className="times-section">
        <div className="time-range">
          <label htmlFor="start-time">Start Time</label>
          <input
            type="time"
            id="start-time"
            name="start-time"
            value={startTime}
          />
        </div>
        <div className="time-range">
          <label htmlFor="end-time">End Time</label>
          <input type="time" id="end-time" name="end-time" value={endTime} />
        </div>
      </div>

      <div className="day-selector">
        <div className="day-options">
          <div>
            <input
              type="checkbox"
              id="monday"
              name="day"
              value="Monday"
              onChange={handleDaySelection}
            />
            <label htmlFor="monday">Monday</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="tuesday"
              name="day"
              value="Tuesday"
              onChange={handleDaySelection}
            />
            <label htmlFor="tuesday">Tuesday</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="wednesday"
              name="day"
              value="Wednesday"
              onChange={handleDaySelection}
            />
            <label htmlFor="wednesday">Wednesday</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="thursday"
              name="day"
              value="Thursday"
              onChange={handleDaySelection}
            />
            <label htmlFor="thursday">Thursday</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="friday"
              name="day"
              value="Friday"
              onChange={handleDaySelection}
            />
            <label htmlFor="friday">Friday</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="saturday"
              name="day"
              value="Saturday"
              onChange={handleDaySelection}
            />
            <label htmlFor="saturday">Saturday</label>
          </div>
          <div>
            <input
              type="checkbox"
              id="sunday"
              name="day"
              value="Sunday"
              onChange={handleDaySelection}
            />
            <label htmlFor="sunday">Sunday</label>
          </div>
        </div>
      </div>
      <div className="buttons-box">
        <button onClick={getAllAvailableTeeTimes}>
          Get All Available Tee Times
        </button>
        <button onClick={handleGetFilteredTeeTimes}>
          Get Filtered Tee Times
        </button>
      </div>
    </div>
  );
};

export default App;
