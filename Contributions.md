# Contribute

## How to contribute?

We are looking for all sorts of contributions including but not limited to defect fixes, test coverage, and documentation.
If it is a feature request, please discuss with us since we have certain defined roadmap and some of the new suggestions may not be priority right now. But if the feature is viable and adds significant value immediately to the library & community, we will bump it up to the top of the backlog.

## Steps to create a Pull Request

1. Fork the repository
2. Clone the repository and switch to the `develop` branch
3. Make your changes, and pull the latest changes from `develop` before pushing
4. Checkout to a topic branch out of the `develop` branch
5. Commit your code and please add a sensible title to the PR
6. Please add a short description of the changes as bullet points
7. Push your changes and send a PR
8. We'll review the code and get back to you with comments if any as soon as possible
9. If the code is good to go, it'll be merged

## Template for Pull Request (Sample)

Here is a good resource by Github on steps to create a pull request
[Pull Request Recommendation by Github](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/creating-a-pull-request-template-for-your-repository)

But, here we'll be showing how we expect the message for a pull request should be drafted.

* Mention the change or topic clearly and briefly
* Mention the type of PR, in your title, within parentheses if that falls under one of the below categories:
    * defect-fix,
    * feature-request,
    * dependency-upgrade,
    * vulnerability & documentation
* Mention the change or changes, if there are more than one, as bullet points in the description field
  
### Sample PR template below:
  ---
  #### Branch Name: CodeCommentsInUtils/develop
  #### Title: Adding code comments in CommonUtils.js
  #### Description:
   - added code comments for utility functions in CommonUtils.js
   - added method descriptions in block comments
   - cleaned up typos and redundant comments
  ---

## Testing

To execute the module, follow the steps.

- Install all the npm dependencies using the command below:

   ```npm install```

- Execute the sample code in index.js, please run the command below:

   ```node index.js```

- Execute tests, execute:

   ```npm run test```

Note: Test suite is a WIP, feel free to contribute to improve the test coverage and testability of the code.
