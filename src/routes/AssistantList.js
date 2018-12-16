import React from 'react';
import { connect } from 'dva';
import AssistantListComponent from '../components/assistantList/AssistantList';

function AssistantList(){
    return <AssistantListComponent/>
}

export default connect()(AssistantList);