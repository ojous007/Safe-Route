import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'
import {useJsApiLoader, GoogleMap, Marker, Autocomplete, DirectionsRenderer} from '@react-google-maps/api'
import {useState, useRef} from 'react'
import { useReducedMotion } from 'framer-motion'

const center = {lat: 40.1098, lng: -88.2283}
const crime1 = {lat: 40.11072, lng: -88.21609} // 700 W Green Sr, Urbana IL
const crime2 = {lat: 40.11317, lng: -88.22525} // 1212 W Springfield Ave
const crime3 = {lat: 40.10923, lng: -88.23203} // 500 E john street
const crime4 = {lat: 40.11058, lng: -88.23750} // 112 E green street
const crime5 = {lat: 40.11266, lng: -88.21989} // 905 W Springfield Ave



function App() {

  const {isLoaded} = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
    libraries: ['places']
  })

  const [map, setMap] = useState(/** @type google.maps.Map */(null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [check1, setCheck1] = useState(false)
  const [check2, setCheck2] = useState(false)
  const [check3, setCheck3] = useState(false)
  const [check4, setCheck4] = useState(false)
  const [check5, setCheck5] = useState(false)

  /**@type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /**@type React.MutableRefObject<HTMLInputElement> */
  const destintationRef = useRef(); 



  if(!isLoaded) {
    return <SkeletonText/>
  }

  async function calculateRoute() {
    if(originRef.current.value === '' || destintationRef.current.value ==='') {
      return
    }
    //eslint-disable-next-line no-undef
    const directionsSerivce = new google.maps.DirectionsService()
    //sends the vals to the API
    const results = await directionsSerivce.route({
      origin: originRef.current.value, 
      destination: destintationRef.current.value, 
      //eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.WALKING
    })

    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    
    let routePoly = new google.maps.Polyline({
      path: results.routes[0].overview_path,
    });
    
    setCheck1(google.maps.geometry.poly.isLocationOnEdge(
        crime1,
        routePoly,
        10e-4
      ));

    setCheck2(google.maps.geometry.poly.isLocationOnEdge(
        crime2,
        routePoly,
        10e-4
      ));
    
    setCheck3(google.maps.geometry.poly.isLocationOnEdge(
        crime3,
        routePoly,
        10e-4
      ));

    setCheck4(google.maps.geometry.poly.isLocationOnEdge(
        crime4,
        routePoly,
        10e-4
      ));

    setCheck5(google.maps.geometry.poly.isLocationOnEdge(
        crime5,
        routePoly,
        10e-4
      ));
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setCheck1(false)
    setCheck2(false)
    setCheck3(false)
    setCheck4(false)
    setCheck5(false)
    originRef.current.value = ''
    destintationRef.current.value = ''
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      bgColor='white.200'
      h='100vh'
      w='100vw'
    >
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Being Displayed */}

        <GoogleMap 
          center = {center} 
          zoom = {15} 
          mapContainerStyle = {{width: '100%', height: '100%'}}
          onLoad = {map => setMap(map)}
        >
          {/* <Marker position = {center}/> */}

        {/* const check = React.useState(true); */}

        {check1 ? <Marker position = {crime1} title = {'ASSAULT on 12/29/22'}/> : []}
        {check2 ? <Marker position = {crime2} title = {'THEFT on 1/19/23'}/> : []}
        {check3 ? <Marker position = {crime3} title = {'ASSAULT on 11/10/22'}/> : []}
        {check4 ? <Marker position = {crime4} title = {'BATTERY on 10/7/22'}/> : []}
        {check5 ? <Marker position = {crime5} title = {'SEXUAL ASSAULT on 2/13/23'}/> : []}

          {directionsResponse && <DirectionsRenderer directions = {directionsResponse}/>}
          {/*Display Makers*/}
        </GoogleMap>
      </Box>

      <Box
        p={4}
        borderRadius='lg'
        mt={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='modal'
      >
        <HStack spacing={10}>
          <Autocomplete options>
            <Input type='text' placeholder='Origin' ref = {originRef}/>
          </Autocomplete>
          <Autocomplete>
            <Input type='text' placeholder='Destination' ref = {destintationRef} />
          </Autocomplete>
          <ButtonGroup>
            <Button colorScheme='blue' type='submit' onClick = {calculateRoute}>
              Calculate Route
            </Button>
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
            <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
          </ButtonGroup>
        </HStack>
        {/* <HStack spacing={4} justifyContent='space-between'>
          <Text>Distance: {distance}</Text>
          <Text>Duration: {duration} </Text>
          <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => map.panTo(center)}
          />
        </HStack> */}
      </Box>
    </Flex>
  )
}

export default App
