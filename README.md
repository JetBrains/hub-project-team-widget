# Project Team Widget
[![Build Status][ci-img]][ci-bt] [![JetBrains team project](http://jb.gg/badges/team.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)

This widget shows the list of users and members of groups who are assigned to a project team. This widget can be added to dashboards and project overview pages in a Hub installation. You can also add this widget to dashboards in YouTrack.

## Getting Started
This project is open source. You are welcome to contribute to the development of this widget or use the source code as a springboard to develop your own widgets.

After you check out the project, run `npm install` once to install all of the dependencies.

When installed, the following commands are available:

  - `npm test` to launch karma tests
  - `npm start` to run a local development server
  - `npm run lint` to lint your code (JS and CSS)
  - `npm run stylelint` to lint CSS only
  - `npm run build` to generate a production bundle (will be available under `dist`)
  - `npm run ci-test` to launch karma tests and report the results to TeamCity
  
## Widget Testing

You can test widget updates directly in the user interface for Hub and YouTrack. To determine which instructions are appropriate for your installation, check the product icon in the header of your **Dashboards** page.

- External Hub installations and Hub services that are bundled with Upsource display the Hub logo. Follow the instructions in the [Hub documentation](https://www.jetbrains.com/help/hub/test-custom-widgets.html).
- YouTrack Standalone installations that use a built-in Hub service and YouTrack InCloud display the YouTrack logo. Follow the instructions in the [YouTrack documentation](https://www.jetbrains.com/help/youtrack/standalone/test-custom-widgets.html).

All major browsers block insecure scripts. You may encounter a problem when you host your widget on a local development server and try to load it into an application over HTTPS. 
In Chrome, you can add a security exception: click the security notification in the address bar (the one that says "The page is trying to load scripts from unauthenticated sources") and 
press the "Load unsafe scripts" button. Similar workarounds are available in other browsers as well.
Additional options for testing widgets over a secure connection are described in the documentation for Hub and YouTrack.

## JetBrains Ring UI Widget Generator

This project was built using the [widget generator](https://github.com/JetBrains/ring-ui/tree/master/packages/generator/hub-widget) from the JetBrains Ring UI Library. If you want to build your own widgets for use in one of our products, this tool helps you get up and running in seconds flat.

## Widget Installation

This widget is available from the [JetBrains Plugins Repository](https://plugins.jetbrains.com/). This repository is integrated directly into the **Custom Widgets** page in your Hub or YouTrack installation. To install any widget from this repository:
1. Open the **Custom Widgets** page in your installation.
2. Select the widget that you want to install from the list.
3. Click the **Install** button in the page header.

## Contributions

We appreciate all kinds of feedback. Please feel free to send a pull request or submit an issue.

## Contributors

Thanks goes to these rockstars ([emoji key][emojis]):

| [<img src="https://avatars1.githubusercontent.com/u/86095?v=4" width="100px;"/><br /><sub><b>Max Maximov</b></sub>](https://github.com/maxmaximov)<br />[💻](https://github.com/JetBrains/hub-project-team-widget/commits?author=maxmaximov "Code") | [<img src="https://avatars2.githubusercontent.com/u/4318513?v=4" width="100px;"/><br /><sub><b>Andrey Skladchikov</b></sub>](https://github.com/huston007)<br />[💻](https://github.com/JetBrains/hub-project-team-widget/commits?author=huston007 "Code") | [<img src="https://avatars1.githubusercontent.com/u/1948936?v=4" width="100px;"/><br /><sub><b>Max Erekhinskiy</b></sub>](http://vk.com/nightflash)<br />[💻](https://github.com/JetBrains/hub-project-team-widget/commits?author=nightflash "Code") | [<img src="https://avatars2.githubusercontent.com/u/16539758?v=4" width="100px;"/><br /><sub><b>Scott Adams</b></sub>](https://github.com/scotta451)<br />[📖](https://github.com/JetBrains/hub-project-team-widget/commits?author=scotta451 "Documentation") |
| :---: | :---: | :---: | :---: |

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind are welcome!

## License

This project is licensed under the Apache 2.0 License. For details, refer to the [LICENSE.txt file](https://github.com/JetBrains/hub-project-team-widget/blob/master/LICENSE.txt).

[1]: http://yeoman.io/
[ci-project]: https://teamcity.jetbrains.com/viewType.html?buildTypeId=JetBrainsUi_HubWidgets_HubProjectTeamsWidget
[ci-bt]: https://teamcity.jetbrains.com/viewType.html?buildTypeId=JetBrainsUi_HubWidgets_HubProjectTeamsWidget&tab=buildTypeStatusDiv
[ci-img]:  https://teamcity.jetbrains.com/app/rest/builds/buildType:JetBrainsUi_RingUi_GeminiTests/statusIcon.svg
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
