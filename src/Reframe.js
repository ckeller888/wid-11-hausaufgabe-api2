import {
  Container,
  Button,
  Typography,
  FormControl,
  TextField,
  MenuItem,
  InputLabel,
  Select,
  Box,
  Alert,
} from "@mui/material";
import axios from "axios";
import { useState } from "react";

function Reframe() {
  const [reframeService, setReframeService] = useState("LV95 to WGS84");
  const [easting, setEasting] = useState("");
  const [northing, setNorthing] = useState("");
  const [transformedX, setTransformedX] = useState("");
  const [transformedY, setTransformedY] = useState("");
  const [error, setError] = useState(null);

  const baseUrl = "http://127.0.0.1:8000";
  const endpoint =
    reframeService === "WGS84 to LV95" ? "wgs84lv95" : "lv95wgs84";

  const handleTransform = async () => {
    setError(null);
    setTransformedX("");
    setTransformedY("");

    if (!easting || !northing) {
      setError("Bitte beide Koordinaten eingeben.");
      return;
    }

    try {
      const params =
        reframeService === "WGS84 to LV95"
          ? { lng: parseFloat(northing), lat: parseFloat(easting) }
          : { east: parseFloat(easting), north: parseFloat(northing) };

      const response = await axios.get(`${baseUrl}/${endpoint}`, { params });

      const output =
        reframeService === "WGS84 to LV95"
          ? response.data.output_LV95
          : response.data.output_WGS84;

      setTransformedX(output.E || output.lng);
      setTransformedY(output.N || output.lat);
    } catch (err) {
      setError("Transformation fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Container maxWidth="sm" style={{ textAlign: "left", marginTop: "30px" }}>
      <Typography variant="h4" style={{ marginBottom: "30px" }}>
        Koordinatentransformation
      </Typography>

      <Box display="flex" marginBottom="30px">
        <FormControl style={{ flex: 1, marginRight: "280px" }}>
          <InputLabel>REFRAME Service</InputLabel>
          <Select
            label="REFRAME Service"
            value={reframeService}
            onChange={(e) => setReframeService(e.target.value)}
          >
            <MenuItem value="LV95 to WGS84">LV95 to WGS84</MenuItem>
            <MenuItem value="WGS84 to LV95">WGS84 to LV95</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Box display="flex" marginBottom="30px">
        <TextField
          id="outlined-basic"
          label="Easting"
          variant="outlined"
          type="number"
          value={easting}
          onChange={(e) => setEasting(e.target.value)}
          style={{ flex: 1, marginRight: "5px" }}
        />

        <TextField
          id="outlined-basic"
          label="Northing"
          variant="outlined"
          type="number"
          value={northing}
          onChange={(e) => setNorthing(e.target.value)}
          style={{ flex: 1, marginLeft: "5px" }}
        />
      </Box>

      {error && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {error}
        </Alert>
      )}

      <Button
        fullWidth
        style={{ marginBottom: "30px", padding: "10px", fontSize: "16px" }}
        variant="contained"
        onClick={handleTransform}
      >
        Transform
      </Button>

      <Box display="flex">
        <TextField
          id="outlined-basic"
          label="Transformed X"
          variant="outlined"
          type="number"
          value={transformedX}
          style={{ flex: 1, marginRight: "5px" }}
          disabled
        />
        <TextField
          id="outlined-basic"
          label="Transformed Y"
          variant="outlined"
          type="number"
          value={transformedY}
          style={{ flex: 1, marginLeft: "5px" }}
          disabled
        />
      </Box>
    </Container>
  );
}

export default Reframe;
