
import './App.css';
// step2 search bar components setup & step6 import card and row components
// create search box by importing container applied CSS
// container wrap around the search box
// inputGroup as the form of the search box
// button to serach for what was typed
import{ 
  FormControl, 
  InputGroup, 
  Container, 
  Button,
  Card,
  Row,
} from "react-bootstrap";
// step3 hooks 
// useEffect to fetch an access token from spotify API using client credentials authentication
// 1. make a POST request to spotify API to obtain an access token
// 2. set the access token in the component's state
import{ useState, useEffect } from "react";


// step1 connect to spotify API
// declare variables/ keys from env file
const clientId = import.meta.env.VITE_CLIENT_ID;
const clientSecret = import.meta.env.VITE_CLIENT_SECRET;


function App() {
  // step3 declare search input & declare access token that obtain from the POST request
  const [searchInput, setSearchInput] = useState("");
  const [accessToken, setAccessToken] = useState("");

  // step5 get artist albums 
  const [albums, setAlbums] = useState([]);

  // s3 method to fetch access token
  useEffect(() => {
    let authParams = {
      method: "POST",
      headers:{
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=client_credentials&client_id=" +
        clientId +
        "&client_secret=" +
        clientSecret,
      };

      // fetch() to make HTTP request
      fetch("https://accounts.spotify.com/api/token", authParams)
        .then((result) => result.json())
        .then((data) => {
            setAccessToken(data.access_token);
        });
    }, []);

    // step4 async search function 
    async function search(){
      let artistParams = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      };

      // s4 get artist
      // using await to use searchInput that holds typed artist  
      const artistID = await fetch(
        "https://api.spotify.com/v1/search?q=" + searchInput + "&type=artist",
        artistParams
      )
        .then((result) => result.json())
        .then((data) => {
          return data.artists.items[0].id;
        });

      // // s4 to test functions with console messages
      // // if return artist ID successfully
      // console.log("Search Input: " + searchInput);
      // console.log("Artist ID: " + artistID);

      // s5 get artist albums
      await fetch(
        "https://api.spotify.com/v1/artists/" +
        artistID +
        "/albums?include_groups=album&market=US&limit=50",
        artistParams
      )
        .then((result) => result.json())
        .then((data) => {
          setAlbums(data.items);
        });
    }
  
  return (
    // s2 web setup with container already applied CSS
    <>
      <Container> 
        <InputGroup>
          <FormControl
            placeholder="Search For Artist"
            type="input"
            aria-label="Search for an Artist"
            onKeyDown={(event) => {
              if (event.key == "Enter") {
                search();
              } // search function, cant be empty, with function
            }}  
            onChange={(event) => setSearchInput(event.target.value)} // setSearch, ibid
            style={{
              width: "300px",
              height: "35px",
              borderWidth: "0px",
              borderStyle: "solid",
              borderRadius: "5px",
              marginRight: "10px",
              paddingLeft: "10px",
            }}
          />
  
          <Button onClick={search}>Search</Button>
        </InputGroup>
      </Container>

      <container> 
        <Row 
          style={{
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: "space-around",
            alignContent: "center",
          }}
        >
          {albums.map((album) => {
            return (
              <Card 
                key={album.id}
                style={{
                  backgroundColor: "white",
                  margin: "10px",
                  borderRadius: "5px",
                  marginBottom: "30px",
                }}
              >
                <Card.Img
                  width={200}
                  src={album.images[0].url}
                  style={{
                    borderRadius: "4%",
                  }}
                />
                <Card.Body>
                  <Card.Title
                    style={{
                      whiteSpace: "wrap",
                      fontWeight: "bold",
                      maxWidth: "200px",
                      fontSize: "18px",
                      marginTop: "10px",
                      color: "black",
                    }}
                  >
                    {album.name}
                  </Card.Title>
                  <Card.Text
                    style={{
                      color: "black",
                    }}
                  >
                    Release Date: <br /> {album.release_date}
                  </Card.Text>
                  <Button 
                    href={album.external_urls.spotify}
                    style={{
                      backgroundColor: "black",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "15px",
                      borderRadius: "5px",
                      padding: "10px",
                    }}
                  >
                    Album Link
                  </Button>
                </Card.Body>
              </Card> 
            );
          })} 
        </Row>
      </container>
    </>
  );
}

export default App
