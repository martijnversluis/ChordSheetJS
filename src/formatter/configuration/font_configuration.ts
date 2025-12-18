export interface FontConfiguration {
  name: string;
  style: string;
  size: number;
  color: string;
}

export interface FontConfigurations {
  title: FontConfiguration;
  subtitle: FontConfiguration;
  body: FontConfiguration;
  chord: FontConfiguration;
  lyrics: FontConfiguration;
  comment: FontConfiguration;
  header: FontConfiguration;
  footer: FontConfiguration;
  metadata: FontConfiguration;
}

export const defaultFontConfigurations: FontConfigurations = {
  title: {
    name: 'Helvetica',
    style: 'bold',
    size: 18,
    color: '#000000',
  },
  subtitle: {
    name: 'Helvetica',
    style: 'normal',
    size: 14,
    color: '#000000',
  },
  body: {
    name: 'Helvetica',
    style: 'normal',
    size: 12,
    color: '#000000',
  },
  chord: {
    name: 'Helvetica',
    style: 'bold',
    size: 13,
    color: '#000000',
  },
  lyrics: {
    name: 'Helvetica',
    style: 'normal',
    size: 13,
    color: '#000000',
  },
  comment: {
    name: 'Helvetica',
    style: 'italic',
    size: 13,
    color: '#666666',
  },
  header: {
    name: 'Helvetica',
    style: 'normal',
    size: 10,
    color: '#999999',
  },
  footer: {
    name: 'Helvetica',
    style: 'normal',
    size: 10,
    color: '#999999',
  },
  metadata: {
    name: 'Helvetica',
    style: 'normal',
    size: 11,
    color: '#555555',
  },
};
