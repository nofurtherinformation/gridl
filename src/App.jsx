import { useState, useEffect } from "react";
import "./App.css";
import * as papa from "papaparse";
import { haversine } from "./utils/haversine";
import { heading } from "./utils/heading";
import ReactMap from "react-map-gl";
import maplibre from "maplibre-gl";

async function init() {
  console.log("init");
  const citiesData = await fetch("/geocoded_cities.csv").then((r) => r.text());
  const cities = papa.parse(citiesData, {
    header: true,
    dynamicTyping: true,
  }).data.sort((a, b) => a.CityCountry - b.CityCountry)

  const chosen = cities[Math.floor(Math.random() * cities.length)];
  return {
    cities,
    chosen,
  };
}

function App() {
  const [citiesData, setCitiesData] = useState([]);
  const [chosen, setChosen] = useState({});
  useEffect(() => {
    init().then(({ cities, chosen }) => {
      setCitiesData(cities);
      setChosen(chosen);
    });
  }, []);

  return (
    <>
      <h1>gridl</h1>
      <p className="read-the-docs">figure it out</p>
      {Object.keys(chosen).length > 0 ? (
        <Game citiesData={citiesData} chosen={chosen} />
      ) : (
        "Loading..."
      )}
    </>
  );
}

function Game({ citiesData, chosen }) {
  const [selectedGuess, setSelectedGuess] = useState({});
  const [guesses, setGuesses] = useState([]);

  const handleGuess = () => {
    setGuesses((guesses) => [...guesses, selectedGuess]);
  };
  const handleSelect = (e) => {
    const cityName = e.target.value;
    const city = citiesData.find((city) => city.CityCountry === cityName);
    setSelectedGuess(city);
  };

  const correct =
    guesses?.length && guesses.at(-1).CityCountry === chosen.CityCountry;
  const lost = !correct && guesses.length === 6;
  return (
    <div>
      {!!correct && "You win!"}
      {!!lost && "You lose!"}
      {!!(correct || lost) && <h3>{chosen.CityCountry}</h3>}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          justifyContent: "space-evenly",
        }}
      >
        <div>
          <div>
            {guesses.map((guess) => {
              const distance = haversine(
                chosen.latitude,
                chosen.longitude,
                guess.latitude,
                guess.longitude
              );
              const direction = heading(
                chosen.latitude,
                chosen.longitude,
                guess.latitude,
                guess.longitude
              );
              return (
                <>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <h4>{guess.CityCountry}</h4>
                    <p>{Math.round(distance)} km</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "1rem",
                          width: "2rem",
                          height: "2rem",
                          transform: `rotate(${direction}deg)`,
                        }}
                      >
                        ↑
                      </div>
                      <p>{Math.round(direction)} degrees</p>
                    </div>
                  </div>
                  <hr />
                </>
              );
            })}
          </div>
          {/* input with list of citiesDAta */}
          <select onChange={handleSelect} disabled={correct || lost}>
            {citiesData.map((city) => (
              <option>{city.CityCountry}</option>
            ))}
          </select>
          <button onClick={handleGuess}>guess</button>
        </div>
        <div>
          <GameMap chosen={chosen} />
        </div>
      </div>
    </div>
  );
}

function GameMap({ chosen }) {
  const cleanBounds = chosen.bounds.replace(/'/g, '"');
  let arrBounds = Object.entries(JSON.parse(cleanBounds)).map(
    ([key, value]) => {
      const val = Object.values(value);
      return [val[1], val[0]];
    }
  );
  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        pointerEvents: "none",
        height: "60vh",
        minWidth: "40vw",
      }}
    >
      <ReactMap
        mapLib={maplibre}
        bounds={arrBounds}
        minZoom={7}
        mapStyle="https://api.maptiler.com/maps/8a6fa984-7aa9-4b0c-990d-a89d737d936f/style.json?key=iqzk1Sq43ATpdEUCOQOQ"
        mapboxAccessToken={import.meta.env.VITE_APP_MAPBOX_API_ACCESS_TOKEN} // Pass an empty string for Mapbox API access token as MapTiler handles this.
        // initialViewState={{
        //   latitude: chosen.latitude,
        //   longitude: chosen.longitude,
        //   zoom: 2,
        // }}
      />
    </div>
  );
}
export default App;
