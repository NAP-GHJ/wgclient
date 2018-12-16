import dva from 'dva';
import createLoading from 'dva-loading';
import './index.css';
import {Modal} from 'antd';

// 1. Initialize
const app = dva({
    onError(e){
        Modal.error({content:e.message})
    }
});

// 2. Plugins
// app.use({});
app.use(createLoading());

// 3. Model
// app.model(require('./models/example').default);
app.model(require('./models/assistantList'));

// 4. Router
app.router(require('./router'));

// 5. Start
app.start('#root');
