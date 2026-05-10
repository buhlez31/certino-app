export interface EnergyTagMetadata {
  DeviceID: string;
  Timestamp: string;
  FuelType: string;
}

export interface StandardizedEnergyData {
  Input: {
    GPS_Lat: number;
    GPS_Long: number;
    Date: string; // YYYY-MM-DD
    Hour: string; // HH:mm
  };
  Output: {
    kWh_produced: number;
  };
  Metadata: EnergyTagMetadata;
}

export interface InverterAdapter {
  providerName: string;

  /**
   * Fetch energy generation for a specific time window and standardize it.
   * @param credentials API token or encrypted credentials string
   * @param siteId Provider's internal ID for the solar installation
   * @param gpsLat Latitude
   * @param gpsLong Longitude
   * @param startTime Unix timestamp for start
   * @param endTime Unix timestamp for end
   * @returns Standardized EnergyTag JSON payload
   */
  fetchGeneration(
    credentials: string,
    siteId: string,
    gpsLat: number,
    gpsLong: number,
    startTime: number,
    endTime: number,
    fuelType: string
  ): Promise<StandardizedEnergyData>;
}
