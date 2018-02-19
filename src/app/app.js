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
import Group from '@jetbrains/ring-ui/components/group/group';

import 'file-loader?name=[name].[ext]!../../manifest.json'; // eslint-disable-line import/no-unresolved
import styles from './app.css';

const COLOR_OPTIONS = [
  {key: 'black', label: 'Black'},
  {key: 'red', label: 'Red'},
  {key: 'blue', label: 'Blue'}
];

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
      selectedColor: COLOR_OPTIONS[0],
      users: [],
      homeUrl: ''
    };

    registerWidgetApi({
      onConfigure: () => this.setState({isConfiguring: true})
    });

    this.initialize(dashboardApi);

  }

  async initialize(dashboardApi) {
    const config = await dashboardApi.readConfig();

    if (!config) {
      return;
    }

    this.setState({selectedColor: config.selectedColor});

    const hubServiceId = '0-0-0-0-0';

    const [{homeUrl}, {name: teamName, users}] = await Promise.all([
      dashboardApi.fetchHub(
        `api/rest/services/${hubServiceId}`, {
          query: {
            fields: 'homeUrl'
          }
        }
      ),
      dashboardApi.fetchHub(
        'api/rest/projects/3c7f2569-9533-4b8e-b5c1-a1698e743b9e/team', {
          query: {
            fields: 'name,users(id,name,profile/avatar)'
          }
        }
      )
    ]);

    this.setState({users, homeUrl});
    dashboardApi.setTitle(teamName);
  }

  saveConfig = async () => {
    const {selectedColor} = this.state;
    await this.props.dashboardApi.storeConfig({selectedColor});
    this.setState({isConfiguring: false});
  };

  cancelConfig = async () => {
    this.setState({isConfiguring: false});
    await this.props.dashboardApi.exitConfigMode();
    this.initialize(this.props.dashboardApi);
  };

  changeColor = selectedColor => this.setState({selectedColor});

  renderConfiguration() {
    const {selectedColor} = this.state;

    return (
      <div className={styles.widget}>
        <Select
          data={COLOR_OPTIONS}
          selected={selectedColor}
          onChange={this.changeColor}
          label="Select text color"
        />
        <Panel>
          <Button blue={true} onClick={this.saveConfig}>{'Save'}</Button>
          <Button onClick={this.cancelConfig}>{'Cancel'}</Button>
        </Panel>
      </div>
    );
  }

  render() {
    const {isConfiguring, users, homeUrl} = this.state;

    if (isConfiguring) {
      return this.renderConfiguration();
    }

    return (
      <div className={styles.widget}>
        {users.map(user => (
          <div key={user.id}>
            <Group>
              <Avatar
                style={{verticalAlign: 'middle'}}
                url={user.profile.avatar.url}
                size={Size.Size24}
              />
              <Link href={`${homeUrl}/users/${user.id}`} target="_blank">{user.name}</Link>
            </Group>
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
