// OpenF1 API Service for fetching live Formula 1 data
export interface OpenF1Driver {
  broadcast_name: string;
  country_code: string;
  driver_number: number;
  first_name: string;
  full_name: string;
  headshot_url: string;
  last_name: string;
  meeting_key: number;
  name_acronym: string;
  session_key: number;
  team_colour: string;
  team_name: string;
}

export interface OpenF1Position {
  date: string;
  driver_number: number;
  meeting_key: number;
  position: number;
  session_key: number;
}

export interface OpenF1Interval {
  date: string;
  driver_number: number;
  gap_to_leader: number | null;
  interval: number | null;
  meeting_key: number;
  session_key: number;
}

export interface OpenF1CarData {
  brake: number;
  date: string;
  driver_number: number;
  drs: number;
  meeting_key: number;
  n_gear: number;
  rpm: number;
  session_key: number;
  speed: number;
  throttle: number;
}

export interface OpenF1Session {
  circuit_key: number;
  circuit_short_name: string;
  country_code: string;
  country_key: number;
  country_name: string;
  date_end: string;
  date_start: string;
  gmt_offset: string;
  location: string;
  meeting_key: number;
  session_key: number;
  session_name: string;
  session_type: string;
  year: number;
}

export interface OpenF1Weather {
  air_temperature: number;
  date: string;
  humidity: number;
  meeting_key: number;
  pressure: number;
  rainfall: number;
  session_key: number;
  track_temperature: number;
  wind_direction: number;
  wind_speed: number;
}

export interface OpenF1RaceControl {
  category: string;
  date: string;
  driver_number?: number;
  flag?: string;
  lap_number?: number;
  meeting_key: number;
  message: string;
  scope: string;
  sector?: number;
  session_key: number;
}

export interface OpenF1Lap {
  date_start: string;
  driver_number: number;
  duration_sector_1?: number;
  duration_sector_2?: number;
  duration_sector_3?: number;
  i1_speed?: number;
  i2_speed?: number;
  is_pit_out_lap: boolean;
  lap_duration?: number;
  lap_number: number;
  meeting_key: number;
  segments_sector_1?: number[];
  segments_sector_2?: number[];
  segments_sector_3?: number[];
  session_key: number;
  st_speed?: number;
}

export class OpenF1Service {
  private static readonly BASE_URL = 'https://api.openf1.org/v1';
  
  // Check if a session is currently live
  static async isSessionLive(session?: OpenF1Session): Promise<boolean> {
    try {
      // If no session provided, get the latest one
      const currentSession = session || await this.getLatestSession();
      if (!currentSession) return false;

      const now = new Date();
      const sessionStart = new Date(currentSession.date_start);
      const sessionEnd = new Date(currentSession.date_end);

      // Check if we're within the session time window
      const isWithinTimeWindow = now >= sessionStart && now <= sessionEnd;
      
      // For races and qualifying, also check for recent data activity
      if (currentSession.session_type === 'Race' || currentSession.session_type === 'Qualifying') {
        // Check for recent intervals data (only available during live sessions)
        const intervals = await this.getIntervals(currentSession.session_key);
        if (intervals.length > 0) {
          // Check if we have intervals data from the last 2 minutes
          const latestInterval = intervals[intervals.length - 1];
          const intervalTime = new Date(latestInterval.date);
          const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
          
          return intervalTime > twoMinutesAgo;
        }
      }

      // For practice sessions, check for recent car data
      if (currentSession.session_type === 'Practice') {
        const carData = await this.getLatestCarData(currentSession.session_key);
        if (carData.length > 0) {
          // Check if we have car data from the last 2 minutes
          const latestCarData = carData[carData.length - 1];
          const carDataTime = new Date(latestCarData.date);
          const twoMinutesAgo = new Date(now.getTime() - 2 * 60 * 1000);
          
          return carDataTime > twoMinutesAgo;
        }
      }

      // Fallback to time window check
      return isWithinTimeWindow;
    } catch (error) {
      console.error('Error checking if session is live:', error);
      return false;
    }
  }

  // Get the latest session
  static async getLatestSession(): Promise<OpenF1Session | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/sessions?session_key=latest`);
      if (!response.ok) return null;
      const sessions = await response.json() as OpenF1Session[];
      return Array.isArray(sessions) && sessions.length > 0 ? sessions[0] : null;
    } catch (error) {
      console.error('Error fetching latest session:', error);
      return null;
    }
  }

  // Get drivers for a session
  static async getDrivers(sessionKey: number): Promise<OpenF1Driver[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/drivers?session_key=${sessionKey}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data as OpenF1Driver[] : [];
    } catch (error) {
      console.error('Error fetching drivers:', error);
      return [];
    }
  }

  // Get current positions
  static async getPositions(sessionKey: number): Promise<OpenF1Position[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/position?session_key=${sessionKey}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data as OpenF1Position[] : [];
    } catch (error) {
      console.error('Error fetching positions:', error);
      return [];
    }
  }

  // Get intervals (gaps between drivers)
  static async getIntervals(sessionKey: number): Promise<OpenF1Interval[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/intervals?session_key=${sessionKey}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data as OpenF1Interval[] : [];
    } catch (error) {
      console.error('Error fetching intervals:', error);
      return [];
    }
  }

  // Get latest car data for all drivers
  static async getLatestCarData(sessionKey: number): Promise<OpenF1CarData[]> {
    try {
      // Get data from the last 30 seconds
      const thirtySecondsAgo = new Date(Date.now() - 30000).toISOString();
      const response = await fetch(`${this.BASE_URL}/car_data?session_key=${sessionKey}&date>=${thirtySecondsAgo}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data as OpenF1CarData[] : [];
    } catch (error) {
      console.error('Error fetching car data:', error);
      return [];
    }
  }

  // Get weather data
  static async getWeather(sessionKey: number): Promise<OpenF1Weather | null> {
    try {
      const response = await fetch(`${this.BASE_URL}/weather?session_key=${sessionKey}`);
      if (!response.ok) return null;
      const data = await response.json();
      const weather = Array.isArray(data) ? data as OpenF1Weather[] : [];
      return weather.length > 0 ? weather[weather.length - 1] : null;
    } catch (error) {
      console.error('Error fetching weather:', error);
      return null;
    }
  }

  // Get race control messages
  static async getRaceControl(sessionKey: number, limit: number = 10): Promise<OpenF1RaceControl[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/race_control?session_key=${sessionKey}`);
      if (!response.ok) return [];
      const data = await response.json();
      const raceControl = Array.isArray(data) ? data as OpenF1RaceControl[] : [];
      return raceControl.slice(-limit).reverse(); // Get latest messages
    } catch (error) {
      console.error('Error fetching race control:', error);
      return [];
    }
  }

  // Get latest lap times
  static async getLatestLaps(sessionKey: number): Promise<OpenF1Lap[]> {
    try {
      const response = await fetch(`${this.BASE_URL}/laps?session_key=${sessionKey}`);
      if (!response.ok) return [];
      const data = await response.json();
      const laps = Array.isArray(data) ? data as OpenF1Lap[] : [];
      
      // Group by driver and get latest lap for each
      const latestLaps = new Map<number, OpenF1Lap>();
      laps.forEach(lap => {
        const existing = latestLaps.get(lap.driver_number);
        if (!existing || lap.lap_number > existing.lap_number) {
          latestLaps.set(lap.driver_number, lap);
        }
      });
      
      return Array.from(latestLaps.values());
    } catch (error) {
      console.error('Error fetching laps:', error);
      return [];
    }
  }

  // Get comprehensive live data for dashboard
  static async getLiveData(sessionKey?: number) {
    try {
      // If no session key provided, get the latest session
      let currentSessionKey = sessionKey;
      let session = null;
      
      if (!currentSessionKey) {
        session = await this.getLatestSession();
        if (!session) {
          // Return mock data structure instead of throwing error
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
        currentSessionKey = session.session_key;
      }

      // Fetch all data in parallel
      const [
        sessionData,
        drivers,
        positions,
        intervals,
        carData,
        weather,
        raceControl,
        laps
      ] = await Promise.all([
        session || this.getLatestSession(),
        this.getDrivers(currentSessionKey),
        this.getPositions(currentSessionKey),
        this.getIntervals(currentSessionKey),
        this.getLatestCarData(currentSessionKey),
        this.getWeather(currentSessionKey),
        this.getRaceControl(currentSessionKey),
        this.getLatestLaps(currentSessionKey)
      ]);

      return {
        session: sessionData,
        drivers: drivers || [],
        positions: positions || [],
        intervals: intervals || [],
        carData: carData || [],
        weather,
        raceControl: raceControl || [],
        laps: laps || [],
        sessionKey: currentSessionKey
      };
    } catch (error) {
      console.error('Error fetching live data:', error);
      // Return empty data structure instead of throwing
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

  // Format time gap for display
  static formatGap(gap: number | null): string {
    if (gap === null) return 'Leader';
    if (gap > 60) return '+1 LAP';
    return `+${gap.toFixed(3)}`;
  }

  // Format lap time for display
  static formatLapTime(seconds: number | undefined): string {
    if (!seconds) return '--:--:---';
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toFixed(3).padStart(6, '0')}`;
  }

  // Get DRS status interpretation
  static getDRSStatus(drsValue: number): string {
    switch (drsValue) {
      case 0:
      case 1:
        return 'OFF';
      case 8:
        return 'ELIGIBLE';
      case 10:
      case 12:
      case 14:
        return 'ON';
      default:
        return 'UNKNOWN';
    }
  }
} 