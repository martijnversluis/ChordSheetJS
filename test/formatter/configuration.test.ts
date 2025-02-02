describe('Configuration', () => {
  it('merges in default delegates', () => {
    const customDelegate = (content: string) => content.toUpperCase();

    const configuration = {
      delegates: {
        abc: customDelegate,
      },
    };

    expect(configuration.delegates.abc).toEqual(customDelegate);
  });
});
