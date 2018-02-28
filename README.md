# Project Team Widget
[![Build Status][ci-img]][ci-bt] [![JetBrains team project](http://jb.gg/badges/team.svg)](https://confluence.jetbrains.com/display/ALL/JetBrains+on+GitHub)

This widget shows the list of users and members of groups who are assigned to a project team. This widget can be added to dashboards and project overview pages in a Hub installation. You can also add this widget to dashboards in YouTrack.

## Widget Development
This project is open source. You are welcome to contribute to the development of this widget or use the source code as a springboard to develop your own widgets.

The following commands are available:

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

[1]: http://yeoman.io/
[ci-project]: https://teamcity.jetbrains.com/viewType.html?buildTypeId=JetBrainsUi_HubWidgets_HubProjectTeamsWidget
[ci-bt]: https://teamcity.jetbrains.com/viewType.html?buildTypeId=JetBrainsUi_HubWidgets_HubProjectTeamsWidget&tab=buildTypeStatusDiv
[ci-img]:  https://teamcity.jetbrains.com/app/rest/builds/buildType:JetBrainsUi_RingUi_GeminiTests/statusIcon.svg

