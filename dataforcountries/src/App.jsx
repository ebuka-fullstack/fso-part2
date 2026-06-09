import { useState, useEffect } from "react"
import axios from "axios"

const App = () => {
  const [countries, setCountries] = useState([])
  const [searchItem, setSearchItem] = useState("")
  const [selectCountry, setSelectCountry] = useState(null)
  const [weather, setWeather] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (searchItem.trim() === "") {
      setCountries([])
      return
    }

    const fetchCountry = async () => {
      try {
        const url = `https://restcountries.com/v3.1/name/${searchItem}`
        const response = await axios.get(url)
        setCountries(response.data)
        console.log(response.data)
        selectCountry(null)
        setWeather(null)

if (response.data.length === 1) {
  const capital = response.data[0].capital ? response.data[0].capital[0] : null
  
    fetchWeather(capital)
  } else {
    setError("Capital city not found for this country") 
  }




      } catch (error) {
        console.error("Error fetching country data:", error.response.data)
        setCountries([])
      }
    }

    fetchCountry()
  }, [searchItem]) 

  const fetchWeather = async (capital) => {
    try {
      
      const apiKey = import.meta.env.VITE_SOME_KEY
      const v2_5 = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${apiKey}&units=metric`
      const weatherResponse = await axios.get(v2_5)
      setWeather(weatherResponse.data)
    } catch (error) {
      console.error("Error fetching weather data:", error.response.data)
      setError("Failed to fetch weather data")
    }

  }
const renderLanguage = (languages) => {
  if (Array.isArray(languages)) {
    return languages.join(",")
    
  }else if (typeof languages === "object" && languages !== null){
    return Object.values(languages).join(",")
  }else{
     return "Unknown"
  }
}


const handleCountrySelect = (country) => {
  setSelectCountry(country)
  const capital = country.capital ? country.capital[0] : null
  if (capital) {
    fetchWeather(capital)
  } else {
    setError("Capital city not found for this country")
  }
}




  return (
    <div>
      <h1>Country Information App</h1>

      <label>
        Search for a country:
        <input
          type="text"
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </label>

      {countries.length > 10 && (
        <p>Too many matches, specify another filter</p>
      )}

      {countries.length <= 10 && countries.length > 1 && (
        <div>
          <h2>Matching Countries:</h2>
          <ul>
            {countries.map((country) => (
              <li key={country.name.common} > {country.name.common} 
               &nbsp;<button onClick={() => handleCountrySelect(country)}>show data</button></li>
            ))}
          </ul>
        </div>
      )}

     
     {selectCountry && (
        <div>
          <h2>Selected Country: {selectCountry.name.common}</h2>
          <p>Capital: {selectCountry.capital}</p>
          <p>Area: {selectCountry.area}</p>
          <p>
            Language(s): {" "}
            {selectCountry.languages && renderLanguage(selectCountry.languages)}
          </p>
          <p>Flags:</p>
          {
            <img
              src={selectCountry.flags.png}
              alt={`${selectCountry.name.common}'s flag`}>
            
            </img>
          
          }
          <p>Coat of Arms:</p>
          {
            <img
              src={selectCountry.coatOfArms.svg}
              alt={`${selectCountry.name.common}'s Coat of Arms`} width="300px" height="250px">
                            
            </img>
          }

            <p>Weather Map</p>
          {weather && (
            <div>
              <h3>Weather in {selectCountry.capital[0]}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Description: {weather.weather[0].description}</p>
              <p>Weather Icon:</p>
              {
                weather.weather[0].icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                  />
                )
              }
              
            </div>
          )}
          {error && <p>{error}</p>}


        </div>
      )}


       {countries.length === 1 && (
        <div>
          <h3>{countries[0].name.common}</h3>
          <p>Capital: {countries[0].capital}</p>
          <p>Area: {countries[0].area}</p>
          <p>
            Language(s): {" "}
            {countries[0].languages && renderLanguage(countries[0].languages)}
          </p>
          <p>Flag:</p>
          {
            <img
              src={countries[0].flags.png}
              alt={`${countries[0].name.common}'s flag`}>
            
            </img>
          
          }

          <p>Coat of Arms:</p>
          {
            <img
              src={countries[0].coatOfArms.svg}
              alt={`${countries[0].name.common}'s Coat of Arms`} width="300px" height="250px">
            
            </img>
          
          }

          <p>Weather Map</p>
          {weather && (
            <div>
              <h3>Weather in {selectCountry.capital[0]}</h3>
              <p>Temperature: {weather.main.temp}°C</p>
              <p>Humidity: {weather.main.humidity}%</p>
              <p>Description: {weather.weather[0].description}</p>
              <p>Weather Icon:</p>
              {
                weather.weather[0].icon && (
                  <img
                    src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                    alt="Weather Icon"
                  />
                )
              }
          
            </div>
          )}
          {error && <p>{error}</p>}

        </div>
      )}

      
    </div>

  )
}

export default App