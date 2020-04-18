import React from 'react';
import Navbar from './components/layout/navbar';
import Landing from './components/layout/landing';
import Footer from './components/layout/footer';
import Register from './components/auth/register';
import Login from './components/auth/login';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import {Provider} from 'react-redux';
import './App.css';
import store from './store';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="App">
            <Navbar></Navbar>
            <Route exact path='/' component={Landing}></Route> 
            <Route excat path='/register' component={Register}></Route>
            <Route exact path='/login' component={Login}></Route>
            <Footer></Footer>
        </div>
      </Router>
    </Provider>
  );
}

export default App;
