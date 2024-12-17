# Contributing

I love receiving pull requests from everyone! Please read this short document before you start,

## ⚠️ Gotchas

### `README.md`

Are you trying to make changes to `README.md`? Wait! `README.md` is a auto-generated file.
  - to make changes in the first part, go to [INTRO.md](INTRO.md)
  - the api docs are generated from JSdoc comment embedded in the code, so changing those
    comments will result in API doc changes.

When your changes are complete, be sure to run `yarn readme` to regenerate `README.md` and commit the updated `README.md` _together_ with the `INTRO.md` changes and/or API doc changes.

## Pull request guidelines

N.B. I do not expect you to have all required knowledge and experience to meet these guidelines;
I'm happy to help you out! ❤️
However, the better your PR meets these guidelines the sooner it will get merged.

- try to use a code style that is consistent with the existing code
- code changes go hand in hand with tests.
- if possible, write a test that proves the bug before writing/changing code to fix it
- if new code you contribute is expected to be public API (called directly by users instead of only used within ChordSheetJS),
  you'd make me really happy by adding JSdoc comments.
- write a [good commit message][commit]. If your PR resolves an issue you can [link it to your commit][link_issue].

[commit]: http://tbaggery.com/2008/04/19/a-note-about-git-commit-messages.html
[link_issue]: https://docs.github.com/en/issues/tracking-your-work-with-issues/linking-a-pull-request-to-an-issue#linking-a-pull-request-to-an-issue-using-a-keyword

## Get started

Ensure your have NodeJS and Yarn on your machine. The [CI workflow][ci_workflow] lists the NodeJS versions that
are expected to work.

[ci_workflow]: https://github.com/martijnversluis/ChordSheetJS/blob/master/.github/workflows/ci.yml#L17

Fork, then clone the repo:

    git clone git@github.com:your-username/ChordSheetJS.git

ChordSheetJS uses Yarn 4. For that to work, Corepack need to be enabled:

    corepack enable

⚠️ NB: In my experience this only guaranteed to work when using Node's Yarn.
   Yarn installed by an external package manager (like Homebrew) will/might not work.

Install the required node modules:

    yarn install

Make sure the tests pass:

    yarn test

Make your change. Add tests for your change. Make the tests pass:

    yarn test

Push to your fork and [submit a pull request][pr].

[pr]: https://github.com/martijnversluis/ChordSheetJS/compare/
