# Pull Request guidelines

- Adding a new feature
  - Before creating a pull request for new features, I recommend creating an issue with information about the feature. Once the issue has been approved/accepted you can create a pull request.
  - Make sure to provide a clear and concise description of the feature.
  - I recommend using the [roadmap](/internals/roadmap) for ideas.
- Fixing a bug
  - Please provide information about how to replicate the bug, or a video of it.
- Submitting code changes
  - I'm always happy for people to submit code changes, whether it's improving performance, adding new features or fixing bugs.
  - Please make sure code changes are relevant to the project.

## Before opening pull request

Before submitting a pull request, please make sure that eslint, end to end, and unit tests all pass.

- Fix all errors from eslint from `yarn lint`
- Build the project using `yarn build`
  - For documentation run `yarn build:docs`
- Run end to end tests using `yarn test:server` and `yarn test:e2e`
- Run unit tests using `yarn test:app`

## After submitting pull request

- I'll try to review the PR as soon as possible, if there are any issues you'll be asked to make changes.
- If the features in the PR are not revelant to the project your PR maybe closed. If this occurs multiple times you maybe blocked from the repository.
- Once your PR has been approved and all tests are passing, **YOU** can merge the PR (I won't be merging PRs as there's no better feeling than merging a PR after a long day).
