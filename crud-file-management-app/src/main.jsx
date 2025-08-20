import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import PublicView from './pages/PublicView';
import './styles/custom.css';

const App = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={PublicView} />
                <Route path="/admin" component={AdminDashboard} />
            </Switch>
        </Router>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));