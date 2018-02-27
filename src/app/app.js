import 'babel-polyfill';
import DashboardAddons from 'hub-dashboard-addons';
import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {render} from 'react-dom';
import Select from '@jetbrains/ring-ui/components/select/select';
import Panel from '@jetbrains/ring-ui/components/panel/panel';
import Button from '@jetbrains/ring-ui/components/button/button';
import Link from '@jetbrains/ring-ui/components/link/link';
import Avatar, {Size} from '@jetbrains/ring-ui/components/avatar/avatar';
import Badge from '@jetbrains/ring-ui/components/badge/badge';

// eslint-disable-next-line import/no-unresolved
import 'file-loader?name=[name].[ext]!../../manifest.json';
import styles from './app.css';

const HUB_SERVICE_ID = '0-0-0-0-0';

class Widget extends Component {
  static propTypes = {
    dashboardApi: PropTypes.object,
    registerWidgetApi: PropTypes.func
  };

  constructor(props) {
    super(props);
    const {registerWidgetApi, dashboardApi} = props;

    this.state = {
      isConfiguring: false,
      selectedProject: null,
      projects: [],
      users: [],
      owner: null,
      hubUrl: null
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true})
    });

    this.initialize(dashboardApi);

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

    // eslint-disable-next-line max-len
    dashboardApi.setTitle(`${team.name}: ${users.length} ${users.length === 1 ? 'member' : 'members' }`);

    this.setState({users, owner});
  }

  async initialize(dashboardApi) {
    const [{projects}, {homeUrl: hubUrl}, config] = await Promise.all([
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
            fields: 'homeUrl'
          }
        }
      ),
      dashboardApi.readConfig()
    ]);

    this.setState({projects, hubUrl});

    if (!config) {
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
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize(this.props.dashboardApi);
  };

  changeProject = selectedProject => this.setState({selectedProject});

  renderConfiguration() {
    const {projects, selectedProject} = this.state;

    const data = projects.map(project => ({
      key: project.id,
      label: project.name
    }));

    return (
      <div className={styles.widget}>
        <Select
          data={data}
          selected={selectedProject}
          onChange={this.changeProject}
          label="Select a project"
          filter={true}
        />
        <Panel>
          <Button blue={true} onClick={this.saveConfig}>{'Save'}</Button>
          <Button onClick={this.cancelConfig}>{'Cancel'}</Button>
        </Panel>
      </div>
    );
  }

  render() {
    const {isConfiguring, users, owner, hubUrl} = this.state;

    if (isConfiguring) {
      return this.renderConfiguration();
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
                <Link href={`${hubUrl}/users/${user.id}`} target="_top">{user.name}</Link>

                {user === owner &&
                  <Badge gray={true} className={styles.badge}>{'project owner'}</Badge>
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
  }
}

DashboardAddons.registerWidget((dashboardApi, registerWidgetApi) =>
  render(
    <Widget
      dashboardApi={dashboardApi}
      registerWidgetApi={registerWidgetApi}
    />,
    document.getElementById('app-container')
  )
);
