import React from 'react';
import { Router, Route, Switch } from 'dva/router';
import IndexPage from './routes/IndexPage';
import AssistantList from './routes/AssistantList';

function RouterConfig({ history }) {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/" exact component={AssistantList} />
        <Route path="/lists" exact component={AssistantList} />
      </Switch>
    </Router>
  );
}

export default RouterConfig;
