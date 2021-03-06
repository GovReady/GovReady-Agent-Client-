import React, { Component } from 'react';
import { default as config } from 'config';
import Widget from '../Widget';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import objectAssign from 'object-assign';
import { actions } from 'redux/modules/widgetReducer';
import Loading from 'components/loading/Generic';

import CmsVulnerabilitiesWidget from './CmsVulnerabilitiesWidget';

class CmsVulnerabilities extends Component {

  static defaultProps = {
    widget: {},
    widgetQuery: {
      url: 'vulnerabilities',
      process: (data) => {
        return {
          core: ( data.core && data.core.length ) ? data.core.pop() : {},
          plugins: ( data.plugins && data.plugins.length ) ? data.plugins : []
        }
      }
    }
  }

  componentWillMount () {
    Widget.registerWidget(
      this, 
      true
    );
  }

  getPluginDataWithVuln(data) {

    let {widget, plugins} = this.props;

    return {
      core: ( data.core && data.core.vulnerabilities && data.core.vulnerabilities.length ) 
            ? data.core
            : {},
      plugins: ( data.plugins && data.plugins.length ) 
            ? data.plugins.filter( plugin => plugin.vulnerabilities && plugin.vulnerabilities.length ) 
            : []
    }
  }

  render () {

    let {widget, widgetName, plugins} = this.props;

    // Return loading if not set
    if(!widget.status || widget.status !== 'loaded' || !plugins.status || plugins.status !== 'loaded') {
      let errorDisplay = Widget.errorDisplay(widget.status, widgetName);
      return errorDisplay ? errorDisplay : <Loading />;
    }

    let fullVuln = this.getPluginDataWithVuln(plugins.data);

    return (
      <CmsVulnerabilitiesWidget 
        cms={config.cmsNice}
        core={fullVuln.core}
        plugins={fullVuln.plugins} />
    )
  }
}

CmsVulnerabilities.propTypes = Widget.propTypes();

// export default Widget.connect(CmsVulnerabilities);

// Hooked up to multiple reducers, so dont use stock Widget methods

function mapStateToProps (state, ownProps) {
  return {
    widget: state.widgetState.widgets[ownProps.widgetName],
    plugins: state.widgetState.widgets['Plugins']
  };
}

function mapDispatchToProps (dispatch) {
  return {
    actions: bindActionCreators(actions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CmsVulnerabilities);
