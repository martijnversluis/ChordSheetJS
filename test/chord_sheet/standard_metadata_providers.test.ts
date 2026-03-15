import { configure } from '../../src/formatter/configuration';
import { configurationProviders, staticProviders } from '../../src/chord_sheet/standard_metadata_providers';

describe('standard metadata providers', () => {
  describe('staticProviders', () => {
    const providers = staticProviders();

    it('provides chordpro', () => {
      expect(providers.get('chordpro')!()).toEqual('ChordPro');
    });

    it('provides chordpro.version', () => {
      expect(providers.get('chordpro.version')!()).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('provides today as current date', () => {
      const today = providers.get('today')!();
      expect(today).toMatch(/^\d{4}-\d{2}-\d{2}$/);

      const now = new Date();
      const expected = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
      ].join('-');

      expect(today).toEqual(expected);
    });
  });

  describe('configurationProviders', () => {
    it('includes static providers', () => {
      const configuration = configure({});
      const providers = configurationProviders(configuration);

      expect(providers.get('chordpro')!()).toEqual('ChordPro');
    });

    it('provides instrument values from configuration', () => {
      const configuration = configure({
        instrument: { type: 'guitar', description: 'Guitar, 6 strings, standard tuning' },
      });
      const providers = configurationProviders(configuration);

      expect(providers.get('instrument')!()).toEqual('guitar');
      expect(providers.get('instrument.type')!()).toEqual('guitar');
      expect(providers.get('instrument.description')!()).toEqual('Guitar, 6 strings, standard tuning');
    });

    it('provides tuning from configuration', () => {
      const configuration = configure({
        instrument: { type: 'guitar', tuning: 'E2 A2 D3 G3 B3 E4' },
      });
      const providers = configurationProviders(configuration);

      expect(providers.get('tuning')!()).toEqual('E2 A2 D3 G3 B3 E4');
    });

    it('provides user values from configuration', () => {
      const configuration = configure({
        user: { name: 'johndoe', fullname: 'John Doe' },
      });
      const providers = configurationProviders(configuration);

      expect(providers.get('user')!()).toEqual('johndoe');
      expect(providers.get('user.name')!()).toEqual('johndoe');
      expect(providers.get('user.fullname')!()).toEqual('John Doe');
    });

    it('returns null for missing instrument configuration', () => {
      const configuration = configure({});
      const providers = configurationProviders(configuration);

      expect(providers.get('instrument')!()).toBeNull();
      expect(providers.get('instrument.type')!()).toBeNull();
      expect(providers.get('instrument.description')!()).toBeNull();
      expect(providers.get('tuning')!()).toBeNull();
    });

    it('returns null for missing user configuration', () => {
      const configuration = configure({});
      const providers = configurationProviders(configuration);

      expect(providers.get('user')!()).toBeNull();
      expect(providers.get('user.name')!()).toBeNull();
      expect(providers.get('user.fullname')!()).toBeNull();
    });
  });
});
