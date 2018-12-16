import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import AssistantList from './routes/AssistantList';
import Wgroup from './routes/Wgroup';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={Wgroup} />
        <Route path="/lists" exact component={AssistantList} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
