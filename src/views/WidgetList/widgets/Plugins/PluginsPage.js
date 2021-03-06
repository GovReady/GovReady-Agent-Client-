import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import Accordion from 'react-bootstrap/lib/Accordion';
import Panel from 'react-bootstrap/lib/Panel';
import { default as config } from 'config';
import Vulnerability from 'components/Vulnerability';
import SearchList from 'components/SearchList';
import BackButton from 'components/BackButton';

class PluginsPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      sortBy: 'updates'
    }
  }

  sortByUpdate() {
    let aName, bName;
    return this.props.plugins.sort((a, b) => {
      // Sort by update?
      if(a.updates || b.updates) {
        if (a.updates && !b.updates) {
          return -1;
        } else if (!a.updates && b.updates) {
          return 1;
        } else if (a.updates === 'security') {
          return -1;
        } else if (b.updates === 'security') {
          return 1;
        }
      }
      // Alpha
      aName = a.label.toUpperCase();
      bName = b.label.toUpperCase();
      if(aName < bName) return -1;
      if(aName > bName) return 1;
      return 0;
    })
  }

  sortByTitle() {
    let aName, bName;
    return this.props.plugins.sort((a, b) => {
      // Alpha
      aName = a.label.toUpperCase();
      bName = b.label.toUpperCase();
      if(aName < bName) return -1;
      if(aName > bName) return 1;
      return 0;
    })
  }

  toggleSort(e, sortBy) {
    e.preventDefault();
    this.setState({ sortBy: sortBy });
  }

  render () {
    let {header, pluginText, cmsUrl, updates, core, cms, plugins} = this.props;
    // core update alert
    const coreUpdate = () => {
      // No update
      if(!core.updates) {
        return '';
      }
      // Has security vulnerabilities
      if(core.vulnerabilities && core.vulnerabilities.length) {
        return (
          <Panel className='panel panel-danger' header={cms + ' Core security update!'} eventKey="0">
            {core.vulnerabilities.map((vulnerability, index) => (
              <Vulnerability data={vulnerability} version={core.version} key={index} />
            ))}
          </Panel>
        )
      }
      return (
        <div className="alert alert-warning">{cms} Core update available</div>
      )
    }
    // Returns class for plugin warning vs danger
    const pluginClasses = (plugin) => {
      let classes = 'list-group-item';
      if(!plugin.updates) {
        return classes;
      }
      return (plugin.updates === 'security') ? classes + ' list-group-item-danger' : classes + ' list-group-item-warning';
    }
    // returns plugin updates label
    const pluginUpdate = (plugin) => {
      if(!plugin.updates) {
        return '';
      }
      if(plugin.updates === 'security') {
        return (
          <span className="pull-right"><span className="label label-danger">Security Update Available!</span></span>
        );
      }
      return (
        <span className="pull-right"><span className="label label-warning">Update Available</span></span>
      );
    }
    // plugin listing to pass to search
    const pluginListItem = (plugin) => {
      return (
        <li key={plugin.namespace} className={pluginClasses(plugin)}>
          <h4 className="list-group-item-heading">{plugin.label} {pluginUpdate(plugin)}</h4>
          <div className="list-group-item-text">
            <div className="clearfix">
              <span className="pull-left">Version: <span className="badge">{plugin.version}</span></span>
              {plugin.project_link && (  
                <span className="pull-right">
                  <a className="btn btn-default btn-xs" target="_blank" href={plugin.project_link}>{pluginText} page</a>
                </span>
              )}
            </div>
            {plugin.vulnerabilities && plugin.vulnerabilities.length && (
              <div>
                <br />
                <div className="well">
                  <h4 className="margin-top-none">Vulnerabilties</h4>
                  {plugin.vulnerabilities.map((vulnerability, index) => (
                    <Vulnerability data={vulnerability} key={index} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </li>
      )
    }

    // the plugins
    const sorted = this.state.sortBy === 'updates'
                 ? this.sortByUpdate()
                 : this.sortByTitle();

    return (
      <div>
        <div className='text'>
          <h2>
            <span>{pluginText + 's'}</span>
            <BackButton backUrl='/dashboard' />
          </h2>
        </div>
        <hr/>
        <p>{pluginText + 's'} displayed below represent a heads-up-display of your site health. Those marked in yellow are behind the most current version, and should probably be updated.</p> 
        <p><a className="btn btn-default btn-sml" target="_blank" href={cmsUrl}>Go to CMS page</a></p>
        <hr/>
        <div className="govready-messages">
          {coreUpdate()}
          {updates.sec > 0 && (
            <div className="alert alert-danger">
              {updates.sec} <small>{pluginText} security updates</small>
            </div>
          )}
          {updates.reg > 0 && (
            <div className="alert alert-warning">
              {updates.reg} <small>{pluginText + 's'} updates</small>
            </div>
          )}
          {!updates && (
            <div className="alert alert-success">{pluginText + 's'} up to date</div>
          )}
        </div>

        <SearchList items={sorted} searchKey="label" component={pluginListItem}>
          <div className="clearfix sort-buttons">
            <div><label className="control-label">Sort By</label></div>
            <div className="btn-group" role="group" aria-label="...">
              <button type="button"
                      onClick={(e) => this.toggleSort(e, 'updates')}
                      className={`btn btn-default${this.state.sortBy === 'updates' ? ' active' : ''}`}>
                Updates
              </button>
              <button type="button" 
                      onClick={(e) => this.toggleSort(e, 'title')}
                      className={`btn btn-default${this.state.sortBy === 'title' ? ' active' : ''}`}>
                Plugin Name
              </button>
            </div>
          </div>
        </SearchList>
      </div>
    );
  }
}

PluginsPage.propTypes = {
  cms: PT.string.isRequired,
  pluginText: PT.string.isRequired,
  cmsUrl: PT.string.isRequired,
  pluginUrl: PT.string.isRequired,
  updates: PT.object.isRequired,
  core: PT.object.isRequired,
  plugins: PT.array.isRequired
};

export default PluginsPage;