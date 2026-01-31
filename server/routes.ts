import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import { registerChatRoutes } from "./replit_integrations/chat";

const WAQI_TOKEN = "demo"; // Use demo token for now, user can replace with their own
const NAGPUR_LAT = 21.1458;
const NAGPUR_LNG = 79.0882;

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Register AI Chat routes
  registerChatRoutes(app);

  // Air Quality Routes
  app.get(api.airQuality.list.path, async (req, res) => {
    try {
      // Fetch real-time data from WAQI API for Nagpur area
      // Bounding box for Nagpur roughly: [21.0, 78.9, 21.3, 79.3]
      const response = await fetch(`https://api.waqi.info/map/bounds/?latlng=21.0,78.9,21.3,79.3&token=${WAQI_TOKEN}`);
      const data = await response.json();

      if (data.status === "ok") {
        // Map WAQI stations to our AirQualityReading format
        const readings = await Promise.all(data.data.map(async (station: any) => {
          // Fetch detailed data for each station to get individual pollutants
          // Note: In a production app, we might want to cache this or fetch selectively
          const detailResponse = await fetch(`https://api.waqi.info/feed/@${station.uid}/?token=${WAQI_TOKEN}`);
          const detailData = await detailResponse.json();
          
          if (detailData.status === "ok") {
            const d = detailData.data;
            return {
              id: station.uid,
              locationName: d.city.name,
              lat: d.city.geo[0],
              lng: d.city.geo[1],
              aqi: d.aqi,
              pm25: d.iaqi?.pm25?.v || null,
              pm10: d.iaqi?.pm10?.v || null,
              no2: d.iaqi?.no2?.v || null,
              o3: d.iaqi?.o3?.v || null,
              so2: d.iaqi?.so2?.v || null,
              co: d.iaqi?.co?.v || null,
              timestamp: new Date(d.time.s)
            };
          }
          return null;
        }));

        const filteredReadings = readings.filter(r => r !== null);
        
        // If we got real readings, use them. Otherwise fallback to storage/seed
        if (filteredReadings.length > 0) {
          return res.json(filteredReadings);
        }
      }
      
      // Fallback to local storage if API fails or returns no data
      const localReadings = await storage.getAirQualityReadings();
      res.json(localReadings);
    } catch (error) {
      console.error("Error fetching real-time AQI:", error);
      const localReadings = await storage.getAirQualityReadings();
      res.json(localReadings);
    }
  });

  app.get(api.airQuality.get.path, async (req, res) => {
    try {
      const stationId = req.params.id;
      const response = await fetch(`https://api.waqi.info/feed/@${stationId}/?token=${WAQI_TOKEN}`);
      const data = await response.json();

      if (data.status === "ok") {
        const d = data.data;
        return res.json({
          id: stationId,
          locationName: d.city.name,
          lat: d.city.geo[0],
          lng: d.city.geo[1],
          aqi: d.aqi,
          pm25: d.iaqi?.pm25?.v || null,
          pm10: d.iaqi?.pm10?.v || null,
          no2: d.iaqi?.no2?.v || null,
          o3: d.iaqi?.o3?.v || null,
          so2: d.iaqi?.so2?.v || null,
          co: d.iaqi?.co?.v || null,
          timestamp: new Date(d.time.s)
        });
      }

      const reading = await storage.getAirQualityReading(Number(req.params.id));
      if (!reading) {
        return res.status(404).json({ message: "Reading not found" });
      }
      res.json(reading);
    } catch (error) {
      const reading = await storage.getAirQualityReading(Number(req.params.id));
      if (!reading) {
        return res.status(404).json({ message: "Reading not found" });
      }
      res.json(reading);
    }
  });

  // Seed data function (called internally if DB is empty)
  seedDatabase();

  return httpServer;
}

async function seedDatabase() {
  const existingReadings = await storage.getAirQualityReadings();
  if (existingReadings.length === 0) {
    console.log("Seeding database with Nagpur air quality data...");
    
    const nagpurReadings = [
      {
        locationName: "Sitabuldi, Nagpur",
        lat: 21.1458,
        lng: 79.0882,
        aqi: 152, // Unhealthy
        pm25: 65.2,
        pm10: 120.5,
        no2: 45.1,
        o3: 20.3,
        so2: 12.4,
        co: 1.2
      },
      {
        locationName: "Sonegaon, Nagpur",
        lat: 21.1098,
        lng: 79.0682,
        aqi: 85, // Moderate
        pm25: 28.5,
        pm10: 55.2,
        no2: 18.4,
        o3: 35.1,
        so2: 5.2,
        co: 0.8
      },
      {
        locationName: "Itwari, Nagpur",
        lat: 21.1622,
        lng: 79.1175,
        aqi: 210, // Very Unhealthy
        pm25: 110.5,
        pm10: 185.2,
        no2: 68.9,
        o3: 15.2,
        so2: 25.4,
        co: 2.1
      },
      {
        locationName: "Dharampeth, Nagpur",
        lat: 21.1396,
        lng: 79.0583,
        aqi: 115, // Unhealthy for Sensitive Groups
        pm25: 42.1,
        pm10: 85.6,
        no2: 32.5,
        o3: 28.4,
        so2: 8.9,
        co: 1.0
      },
      {
        locationName: "Ambazari, Nagpur",
        lat: 21.1332,
        lng: 79.0345,
        aqi: 45, // Good
        pm25: 10.2,
        pm10: 25.4,
        no2: 12.1,
        o3: 42.5,
        so2: 3.2,
        co: 0.5
      }
    ];

    for (const reading of nagpurReadings) {
      await storage.createAirQualityReading(reading);
    }
    console.log("Seeding complete!");
  }
}
