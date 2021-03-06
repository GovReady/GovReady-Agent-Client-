import React, { Component } from 'react';
import { PropTypes as PT } from 'prop-types';
import { connect } from 'react-redux';
import { hashHistory } from 'react-router';
import { WidgetList } from '../WidgetList';
import { bindActionCreators } from 'redux';
import { default as config } from 'config';
import { 
  actions,
  SITE_INIT,
  SITE_CREATE_FORM,
  SITE_UPDATE_START,
  MODE_CHANGE_FAILED, 
  SITE_AGG_FAILED, 
  SITE_LOADED 
} from '../../redux/modules/siteReducer';

class SiteState extends Component {
  componentWillMount () {
    let { siteState } = this.props; 
    // We're loaded, so redirect
    if (siteState.status === SITE_LOADED) {
      hashHistory.push('/dashboard');
    }
    else {
      this.props.actions.siteInit(siteState.mode);
    }
  }

  componentWillReceiveProps (nextProps) {
    // We're loaded, so redirect
    if(nextProps.siteState && nextProps.siteState.status === SITE_LOADED) {
      hashHistory.push('/dashboard');
    }
  } 

  goLocalClick(event) {
    event.preventDefault();
    this.props.actions.siteAggAll('local');
  }

  render () {
    let { siteState } = this.props;
    switch(siteState.status) {

      // case SITE_AGG_FAILED:
      // case SITE_PING_FAILED:
      //   return (
      //     <div>
      //       <h2>Oops</h2>
      //       <p>Our servers could not ping your site. This could be because you are on a local machine
      //       or behind a password wall.</p>
      //       <p>You can still use GovReady, however we will not be able to automatically refresh your
      //       information and some data (information about your domain name, etc) will not be available</p>
      //       <p><a href="#" onClick={this.goLocalClick.bind(this)} id="local-mode-continue" className="btn btn-primary">Continue in Localhost mode</a></p>
      //     </div>
      //   )
      case MODE_CHANGE_FAILED:
      case SITE_AGG_FAILED:
        //@TODO acutally log
        return (
          <div>
            <h2>Sorry, something has gone wrong</h2>
            <p>GovReady has been notified, please try refreshing or contact us.</p>
          </div>
        )
      default:
        // if (!config.siteId) {
        //   return <div></div>
        // }
        return (
          <div>
            <div className='loading'>
              <i className='fa fa-spinner fa-2x fa-spin'></i><span className='sr-only'>Loading</span>
            </div>
            <div>
              <p>We are collecting data about your site. It should only take a minute.  After we have collected your initial data, 
              GovReady will automatically contact your site periodically to keep the data up-to-date.</p>
              <p><a target="_blank" className="btn btn-primary" href="https://github.com/GovReady/GovReady-CMS-API/wiki/Security">Learn more</a></p>
            </div>
          </div>
        );
    }
  }
}

SiteState.propTypes = {
  actions: PT.object.isRequired,
  siteState: PT.object.isRequired
};

function mapStateToProps (state) {
  return {
    siteState: state.siteState
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
)(SiteState);
