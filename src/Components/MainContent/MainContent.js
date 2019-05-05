import React, { useState, Suspense } from 'react';
import { Router, View } from 'react-navi';
import { Route } from 'react-router-dom';

import NavigationBar from 'Components/NavigationBar';
import features from 'routes/Features';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Sidebar from 'Components/Sidebar';

const mock = [
  {
    id: 1,
    name: 'Receiveables',
    selected: true,
    menuGroups: [{
      id: 1,
      name: 'Create',
      component: 'Create',
      path: '/create',
    }, {
      id: 2,
      name: 'Edit',
      component: 'Edit',
      path: '/edit',
    }]
  },
  {
    id: 2,
    name: 'Transactions',
    menuGroups: [{
      id: 3,
      name: 'Transactions',
      component: 'Transactions',
      path: '/transactions'
    }]
  }
];

const styles = theme => ({
  root: {
    flexGrow: 1,
  }
});

const MainContent = ({classes}) => {
  const [tabs] = useState(mock);
  const [tabId, setTab] = useState(tabs.find(x => x.selected).id);
  
  return (
    <Route path="/" render={({ history, match }) => 
      <div className={classes.root}>
        <Grid container>
          <Grid item xs={12}>
            <NavigationBar tabs={tabs} tabId={tabId} setTab={setTab} />
          </Grid>
          <Grid item xs={12} sm={3}>
            <Sidebar menuGroups={tabs.find(({id}) => id === tabId).menuGroups}/>
          </Grid>
          <Grid item xs={12} sm={9}>
            <Router
              routes={features(mock)}
              history={history}
              basename={match.url}>
              <Suspense fallback={null}>
                <View />
              </Suspense>
            </Router>
          </Grid>
        </Grid>
      </div>
    } />
  );
}

export default withStyles(styles)(MainContent);