import React, { useState, useEffect } from 'react'
import axios from 'axios'
import SearchForCountry from './components/SearchForCountry'
import Countries from './components/Countries'



const App = () => {

  //variables declared with 'useState' so that they re-render each time they're changed
  const [countries, setCountries] = useState([])
  const [countrySearch, setCountrySearch] = useState('')
  const [showNone, setShowNone] = useState(true)
  const [countryToShow, setCountryToShow] = useState({})
  const [showCountryInfo, setShowCountryInfo] = useState(true)
  const none = []
  const noShow = {}
  const api_key = process.env.REACT_APP_API_KEY
  const [ countryWeather, setCountryWeather ] = useState({})

  //fetches data from serves using the 'axios'-library and 'useEffect' hook
  useEffect(() => {
    console.log('(country data) effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('(country data) promise fulfilled')
        setCountries(response.data)
      })
  }, [])


  // Updates 'countrySearch' with the string being searched and sets 'showNone' to 'true' if the search box is empty or 'false' if something is being typed. Also, sets the object 'countryToShow' as empty, so that if a useer starts a new search, the country info he was viewing after clicking the button that reveals that information, disappears.
  const handleSearch = (event) => {
    setCountryToShow({})
    setCountrySearch(event.target.value.toLowerCase())
    if (event.target.value === '') setShowNone(true)
    else setShowNone(false)
  }
  
  // If search box is empty, returns empty array, else returns list of countries that contain the search string
  const countriesToShow = showNone
    ? none
    : countries.filter(country => (country.name.common.toLowerCase().indexOf(countrySearch) !== -1)) 


  //the function is triggered when a user presses the button 'show' next to a country's name. The country's details are saved into the variable 'countryToShow' which uses state. It also sets the flag 'showCountryInfo' to 'true
  const handleClick = (country) => {
    setCountryToShow(country)
    setShowCountryInfo(true)
  }

  //when the flag 'showCountryInfo' is 'true', the 'countryClicked' becomes the object 'countryToShow', otherwise it is an empty object, so nothing renders on screen
  const countryClicked = showCountryInfo
    ? countryToShow
    : noShow


  //everytime a country is clicked, function fetches weather data for that country and stores it in 'countryWeather'
  useEffect(() => {
    console.log('(weather) effect');  
    if (Object.keys(countryClicked).length !== 0) { 
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?lat=${countryClicked.latlng[0]}&lon=${countryClicked.latlng[1]}&appid=${api_key}`)
        .then(response => {
          console.log('(weather) promise fulfilled')
          setCountryWeather(response.data)        
        })
    }  
  }, [countryClicked])


  
  return (
    <>
      <SearchForCountry value={countrySearch} handleSearch={handleSearch} />
      <br />
      <Countries countries={countriesToShow} handleClick={handleClick} countryClicked={countryClicked} countryWeather={countryWeather} />   
    </>
  )

}

export default App;
