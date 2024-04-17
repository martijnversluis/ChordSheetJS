import Configuration from '../../src/formatter/configuration/configuration';

describe('Configuration', () => {
  it('merges in default delegates', () => {
    const customDelegate = (content: string) => content.toUpperCase();

    const configuration = new Configuration({
      delegates: {
        abc: customDelegate,
      },
    });

    expect(configuration.delegates.abc).toEqual(customDelegate);
  });
});
