import React, { useState } from "react";
import "./App.css";
import Navbar from "./Navbar";
import axios from "axios";
import { Button, Spinner, Box, Text } from "@chakra-ui/react";
import keyboard from "./Images/Text-Image.png";
function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);
  const handleImage = (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);
  };

  const handleClick = async () => {
    try {
      if (selectedImage) {
        setLoading(true); // Show loading spinner

        const formData = new FormData();
        formData.append("image", selectedImage);

        // Replace with your actual backend API endpoint
        await axios.post(
          "https://extracttextfromimage.onrender.com/upload",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        console.log("Image sent successfully!");
        setLoading(false); // Hide loading spinner
        setError(null); // Clear any previous errors
        fetchData();
      } else {
        setError("No image selected.");
      }
    } catch (err) {
      console.error("Error sending image:", err);
      setError("Error sending image. Please try again later.");
      setLoading(false); // Hide loading spinner
    }
  };
  const fetchData = async () => {
    try {
      let res = await axios.get(
        "https://extracttextfromimage.onrender.com/text"
      );
      setData(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  console.log("data****", data);
  return (
    <div className="App">
      <Navbar />
      <div className="main">
        {selectedImage === null ? (
          <img src={keyboard} alt="keyboard" className="image-preview" />
        ) : (
          <img
            src={URL.createObjectURL(selectedImage)}
            alt="Preview"
            className="image-preview"
          />
        )}
        <br />
        <br />
        <div className="input">
          <input type="file" className="inputFile" onChange={handleImage} />
        </div>
        <br />
        {loading && <Spinner size="md" color="blue.500" />}
        {error && (
          <Box mt={4}>
            <Text color="red.500">{error}</Text>
          </Box>
        )}

        <br />
        <br />
        <div className="btn">
          <Button onClick={handleClick}>Check</Button>
        </div>
      </div>
      <div className="data-print">
        {data && <p>{data[data.length - 1].content}</p>}
      </div>
    </div>
  );
}

export default App;
