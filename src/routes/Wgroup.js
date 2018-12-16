import React from 'react';
import { connect } from 'dva';
import WgroupComponent from '../components/wgroup/Wgroup';

function Wgroup(){
    return <WgroupComponent/>
}

export default connect()(Wgroup);