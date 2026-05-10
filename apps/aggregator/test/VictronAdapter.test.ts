import { VictronAdapter } from '../src/inverters/VictronAdapter';

describe('VictronAdapter', () => {
  let adapter: VictronAdapter;

  beforeEach(() => {
    adapter = new VictronAdapter();
  });

  it('should fetch and normalize data to the EnergyTag JSON schema', async () => {
    const mockCredentials = 'test-token';
    const mockSiteId = '12345';
    const mockLat = 50.0755;
    const mockLong = 14.4378;
    const mockStart = 1715126400; // May 8, 2026, 00:00:00 UTC
    const mockEnd = 1715212800;

    // We no longer mock fetch since the adapter uses a random mock generator

    const result = await adapter.fetchGeneration(
      mockCredentials,
      mockSiteId,
      mockLat,
      mockLong,
      mockStart,
      mockEnd,
      'Solar'
    );

    // Verify normalization
    expect(result.Input.GPS_Lat).toBe(mockLat);
    
    // The kwh_produced is mocked as a random value between 1.5 and 3.0 per hour
    // For 24 hours (86400 seconds), it should be between 36 and 72
    expect(result.Output.kWh_produced).toBeGreaterThanOrEqual(36);
    expect(result.Output.kWh_produced).toBeLessThanOrEqual(72);
    expect(result.Metadata.FuelType).toBe('Solar');
    expect(result.Metadata.DeviceID).toBe(mockSiteId);
    
    // The timestamp string is generated dynamically, but should be a valid ISO string
    expect(new Date(result.Metadata.Timestamp).getTime()).not.toBeNaN();
  });
});
