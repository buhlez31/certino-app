import { InverterAdapter, StandardizedEnergyData } from './InverterAdapter';

export class SmaAdapter implements InverterAdapter {
  providerName = 'SMA';

  async fetchGeneration(
    credentials: string,
    siteId: string,
    gpsLat: number,
    gpsLong: number,
    startTime: number,
    endTime: number,
    fuelType: string
  ): Promise<StandardizedEnergyData> {
    console.log(`[${this.providerName}] Fetching energy generation data for site ${siteId}`);
    
    // Calculate simulated kWh based on hours elapsed
    const hours = (endTime - startTime) / 3600;
    // Assume an average of 2.5 kW generated per hour
    const kwhProduced = parseFloat(((Math.random() * 1.5 + 1.5) * hours).toFixed(3));
    
    const startDate = new Date(startTime * 1000);
    const dateStr = startDate.toISOString().split('T')[0];
    const hourStr = startDate.toISOString().split('T')[1].substring(0, 5);

    return {
      Input: {
        GPS_Lat: gpsLat,
        GPS_Long: gpsLong,
        Date: dateStr,
        Hour: hourStr,
      },
      Output: {
        kWh_produced: kwhProduced,
      },
      Metadata: {
        DeviceID: siteId,
        Timestamp: new Date().toISOString(),
        FuelType: fuelType,
      },
    };
  }
}
