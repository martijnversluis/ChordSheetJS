import Configuration from '../src/formatter/configuration/configuration';
import Formatter from '../src/formatter/formatter';

describe('Formatter', () => {
  it('correctly assigns configuration', () => {
    const customDelegate = (content: string) => content.toUpperCase();

    const configuration = new Configuration({
      delegates: {
        abc: customDelegate,
      },
    });

    const formatter = new Formatter(configuration);

    expect(formatter.configuration.delegates.abc).toEqual(customDelegate);
  });
});
