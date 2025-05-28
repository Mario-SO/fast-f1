import { OpenF1Service, OpenF1Driver, OpenF1Position, OpenF1Interval, OpenF1CarData, OpenF1Weather, OpenF1RaceControl, OpenF1Lap } from './openf1.service.ts';

// Enhanced interfaces for live dashboard
export interface Driver {
  pos: number;
  driver: string;
  team: string;
  gap: string;
  lastLap: string;
  status: "green" | "yellow" | "red";
  driverNumber: number;
  teamColor: string;
  speed?: number;
  drs?: string;
  gear?: number;
  throttle?: number;
  brake?: number;
  // Enhanced driver details
  fullName?: string;
  firstName?: string;
  lastName?: string;
  headshotUrl?: string;
  countryCode?: string;
  broadcastName?: string;
}

export interface SessionInfo {
  event: string;
  session: string;
  weather: string;
  trackTemp: string;
  trackStatus: {
    flag: "green" | "yellow" | "red" | "safety";
    message: string;
    description: string;
  };
  circuit: string;
  location: string;
  sessionKey: number;
}

export interface DashboardStats {
  currentLeader: {
    driver: string;
    team: string;
  };
  fastestLap: {
    time: string;
    driver: string;
  };
  lapProgress: {
    current: number;
    total: number;
    percentage: number;
  };
  totalDrivers: number;
}

export interface WeatherData {
  airTemp: number;
  trackTemp: number;
  humidity: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  rainfall: boolean;
}

export interface RaceControlMessage {
  time: string;
  category: string;
  message: string;
  flag?: string;
  driver?: string;
}

export class LiveDashboardService {
  private static cachedData: any = null;
  private static lastFetch: number = 0;
  private static readonly CACHE_DURATION = 3000; // 3 seconds cache
  private static lastValidPositions: Driver[] = []; // Cache for last valid position data

  // Get live data with caching
  static async getLiveData(sessionKey?: number) {
    const now = Date.now();
    
    // Return cached data if it's fresh and valid
    if (this.cachedData && (now - this.lastFetch) < this.CACHE_DURATION) {
      console.log('LiveDashboardService: Using cached data');
      return this.cachedData;
    }

    console.log('LiveDashboardService: Fetching fresh data from OpenF1');
    
    try {
      const data = await OpenF1Service.getLiveData(sessionKey);
      
      // Only cache if we got valid data
      if (data && data.drivers && Array.isArray(data.drivers) && data.drivers.length > 0) {
        this.cachedData = data;
        this.lastFetch = now;
        console.log('LiveDashboardService: Cached fresh data with', data.drivers.length, 'drivers');
      } else {
        console.log('LiveDashboardService: Received invalid data, not caching');
        // If we have cached data, return it instead of empty data
        if (this.cachedData) {
          console.log('LiveDashboardService: Returning previous cached data');
          return this.cachedData;
        }
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching live data:', error);
      // Return cached data if available, otherwise return mock data
      if (this.cachedData) {
        console.log('LiveDashboardService: Error occurred, returning cached data');
        return this.cachedData;
      }
      console.log('LiveDashboardService: Error occurred, no cache available, returning mock data');
      return this.getMockLiveData();
    }
  }

  // Convert OpenF1 data to dashboard format
  static async getDriversWithLiveData(sessionKey?: number): Promise<Driver[]> {
    try {
      const liveData = await this.getLiveData(sessionKey);
      const { drivers, positions, intervals, carData, laps } = liveData;

      console.log('LiveDashboardService: Raw data counts:', {
        drivers: Array.isArray(drivers) ? drivers.length : 'not array',
        positions: Array.isArray(positions) ? positions.length : 'not array',
        intervals: Array.isArray(intervals) ? intervals.length : 'not array',
        carData: Array.isArray(carData) ? carData.length : 'not array',
        laps: Array.isArray(laps) ? laps.length : 'not array'
      });

      // If no drivers data, return mock data
      if (!Array.isArray(drivers) || drivers.length === 0) {
        console.log('LiveDashboardService: No drivers data, returning mock data');
        return this.getMockDrivers();
      }

      // Create a map of latest car data by driver
      const latestCarData = new Map<number, OpenF1CarData>();
      if (Array.isArray(carData)) {
        carData.forEach((data: OpenF1CarData) => {
          const existing = latestCarData.get(data.driver_number);
          if (!existing || new Date(data.date) > new Date(existing.date)) {
            latestCarData.set(data.driver_number, data);
          }
        });
      }

      // Create maps for quick lookup
      const positionMap = new Map<number, OpenF1Position>();
      if (Array.isArray(positions)) {
        positions.forEach((pos: OpenF1Position) => {
          const existing = positionMap.get(pos.driver_number);
          if (!existing || new Date(pos.date) > new Date(existing.date)) {
            positionMap.set(pos.driver_number, pos);
          }
        });
      }

      const intervalMap = new Map<number, OpenF1Interval>();
      if (Array.isArray(intervals)) {
        intervals.forEach((interval: OpenF1Interval) => {
          intervalMap.set(interval.driver_number, interval);
        });
      }

      const lapMap = new Map<number, OpenF1Lap>();
      if (Array.isArray(laps)) {
        laps.forEach((lap: OpenF1Lap) => {
          lapMap.set(lap.driver_number, lap);
        });
      }

      // Combine all data
      const driversWithData: Driver[] = drivers.map((driver: OpenF1Driver) => {
        const position = positionMap.get(driver.driver_number);
        const interval = intervalMap.get(driver.driver_number);
        const lap = lapMap.get(driver.driver_number);
        const carDataPoint = latestCarData.get(driver.driver_number);

        return {
          pos: position?.position || 0,
          driver: driver.name_acronym,
          team: driver.team_name,
          gap: OpenF1Service.formatGap(interval?.gap_to_leader || null),
          lastLap: OpenF1Service.formatLapTime(lap?.lap_duration),
          status: this.getDriverStatus(carDataPoint, lap),
          driverNumber: driver.driver_number,
          teamColor: `#${driver.team_colour}`,
          speed: carDataPoint?.speed,
          drs: carDataPoint ? OpenF1Service.getDRSStatus(carDataPoint.drs) : undefined,
          gear: carDataPoint?.n_gear,
          throttle: carDataPoint?.throttle,
          brake: carDataPoint?.brake,
          fullName: driver.full_name,
          firstName: driver.first_name,
          lastName: driver.last_name,
          headshotUrl: driver.headshot_url,
          countryCode: driver.country_code,
          broadcastName: driver.broadcast_name
        };
      });

      // Validate position data - if all positions are 0, it's likely invalid data
      const validPositions = driversWithData.filter(d => d.pos > 0);
      const hasValidPositions = validPositions.length > 0;
      
      console.log('LiveDashboardService: Position validation:', {
        totalDrivers: driversWithData.length,
        validPositions: validPositions.length,
        hasValidPositions
      });

      // If we have invalid position data, try to use cached data or assign fallback positions
      if (!hasValidPositions) {
        console.log('LiveDashboardService: Invalid position data detected, attempting to use last valid positions');
        
        if (this.lastValidPositions.length > 0) {
          console.log('LiveDashboardService: Using last valid position data');
          // Update current data with last valid positions but keep other live data
          driversWithData.forEach(driver => {
            const lastValidDriver = this.lastValidPositions.find(c => c.driverNumber === driver.driverNumber);
            if (lastValidDriver) {
              driver.pos = lastValidDriver.pos;
              // Also update gap if it's missing
              if (driver.gap === '--:--:---' && lastValidDriver.gap !== '--:--:---') {
                driver.gap = lastValidDriver.gap;
              }
            }
          });
        } else {
          console.log('LiveDashboardService: No valid cached positions, assigning sequential positions');
          // Assign sequential positions as fallback
          driversWithData.forEach((driver, index) => {
            driver.pos = index + 1;
            if (driver.gap === '--:--:---') {
              driver.gap = index === 0 ? 'Leader' : `+${(index * 0.5).toFixed(1)}s`;
            }
          });
        }
      } else {
        // Store valid position data for future use
        this.lastValidPositions = driversWithData.map(d => ({ ...d }));
        console.log('LiveDashboardService: Stored valid position data for', this.lastValidPositions.length, 'drivers');
      }

      // Sort by position (now guaranteed to have valid positions)
      const sortedDrivers = driversWithData.sort((a, b) => a.pos - b.pos);
      
      console.log('LiveDashboardService: Final driver count:', sortedDrivers.length);
      console.log('LiveDashboardService: Driver positions:', sortedDrivers.map(d => `${d.pos}: ${d.driver}`));
      
      return sortedDrivers;
    } catch (error) {
      console.error('Error getting drivers with live data:', error);
      return this.getMockDrivers();
    }
  }

  // Determine driver status based on car data and lap info
  private static getDriverStatus(carData?: OpenF1CarData, lap?: OpenF1Lap): "green" | "yellow" | "red" {
    if (!carData) return "yellow";
    
    // Red if car is stopped (very low speed and no throttle)
    if (carData.speed < 50 && carData.throttle < 10) return "red";
    
    // Yellow if pit out lap
    if (lap?.is_pit_out_lap) return "yellow";
    
    return "green";
  }

  // Get session info with live data
  static async getSessionInfo(sessionKey?: number): Promise<SessionInfo> {
    try {
      const liveData = await this.getLiveData(sessionKey);
      const { session, weather, raceControl } = liveData;

      if (!session) {
        return this.getMockSessionInfo();
      }

      // Get latest race control messages for track status
      const trackStatus = this.getEnhancedTrackStatus(raceControl, session);

      return {
        event: session.country_name || "Unknown Event",
        session: session.session_name || "Unknown Session",
        weather: weather ? `${Math.round(weather.air_temperature)}°C` : "N/A",
        trackTemp: weather ? `${Math.round(weather.track_temperature)}°C` : "N/A",
        trackStatus,
        circuit: session.circuit_short_name || "Unknown Circuit",
        location: session.location || "Unknown Location",
        sessionKey: session.session_key
      };
    } catch (error) {
      console.error('Error getting session info:', error);
      return this.getMockSessionInfo();
    }
  }

  // Enhanced track status with better logic
  private static getEnhancedTrackStatus(raceControl?: OpenF1RaceControl[], session?: any): SessionInfo['trackStatus'] {
    // If no race control data, determine status based on session timing
    if (!raceControl || !Array.isArray(raceControl) || raceControl.length === 0) {
      return this.getSessionBasedStatus(session);
    }

    // Sort race control messages by date (most recent first)
    const sortedMessages = raceControl.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    // Look for the most recent relevant message
    for (const message of sortedMessages) {
      const flag = message.flag?.toLowerCase();
      const category = message.category?.toLowerCase();
      const messageText = message.message?.toLowerCase();

      // Red flag conditions
      if (flag?.includes('red') || messageText?.includes('red flag')) {
        return {
          flag: "red",
          message: "Session Stopped",
          description: message.message || "Red flag - Session suspended"
        };
      }

      // Safety car conditions
      if (category?.includes('safetycar') || messageText?.includes('safety car')) {
        return {
          flag: "safety",
          message: "Safety Car",
          description: message.message || "Safety car deployed"
        };
      }

      // Yellow flag conditions
      if (flag?.includes('yellow') || messageText?.includes('yellow')) {
        return {
          flag: "yellow",
          message: "Caution",
          description: message.message || "Yellow flag - Caution"
        };
      }

      // Virtual Safety Car
      if (messageText?.includes('virtual safety car') || messageText?.includes('vsc')) {
        return {
          flag: "yellow",
          message: "Virtual Safety Car",
          description: message.message || "Virtual Safety Car deployed"
        };
      }

      // DRS related messages
      if (messageText?.includes('drs')) {
        continue; // Skip DRS messages for track status
      }

      // Track limits
      if (messageText?.includes('track limits')) {
        continue; // Skip track limits for overall track status
      }
    }

    // If we have recent messages but none indicate danger, assume green
    const recentMessage = sortedMessages[0];
    if (recentMessage && this.isRecentMessage(recentMessage.date)) {
      return {
        flag: "green",
        message: "Track Clear",
        description: "Normal racing conditions"
      };
    }

    // Fallback to session-based status
    return this.getSessionBasedStatus(session);
  }

  // Determine status based on session timing and type
  private static getSessionBasedStatus(session?: any): SessionInfo['trackStatus'] {
    if (!session) {
      return {
        flag: "yellow",
        message: "No Session Data",
        description: "Unable to determine track status"
      };
    }

    const now = new Date();
    const sessionStart = session.date_start ? new Date(session.date_start) : null;
    const sessionEnd = session.date_end ? new Date(session.date_end) : null;

    // Check if session is currently active
    if (sessionStart && sessionEnd) {
      if (now < sessionStart) {
        return {
          flag: "yellow",
          message: "Session Not Started",
          description: `${session.session_name} starts at ${sessionStart.toLocaleTimeString()}`
        };
      } else if (now > sessionEnd) {
        return {
          flag: "yellow",
          message: "Session Ended",
          description: `${session.session_name} ended at ${sessionEnd.toLocaleTimeString()}`
        };
      } else {
        // Session is active
        return {
          flag: "green",
          message: "Session Active",
          description: `${session.session_name} in progress`
        };
      }
    }

    // Default status when we can't determine timing
    return {
      flag: "green",
      message: "Track Status Unknown",
      description: "Live data may not be available"
    };
  }

  // Check if a message is recent (within last 5 minutes)
  private static isRecentMessage(dateString: string): boolean {
    const messageDate = new Date(dateString);
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    return messageDate > fiveMinutesAgo;
  }

  // Get track status from race control
  private static getTrackStatus(raceControl?: OpenF1RaceControl): SessionInfo['trackStatus'] {
    if (!raceControl) {
      return {
        flag: "green",
        message: "Track Clear",
        description: "Normal racing conditions"
      };
    }

    const flag = raceControl.flag?.toLowerCase();
    
    if (flag?.includes('yellow')) {
      return {
        flag: "yellow",
        message: raceControl.message,
        description: "Caution - Yellow Flag"
      };
    } else if (flag?.includes('red')) {
      return {
        flag: "red",
        message: raceControl.message,
        description: "Session Stopped - Red Flag"
      };
    } else if (raceControl.category === 'SafetyCar') {
      return {
        flag: "safety",
        message: raceControl.message,
        description: "Safety Car Deployed"
      };
    }

    return {
      flag: "green",
      message: raceControl.message || "Track Clear",
      description: "Normal racing conditions"
    };
  }

  // Get dashboard stats with live data
  static async getDashboardStats(sessionKey?: number): Promise<DashboardStats> {
    try {
      const drivers = await this.getDriversWithLiveData(sessionKey);
      
      if (drivers.length === 0) {
        return this.getMockDashboardStats();
      }

      const leader = drivers[0];
      
      // Find fastest lap
      const driversWithLapTimes = drivers.filter(d => d.lastLap !== '--:--:---');
      let fastestLap = { time: '99:99.999', driver: 'N/A' };
      
      if (driversWithLapTimes.length > 0) {
        const fastest = driversWithLapTimes.reduce((prev, current) => {
          return prev.lastLap < current.lastLap ? prev : current;
        });
        fastestLap = { time: fastest.lastLap, driver: fastest.driver };
      }

      return {
        currentLeader: {
          driver: leader.driver,
          team: leader.team
        },
        fastestLap,
        lapProgress: {
          current: 1, // This would need to be calculated from session data
          total: 50,  // This would need to come from session configuration
          percentage: 2
        },
        totalDrivers: drivers.length
      };
    } catch (error) {
      console.error('Error getting dashboard stats:', error);
      return this.getMockDashboardStats();
    }
  }

  // Get weather data
  static async getWeatherData(sessionKey?: number): Promise<WeatherData | null> {
    try {
      const liveData = await this.getLiveData(sessionKey);
      const { weather } = liveData;

      if (!weather) return null;

      return {
        airTemp: weather.air_temperature,
        trackTemp: weather.track_temperature,
        humidity: weather.humidity,
        windSpeed: weather.wind_speed,
        windDirection: weather.wind_direction,
        pressure: weather.pressure,
        rainfall: weather.rainfall > 0
      };
    } catch (error) {
      console.error('Error getting weather data:', error);
      return null;
    }
  }

  // Get race control messages
  static async getRaceControlMessages(sessionKey?: number): Promise<RaceControlMessage[]> {
    try {
      const liveData = await this.getLiveData(sessionKey);
      const { raceControl, drivers } = liveData;

      // If no race control data, return empty array
      if (!Array.isArray(raceControl) || raceControl.length === 0) {
        return [];
      }

      const driverMap = new Map<number, string>();
      if (Array.isArray(drivers)) {
        drivers.forEach((driver: OpenF1Driver) => {
          driverMap.set(driver.driver_number, driver.name_acronym);
        });
      }

      return raceControl.map((msg: OpenF1RaceControl) => ({
        time: new Date(msg.date).toLocaleTimeString(),
        category: msg.category,
        message: msg.message,
        flag: msg.flag,
        driver: msg.driver_number ? driverMap.get(msg.driver_number) : undefined
      }));
    } catch (error) {
      console.error('Error getting race control messages:', error);
      return [];
    }
  }

  // Utility method to split drivers into columns
  static splitDriversIntoColumns(drivers: Driver[]): { left: Driver[], right: Driver[] } {
    const midpoint = Math.ceil(drivers.length / 2);
    return {
      left: drivers.slice(0, midpoint),
      right: drivers.slice(midpoint)
    };
  }

  // Mock data fallbacks (keeping existing mock methods for fallback)
  static getMockDrivers(): Driver[] {
    return [
      {
        pos: 1,
        driver: "VER",
        team: "Red Bull",
        gap: "Leader",
        lastLap: "1:18.456",
        status: "green",
        driverNumber: 1,
        teamColor: "#3671C6"
      },
      {
        pos: 2,
        driver: "LEC",
        team: "Ferrari",
        gap: "+0.333",
        lastLap: "1:18.789",
        status: "green",
        driverNumber: 16,
        teamColor: "#F91536"
      },
      // ... rest of mock drivers
    ];
  }

  private static getMockSessionInfo(): SessionInfo {
    return {
      event: "Singapore Grand Prix",
      session: "Race",
      weather: "28°C",
      trackTemp: "35°C",
      trackStatus: {
        flag: "green",
        message: "Session Active",
        description: "Race in progress - Normal racing conditions"
      },
      circuit: "Marina Bay",
      location: "Singapore",
      sessionKey: 0
    };
  }

  private static getMockDashboardStats(): DashboardStats {
    return {
      currentLeader: {
        driver: "VER",
        team: "Red Bull Racing"
      },
      fastestLap: {
        time: "1:18.123",
        driver: "LEC"
      },
      lapProgress: {
        current: 15,
        total: 61,
        percentage: 25
      },
      totalDrivers: 20
    };
  }

  private static getMockLiveData() {
    return {
      session: null,
      drivers: [],
      positions: [],
      intervals: [],
      carData: [],
      weather: null,
      raceControl: [],
      laps: [],
      sessionKey: 0
    };
  }
} 