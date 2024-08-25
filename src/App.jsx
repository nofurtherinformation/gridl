import { useState, useEffect } from "react";
import "./App.css";
import * as papa from "papaparse";
import { haversine } from "./utils/haversine";
import { heading } from "./utils/heading";
import ReactMap from "react-map-gl";
import maplibre from "maplibre-gl";
import { useRef } from "react";
import "maplibre-gl/dist/maplibre-gl.css";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import styled from "@emotion/styled";
const RowBox = styled(Box)`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 1rem;
  justify-content: space-evenly;
  @media (max-width: 800px) {
    flex-direction: column;
  }
`;
function GuessBox({ options, onGuess }) {
  return (
    <Autocomplete
      disablePortal
      id="combo-box-demo"
      options={options}
      sx={{ width: '100%' }}
      renderOption={(props, option) => <li {...props}>{option.CityCountry}</li>}
      getOptionKey={(option) => option.CityCountry}
      getOptionLabel={(option) => option.CityCountry}
      onChange={(_e, value) => {
        onGuess(value);
      }}
      renderInput={(params) => <TextField {...params} label="City" />}
    />
  );
}

async function init() {
  const citiesData = await fetch("/geocoded_cities.csv").then((r) => r.text());
  const cities = papa
    .parse(citiesData, {
      header: true,
      dynamicTyping: true,
    })
    .data.sort((a, b) => a.CityCountry - b.CityCountry);

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
      <p className="read-the-docs">Guess the city</p>
      {Object.keys(chosen).length > 0 ? (
        <Game citiesData={citiesData} chosen={chosen} />
      ) : (
        "Loading..."
      )}
    </>
  );
}

function Game({ citiesData, chosen }) {
  const [selectedGuess, setSelectedGuess] = useState(citiesData[0]);
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
      <RowBox>
        <div style={{flex:1}}>
          <div>
            {guesses.map((guess) => {
              const distance = haversine(
                chosen.latitude,
                chosen.longitude,
                guess.latitude,
                guess.longitude
              );
              const direction = heading(
                guess.latitude,
                guess.longitude,
                chosen.latitude,
                chosen.longitude
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
                    <p>{Math.round(distance).toLocaleString()} km</p>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        // center
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      {/* div centers child */}
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: "0.5rem",
                          width: "2rem",
                          height: "2rem",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "1rem",
                            width: "1rem",
                            height: "1rem",
                            transform: `rotate(${direction}deg)`,
                          }}
                        >
                          ↑
                        </div>
                      </div>{" "}
                      <p>{Math.round(direction)} degrees</p>
                    </div>
                  </div>
                  <hr />
                </>
              );
            })}
          </div>
          {/* input with list of citiesDAta */}
          <GuessBox options={citiesData} onGuess={setSelectedGuess} />
          <Button onClick={handleGuess} fullWidth variant="contained" my={2}>
            Guess
          </Button>
        </div>
        <div style={{flex:1}}>
          <GameMap chosen={chosen} />
        </div>
      </RowBox>
    </div>
  );
}

function GameMap({ chosen }) {
  const mapRef = useRef(null);
  const cleanBounds = chosen.bounds.replace(/'/g, '"');
  const hasZoomedIn = useRef(false);

  let arrBounds = Object.entries(JSON.parse(cleanBounds)).map(
    ([key, value]) => {
      const val = Object.values(value);
      return [val[1], val[0]];
    }
  );

  const handleMapLoad = (_e) => {
    const mapCenter = mapRef.current.getCenter();
    const mapZoom = mapRef.current.getZoom();
    // mapRef.current.flyTo({
    //   center: [mapCenter.lng, mapCenter.lat],
    //   zoom: mapZoom * 1
    // });
  };

  return (
    <div
      style={{
        width: "100%",
        position: "relative",
        height: "60vh",
        minWidth: "40vw",
        pointerEvents: "none",
      }}
    >
      <ReactMap
        ref={mapRef}
        mapLib={maplibre}
        bounds={arrBounds}
        onLoad={handleMapLoad}
        mapStyle="https://api.maptiler.com/maps/8a6fa984-7aa9-4b0c-990d-a89d737d936f/style.json?key=iqzk1Sq43ATpdEUCOQOQ"
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
