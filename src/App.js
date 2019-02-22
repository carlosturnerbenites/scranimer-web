import React, { Component } from 'react';
import './App.css';

import { db } from 'firebase/index.js'
import AnimeList from 'components/AnimeList.js'

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';


import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


class App extends Component {
  constructor (props) {
    super(props)
    this.state = {
      tabsIndex: 0
    }
  }
  handleChange = (event, value) => {
    this.setState({ tabsIndex: value });
  };
  render() {
    let { tabsIndex } = this.state

    console.log('tabsIndex', tabsIndex)

    function TabContainer (props) {
      return (
        <div>
          {props.children}
        </div>
      );
    }

    return (
      <div className="App">
        <AppBar position="static" color="default">
          <Tabs
            value={tabsIndex}
            onChange={this.handleChange}
            scrollable
            scrollButtons="on"
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="All" icon={<Icon>add_circle</Icon>} />
            <Tab label="Me" icon={<Icon>add_circle</Icon>} />
            <Tab label="Other" icon={<Icon>add_circle</Icon>} />
          </Tabs>
        </AppBar>
        {tabsIndex === 0 && <AnimeList/>}
        {tabsIndex === 1 && <TabContainer>Item Two</TabContainer>}
        {tabsIndex === 2 && <TabContainer>Item Three</TabContainer>}



      </div>
    );
  }
  componentDidMount () {
    console.log('window.location.pathname', window.location.pathname)
    console.log('window.location.search', window.location.search)
    console.log('window.location.href', window.location.href)

    let userId = 'default'

    db.collection('userAnimes').doc(userId).collection('animes').get()
      .then(query => {
        let docs = []

        query.forEach(i => {
          let doc = i.data()

          /*
          doc.animeRef.get().then(anime => {
            doc.animeDoc = anime.data()
          })
          */
         docs.push(doc)
        })
      })
  }
}

export default App;
