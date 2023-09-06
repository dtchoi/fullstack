import { useState, useEffect } from 'react'
import axios from 'axios'



const App = () => {
  const [countries, setCountries] = useState([])
  const [search, setSearch] = useState('')
  const [single, setSingle] = useState(null)
  const [temp, setTemp] = useState(0.00)
  const [windSpeed, setWindSpeed] = useState(0.0)
  const [icon, setIcon] = useState ("")
  const weather_key = import.meta.env.VITE_WEATHER_KEY
  const units = 'imperial'

  useEffect(() => {
    if(countries.length === 0) {
      axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data.map(c => c.name.common))
    })
    }

    if (countriesToShow.length == 1) {
      axios
        .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${countriesToShow[0]}`)
        .then(response => {
          axios
            .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${response.data.latlng[0]}&lon=${response.data.latlng[1]}&appid=${weather_key}&units=${units}`)
            .then(response => {
              setTemp(response.data.current.temp)
              setWindSpeed(response.data.current.wind_speed)
              setIcon(`https://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`)
          })
          setSingle(response.data)
      })  
    }
    else {
      setSingle(null)
    }
  },[search])

  const showView = (view) => {
    axios
      .get(`https://studies.cs.helsinki.fi/restcountries/api/name/${view}`)
      .then(response => {
        axios
          .get(`https://api.openweathermap.org/data/3.0/onecall?lat=${response.data.latlng[0]}&lon=${response.data.latlng[1]}&appid=${weather_key}&units=${units}`)
          .then(response => {
            setTemp(response.data.current.temp)
            setWindSpeed(response.data.current.wind_speed)
            setIcon(`https://openweathermap.org/img/wn/${response.data.current.weather[0].icon}@2x.png`)
        })
        setSingle(response.data)
        
    })  
    
  }

  const Filtered = ({countriesToShow}) => {
    if(countriesToShow.length > 10) {
      return (<div>Too many matches, specify another filter</div>)
    }
    else if (countriesToShow.length != 1) {
      return (
        <div>
          {countriesToShow.map(d =>
              <div key={d}>{d}<button onClick={() => showView(d)}>show</button></div>
          )}
        </div>
      )
    } 
    else {
      return null
    }
  }

  const Single = ({singleToShow}) => {
    if (singleToShow !== null) {
      //const iconUrl = 'https://openweathermap.org/img/wn/' + icon + '@2x.png'
      return (
        <div>
          <h2>{singleToShow.name.common}</h2>
          <div>capital {singleToShow.capital}</div>
          <div>area {singleToShow.area}</div>
          <h3>languages:</h3>
          <ul>
            {Object.values(singleToShow.languages).map(lang => <li key={lang}>{lang}</li>)}
          </ul>
          <img src={singleToShow.flags.png} alt={singleToShow.flags.alt}/>
          <h3>Weather in {singleToShow.capital}</h3>
          <div>temperature {temp} Fahrenheit</div>
          <img src={icon}/>
          <div>wind {windSpeed} miles/hour</div>
        </div>
      )
    }
    else {
      return null
    }

  }

  const handleChange = (event) => {
    setSearch(event.target.value)
  }

  const countriesToShow = search === ''
    ? countries
    : countries.filter(c => c.toLowerCase().includes(search.toLowerCase()))

  return (
    <>
      <div>
        find countries<input value={search} onChange={handleChange}/>
      </div>
      <div>
        <Filtered countriesToShow={countriesToShow}/>
        <Single singleToShow={single}/>
      </div>
    </>
  )
}

export default App
