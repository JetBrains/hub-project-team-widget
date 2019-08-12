import DashboardAddons from 'hub-dashboard-addons';
import {setLocale, i18n} from 'hub-dashboard-addons/dist/localization';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Select from '@jetbrains/ring-ui/components/select/select';
import Link from '@jetbrains/ring-ui/components/link/link';
import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
import Badge from '@jetbrains/ring-ui/components/badge/badge';
import LoaderInline from '@jetbrains/ring-ui/components/loader-inline/loader-inline';

import ConfigurableWidget from '@jetbrains/hub-widget-ui/dist/configurable-widget';
import EmptyWidget, {EmptyWidgetFaces} from '@jetbrains/hub-widget-ui/dist/empty-widget';
import ConfigurationForm from '@jetbrains/hub-widget-ui/dist/configuration-form';
import Permissions from '@jetbrains/hub-widget-ui/dist/permissions';

import TRANSLATIONS from './translations';

// eslint-disable-next-line import/no-unresolved
// import '!!file-loader?name=[name].[ext]!../../manifest.json';
import styles from './app.css';

const HUB_SERVICE_ID = '0-0-0-0-0';

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    permissions: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi} = props;

    this.state = {
      isConfiguring: false,
      selectedProject: null,
      projects: [],
      users: [],
      owner: null,
      hubUrl: null
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true}),
      getExternalWidgetOptions: () => ({authClientId: '0-0-0-0-0'})
    });
  }

  componentDidMount() {
    const {dashboardApi} = this.props;
    this.initialize(this.props.dashboardApi);
    Permissions.init(dashboardApi).then(() => this.setState({permissions: Permissions}));
  }

  componentWillUpdate(nextProps, nextState) {
    if (
      nextState.selectedProject &&
      (!this.state.selectedProject ||
      this.state.selectedProject.key !== nextState.selectedProject.key)
    ) {
      this.loadProjectTeam(nextState.selectedProject.key);
    }
  }

  updateTitle() {
    const {teamName, isStandaloneHub, users, homeUrl, selectedProject} = this.state;

    if (!teamName || !users || !selectedProject || typeof isStandaloneHub !== 'boolean') {
      return this.setState({title: undefined});
    }

    const projectsPathPrefix = isStandaloneHub ? 'projects-administration' : 'admin/editProject';
    const href = homeUrl
      ? `${homeUrl}/${projectsPathPrefix}/${selectedProject.key}?tab=team`
      : undefined;

    const title = {text: teamName, href, counter: users.length};
    return this.setState({title});
  }

  async loadProjectTeam(projectId) {
    const {dashboardApi} = this.props;

    const team = await dashboardApi.fetchHub(
      `api/rest/projects/${projectId}/team`, {
        query: {
          fields: 'name,users(id,login,name,profile(avatar,email/email)),project/owner'
        }
      }
    );

    const teamMembers = (team.users || []);

    const owner = team.project.owner
      ? teamMembers.filter(user => user.id === team.project.owner.id)[0]
      : null;

    const users = teamMembers.
      filter(user => user !== owner).
      sort((a, b) => a.name.localeCompare(b.name));

    if (owner) {
      users.unshift(owner);
    }

    this.setState({users, owner, teamName: team.name}, () => this.updateTitle());
  }

  async initialize(dashboardApi) {
    const [{projects}, {homeUrl: hubUrl, name: hubServiceName}, config] = await Promise.all([
      dashboardApi.fetchHub(
        'api/rest/projects', {
          query: {
            fields: 'id,name',
            orderBy: 'name',
            $top: -1
          }
        }
      ),
      dashboardApi.fetchHub(
        `api/rest/services/${HUB_SERVICE_ID}`, {
          query: {
            fields: 'homeUrl,name'
          }
        }
      ),
      dashboardApi.readConfig()
    ]);

    const isStandaloneHub = hubServiceName !== 'YouTrack Administration';
    this.setState({projects, isStandaloneHub});

    if (isStandaloneHub) {
      this.setState({homeUrl: hubUrl}, () => this.updateTitle());
    } else {
      dashboardApi.fetchHub('api/rest/services', {query: {
        fields: 'id,name,applicationName,homeUrl',
        query: 'applicationName:YouTrack'
      }}).
        then(response => {
          const youTrackService = (response.services || []).filter(service => service.homeUrl)[0];
          return (youTrackService || {}).homeUrl || hubUrl.replace('/hub', '/youtrack');
        }).
        then(homeUrl => this.setState({homeUrl}), () => this.updateTitle());
    }

    if (!config) {
      dashboardApi.enterConfigMode();
      this.setState({isConfiguring: true});
      return;
    }

    const {selectedProject} = config;

    this.setState({selectedProject});

    this.loadProjectTeam(selectedProject.key);
  }

  saveConfig = async () => {
    const {selectedProject} = this.state;
    await this.props.dashboardApi.storeConfig({selectedProject});
    this.setState({isConfiguring: false});
  };

  cancelConfig = async () => {
    const {dashboardApi} = this.props;

    const config = await dashboardApi.readConfig();
    if (!config) {
      dashboardApi.removeWidget();
    } else {
      this.setState({isConfiguring: false});
      await dashboardApi.exitConfigMode();
      this.initialize(dashboardApi);
    }
  };

  changeProject = selectedProject => this.setState({selectedProject});

  renderConfiguration = () => {
    const {projects, selectedProject} = this.state;

    const data = projects.map(project => ({
      key: project.id,
      label: project.name
    }));

    return (
      <ConfigurationForm
        onCancel={this.cancelConfig}
        onSave={this.saveConfig}
        isInvalid={!selectedProject}
      >
        <Select
          size={Select.Size.FULL}
          data={data}
          selected={selectedProject}
          onChange={this.changeProject}
          label={i18n('Select a project')}
          filter={true}
        />
      </ConfigurationForm>
    );
  };

  renderEmptyWidgetContent = () => {
    const {permissions, selectedProject} = this.state;

    const canReadUsers = permissions && permissions.has(
      'jetbrains.jetpass.user-read-basic', (selectedProject || {}).id
    );
    if (canReadUsers) {
      const noProjectMessage = selectedProject && selectedProject.label
        ? i18n(
          'Project "{{projectName}}" does not have team',
          {projectName: selectedProject.label}
        )
        : i18n('Selected project does not have team');

      return (
        <EmptyWidget
          face={EmptyWidgetFaces.OK}
          message={noProjectMessage}
        />
      );

    }
    return (
      <EmptyWidget
        face={EmptyWidgetFaces.ERROR}
        message={i18n('You do not have permission to view users')}
      />
    );
  };

  renderContent = () => {
    const {users, owner, homeUrl, permissions} = this.state;

    if (!users || !permissions || !permissions.isInitialized()) {
      return (<LoaderInline/>);
    }

    if (!users.length) {
      return this.renderEmptyWidgetContent();
    }

    return (
      <div className={styles.widget}>
        {users.map(user => (
          <div key={user.id} className={styles.user}>
            <div className={styles.userAvatar}>
              <Avatar
                style={{verticalAlign: 'middle'}}
                url={user.profile.avatar.url}
                size={Size.Size32}
              />
            </div>

            <div className={styles.userInfo}>
              <div>
                <Link href={`${homeUrl}/users/${user.id}`} target="_top">{user.name}</Link>

                {user === owner &&
                <Badge gray={true} className={styles.badge}>
                  {i18n('project owner')}
                </Badge>
                }
              </div>

              <div className={styles.userEmail}>
                {user.profile.email ? user.profile.email.email : null}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  render() {
    return (
      <div className={styles.widget}>
        <ConfigurableWidget
          isConfiguring={this.state.isConfiguring}
          dashboardApi={this.props.dashboardApi}
          widgetTitle={this.state.title}
          widgetLoader={!this.state.users}
          Configuration={this.renderConfiguration}
          Content={this.renderContent}
        />
      </div>
    );
  }
}

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) => {
  setLocale(DashboardAddons.locale, TRANSLATIONS);

  render(
    <Widget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
    />,
    document.getElementById('app-container')
  );
});
