import Configuration from '../formatter/configuration';

type Provider = () => string | null;

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function staticProviders(): Map<string, Provider> {
  const providers = new Map<string, Provider>();
  providers.set('chordpro', () => 'ChordPro');
  providers.set('chordpro.version', () => '14.0.0');
  providers.set('today', () => formatDate(new Date()));
  return providers;
}

export function configurationProviders(configuration: Configuration): Map<string, Provider> {
  const providers = staticProviders();
  const { instrument, user } = configuration;

  providers.set('instrument', () => instrument?.type ?? null);
  providers.set('instrument.type', () => instrument?.type ?? null);
  providers.set('instrument.description', () => instrument?.description ?? null);
  providers.set('tuning', () => instrument?.tuning ?? null);
  providers.set('user', () => user?.name ?? null);
  providers.set('user.name', () => user?.name ?? null);
  providers.set('user.fullname', () => user?.fullname ?? null);

  return providers;
}
