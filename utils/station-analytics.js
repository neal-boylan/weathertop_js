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
      station.code == 100 ? station.clear = true: station.clear = false;
      station.code == 200 ? station.partialClouds = true: station.partialClouds = false;
      station.code == 300 ? station.cloudy = true: station.cloudy = false;
      station.code == 400 ? station.lightShowers = true: station.lightShowers = false;
      station.code == 500 ? station.heavyShowers = true: station.heavyShowers = false;
      station.code == 600 ? station.rain = true: station.rain = false;
      station.code == 700 ? station.snow = true: station.snow = false;
      station.code == 800 ? station.thunder = true: station.thunder = false;
      station.tempC = latestReading.tempC;
      station.tempF =  await conversion.tempF(latestReading.tempC);
      station.maxTemp = await this.maxTemp(readings);
      station.minTemp = await this.minTemp(readings);
      station.tempRising = await this.tempRising(readings);
      station.tempFalling = await this.tempFalling(readings);
      station.windSpeed = latestReading.windSpeed;
      station.windBft = await conversion.beaufort(latestReading.windSpeed);
      station.windDirection = await conversion.degreesToCompass(latestReading.windDirection);
      station.windChill = await this.windChill(latestReading.tempC, latestReading.windSpeed);
      station.maxWind = await conversion.beaufort(await this.maxWind(readings));
      station.minWind = await conversion.beaufort(await this.minWind(readings));
      station.windRising = await this.windRising(readings);
      station.windFalling = await this.windFalling(readings);
      station.pressure = latestReading.pressure;
      station.maxPressure = await this.maxPressure(readings);
      station.minPressure = await this.minPressure(readings);
      station.pressureRising = await this.pressureRising(readings);
      station.pressureFalling = await this.pressureFalling(readings);
    }
    else {
      station.code = "N/A";
      station.weather = "N/A";
      station.tempC = "N/A";
      station.tempF =  "N/A";  
      station.maxTemp = "N/A";
      station.minTemp = "N/A"; 
      station.windSpeed = "N/A";
      station.windBft = "N/A";
      station.windDirection = "N/A";
      station.windChill = "N/A";
      station.maxWind = "N/A";
      station.minWind = "N/A";
      station.pressure = "N/A";
      station.maxPressure = "N/A";
      station.minPressure = "N/A";
    }
  },  
      
  async windChill(temp, windSpeed) {
    const num = 13.12 + 0.6215 * temp -  11.37 * (Math.pow(windSpeed, 0.16)) + 0.3965 * temp * (Math.pow(windSpeed, 0.16));
    return Math.round(num * 100) / 100;
  },
  
  async max(values) {
    let max = values[0];
    for (let i = 0; i < values.length; i++){
      if (values[i] > max) {
        max = values[i];
      }
    }
    return max;
  },

  async min(values) {
    let min = values[0];
    for (let i = 0; i < values.length; i++){
      if (values[i] < min) {
        min = values[i];
      }
    }
    return min;
  },

  async maxTemp(readings) {
    let values = [];
    for (let i = 0; i < readings.length; i++){
      values[i] = readings[i].tempC;
    }
    return await this.max(values);
  },

  async minTemp(readings) {
    let values = [];
    for (let i = 0; i < readings.length; i++){
      values[i] = readings[i].tempC;
    }
    return await this.min(values);
  },

  async maxWind(readings) {
    let values = [];
    for (let i = 0; i < readings.length; i++){
      values[i] = readings[i].windSpeed;
    }
    return await this.max(values);
  },

  async minWind(readings) {
    let values = [];
    for (let i = 0; i < readings.length; i++){
      values[i] = readings[i].windSpeed;
    }
    return await this.min(values);
  },

  async maxPressure(readings) {
    let values = [];
    for (let i = 0; i < readings.length; i++){
      values[i] = readings[i].pressure;
    }
    return await this.max(values);
  },

  async minPressure(readings) {
    let values = [];
    for (let i = 0; i < readings.length; i++){
      values[i] = readings[i].pressure;
    }
    return await this.min(values);
  },
  
  async tempRising(readings) {
    let trend = null;
    if (readings.length > 2) {
      let values = [readings[readings.length-3].tempC, readings[readings.length-2].tempC, readings[readings.length-1].tempC];
      if (( values[2] > values[1] ) && (values[1] > values[0])) {
        trend = true;
      } else {
        trend = false;
      }
    }
    return trend;
  },
  
  async tempFalling(readings) {
    let trend = null;
    if (readings.length > 2) {
      let values = [readings[readings.length-3].tempC, readings[readings.length-2].tempC, readings[readings.length-1].tempC];
      if (( values[2] < values[1] ) && (values[1] < values[0])) {
        trend = true;
      } else {
        trend = false;
      }
    }
    return trend;
  },

  async windRising(readings) {
    let trend = null;
    if (readings.length > 2) {
      let values = [readings[readings.length-3].windSpeed, readings[readings.length-2].windSpeed, readings[readings.length-1].windSpeed];
      if (( values[2] > values[1] ) && (values[1] > values[0])) {
        trend = true;
      } else {
        trend = false;
      }
    }
    return trend;
  },
  
  async windFalling(readings) {
    let trend = null;
    if (readings.length > 2) {
      let values = [readings[readings.length-3].windSpeed, readings[readings.length-2].windSpeed, readings[readings.length-1].windSpeed];
      if (( values[2] < values[1] ) && (values[1] < values[0])) {
        trend = true;
      } else {
        trend = false;
      }
    }
    return trend;
  },

  async pressureRising(readings) {
    let trend = null;
    if (readings.length > 2) {
      let values = [readings[readings.length-3].pressure, readings[readings.length-2].pressure, readings[readings.length-1].pressure];
      if (( values[2] > values[1] ) && (values[1] > values[0])) {
        trend = true;
      } else {
        trend = false;
      }
    }
    return trend;
  },
  
  async pressureFalling(readings) {
    let trend = null;
    if (readings.length > 2) {
      let values = [readings[readings.length-3].pressure, readings[readings.length-2].pressure, readings[readings.length-1].pressure];
      if (( values[2] < values[1] ) && (values[1] < values[0])) {
        trend = true;
      } else {
        trend = false;
      }
    }
    return trend;
  },
};