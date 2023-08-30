import { stationStore } from "../models/station-store.js";
import { readingStore } from "../models/reading-store.js";
import { conversion } from "../utils/conversion.js";

export const stationAnalytics = {
  
  async getLatestReading(station, stationId) {
    
    const readings = await readingStore.getReadingsByStationId(stationId);
    
    let latestReading = null;
    
    if (readings.length > 0) {
      latestReading = readings[readings.length - 1];
      station.code = latestReading.code;
      station.weather = await conversion.weatherMap(latestReading.code);
      station.tempC = latestReading.tempC;
      station.tempF =  await conversion.tempF(latestReading.tempC);        
      station.windSpeed = latestReading.windSpeed;
      station.windBft = await conversion.beaufort(latestReading.windSpeed);
      station.windDirection = await conversion.degreesToCompass(latestReading.windDirection);
      station.windChill = await this.windChill(latestReading.tempC, latestReading.windSpeed);
      station.pressure = latestReading.pressure;
    }
    else {
      station.code = "N/A";
      station.weather = "N/A";
      station.tempC = "N/A";
      station.tempF =  "N/A";       
      station.windSpeed = "N/A";
      station.windBft = "N/A";
      station.windDirection = "N/A";
      station.windChill = "N/A";
      station.pressure = "N/A";
    }
  },  
      
  async windChill(temp, windSpeed) {
    const num = 13.12 + 0.6215 * temp -  11.37 * (Math.pow(windSpeed, 0.16)) + 0.3965 * temp * (Math.pow(windSpeed, 0.16));
    return Math.round(num * 100) / 100;
  },
  
};