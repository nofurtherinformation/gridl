# %%
# dotenv
import json
import requests 
from dotenv import load_dotenv
import os
import pandas as pd

# Load the .env file
load_dotenv()
file_dir = os.path.dirname(os.path.abspath(__file__))
root_dir = os.path.dirname(file_dir)
data_dir = os.path.join(root_dir, "data")
google_doc = os.getenv("GOOGLE_DOC_URL")
# fetch CSV and read into df
df = pd.read_csv(google_doc)
# %%
def fetch_opencage_data(city):
    # API endpoint
    url = f"https://api.opencagedata.com/geocode/v1/json?q={city}&key={os.getenv('OPENCAGE_API_KEY')}"
    # Fetch data
    response = requests.get(url)
    # Parse JSON
    data = json.loads(response.text)
    # Return data
    return data

def save_results(city, data):
    # Save results to file
    with open(os.path.join(data_dir, "raw_geocoded", f"{city}.json"), "w") as f:
        json.dump(data, f)

def extract_key_data(city, data):
    result = data["results"][0]
    try:
      return {
        "City": city,
        "osm_url": result.get("annotations", {}).get("OSM", {}).get("url"),
        "flag": result.get("annotations", {}).get("flag"),
        "geohash": result.get("annotations", {}).get("geohash"),
        "drives_on": result.get("annotations", {}).get("roadinfo", {}).get("drive_on"),
        "bounds": result.get("bounds"),
        "latitude": result.get("geometry", {}).get("lat"),
        "longitude": result.get("geometry", {}).get("lng"),
      }
    except Exception as e:
        print(f"Error at {city}")
        print(e)
        print(result)
        return {}

# %%
def main():
    df['CityCountry'] = df['City'] + ', ' + df['Country']
    for city in df["CityCountry"]:
        data = fetch_opencage_data(city)
        save_results(city, data)
# %%
if __name__ == "__main__":
    main()
# %%
cleaned_data = []
for city in df["CityCountry"]:
    with open(os.path.join(data_dir, "raw_geocoded", f"{city}.json"), "r") as f:
        data = json.load(f)
        cleaned_data.append(extract_key_data(city, data))
# %%

df = df.merge(pd.DataFrame(cleaned_data), left_on="CityCountry", right_on="City")
# %%
df.to_csv(os.path.join(data_dir, "geocoded_cities.csv"), index=False)
# %%
