from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pyproj import Transformer

app = FastAPI()
app.add_middleware(CORSMiddleware,
                   allow_origins=["*"],
                   allow_credentials=True,
                   allow_methods=["*"],
                   allow_headers=["*"]
                    )

wgs84_to_lv95 = Transformer.from_crs("EPSG:4326", "EPSG:2056")
lv95_to_wgs84 = Transformer.from_crs("EPSG:2056", "EPSG:4326")

@app.get("/wgs84lv95")
async def root(lng: float, lat: float ):
    east, north = wgs84_to_lv95.transform(lat, lng)
    return {
        "input_WGS84": {"lng": lng, "lat": lat},
        "output_LV95": {"E": round(east, 6), "N": round(north, 6)}
    }


@app.get("/lv95wgs84")
async def root(east: float, north: float ):
    lng, lat = lv95_to_wgs84.transform(east, north)
    return {
        "input_LV95": {"E": east, "N": north},
        "output_WGS84": {"lng": round(lng, 6), "lat": round(lat, 6)}
    }
