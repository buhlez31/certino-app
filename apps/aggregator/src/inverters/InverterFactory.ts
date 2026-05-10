import { InverterAdapter } from './InverterAdapter';
import { VictronAdapter } from './VictronAdapter';
import { SmaAdapter } from './SmaAdapter';
import { FroniusAdapter } from './FroniusAdapter';
import { HuaweiAdapter } from './HuaweiAdapter';
import { SolarEdgeAdapter } from './SolarEdgeAdapter';
import { EnphaseAdapter } from './EnphaseAdapter';
import { ThingSpeakAdapter } from './ThingSpeakAdapter';

export class InverterFactory {
  static getAdapter(providerName: string): InverterAdapter {
    switch (providerName.toLowerCase()) {
      case 'victron':
        return new VictronAdapter();
      case 'sma':
        return new SmaAdapter();
      case 'fronius':
        return new FroniusAdapter();
      case 'huawei':
        return new HuaweiAdapter();
      case 'solaredge':
        return new SolarEdgeAdapter();
      case 'enphase':
        return new EnphaseAdapter();
      case 'thingspeak':
        return new ThingSpeakAdapter();
      default:
        throw new Error(`Unsupported inverter provider: ${providerName}`);
    }
  }
}
