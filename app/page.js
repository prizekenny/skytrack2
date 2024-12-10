"use client";

import Popular from "./components/Popular";
import Hourly from "./components/Hourly";
import { useEffect, useState } from "react";
import CityList from "./CityList";
import WeatherCard from "./components/WeatherCard";
import { getCurrentLocationWeather, getWeather } from "./api/weather";
import { searchCities } from "./api/trimble";
import Search from "./Search";

export default function Home() {
  const [cities, setCities] = useState([]);
  const [currentCity, setCurrentCity] = useState(null);

  useEffect(() => {
    async function fetchCurrentCity() {
      try {
        // Get current location weather including city name
        const weather = await getCurrentLocationWeather();

        if (weather) {
          const data = await searchCities(weather.location.name);

          const locations = data ? data.Locations : [];
          console.log("Locations:", locations);
          setCurrentCity(locations.length > 0 ? locations[0] : null);
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
      return () => {};
    }
    fetchCurrentCity();
  }, []);
  const addCity = (city) => {
    setCities((prevCities) => [...prevCities, city]);
  };

  return (
    <main className="flex flex-col items-center justify-center bg-white  text-black">
      <header className="mb-10">
        <h1 className="text-5xl">Skytrack</h1>
      </header>
      <div>
        {/* Search */}
        <Search onSelect={addCity} />

        {/* Popular */}
        <div className="flex flex-row gap-2 items-center mb-10">
          <h2 className="pr-5">Popular</h2>
          <Popular city="Toronto" province="ON" temperature={22} />
          <Popular city="Calgary" province="AB" temperature={22} />
        </div>

        {/* current location */}
        {currentCity && (
          <div>
            <h2>Current: {currentCity.Address.City}</h2>
            <WeatherCard city={currentCity} />
          </div>
        )}

        {/* hourly */}
        <div>
          <h2>Hourly</h2>
          <Hourly
            time="8am"
            weather={"Sunny"}
            temperature={5}
            feels={6}
            wind="22 km/h"
            windGust="20km/h"
            pop="30%"
            snow="0.1cm"
            rain="0.1mm"
          />
        </div>

        {/* city list */}
        <CityList cities={cities} />
      </div>
      <footer>
        <p></p>
      </footer>
    </main>
  );
}
