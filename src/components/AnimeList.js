import React, { Component } from 'react';

import { db } from 'firebase/index.js'

import { withStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';

import update from 'react-addons-update';

class AnimeList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animes: []
    }

    // this.tooggleFavoriteAnime = this.tooggleFavoriteAnime.bind(this)
  }

  tooggleFavoriteAnime = (anime) => {
    console.log(anime.id)
    let userId = 'default'
    let animeId = anime.id.toString()
    if (anime.like) {
      db.collection('userAnimes').doc(userId).collection('animes').doc(animeId).delete()
      anime.like = false
    } else {
      let data = {
        animeRef: `animes/${animeId}`,
        score: 0,
        anime,
      }
      db.collection('userAnimes').doc(userId).collection('animes').doc(animeId).set(data)
      anime.like = true
    }

    let index = this.state.animes.findIndex(item => item.id === anime.id)
    if (index >= 0) {
      this.setState({
        animes: update(this.state.animes, { [index]: { $merge: anime } } )
      })
    }

  }

  render() {
    let { animes } = this.state

    return (
      <List>
        {animes.map(anime => {
          let iconLike = <Icon>favorite</Icon>;
          if (anime.like) iconLike = <Icon color="error">favorite</Icon>

          return (<ListItem key={anime.id} dense button>
            <Avatar alt="Remy Sharp" src={anime.image} />
            <ListItemText primary={anime.name} />
            <ListItemSecondaryAction>
              <IconButton onClick={() => this.tooggleFavoriteAnime(anime)}>
                {iconLike}
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        )})}
      </List>
    );
  }
  componentDidMount () {
    let userId = 'default'

    db.collection('animes').get()
      .then(query => {
        let animes = []
        let promises = []
        query.forEach(i => {
          let doc = i.data()
          let promise = db.collection('userAnimes').doc(userId).collection('animes').doc(i.id).get()
            .then(element => {
              if (element.exists) {
                doc.like = true
                doc.state = ""
              } else {
                doc.like = false
                doc.state = ""
              }
            })
          promises.push(promise)
          animes.push(doc)
        })
        Promise.all(promises)
          .then(r => this.setState({ animes }))
      })
  }
}

export default AnimeList;
