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
import Button from '@material-ui/core/Button';

import update from 'react-addons-update';

class AnimeList extends Component {
  constructor (props) {
    super(props)
    this.state = {
      animes: []
    }

    this.orderBy = 'name'

    this.pagination = {
      lastVisible: null,
      currentPage: 1,
      startAt: 0,
      perPage: 2
    }

    // this.tooggleFavoriteAnime = this.tooggleFavoriteAnime.bind(this)
  }
  getBasicInfo (anime) {
    return {
      name: anime.name,
      image: anime.image,
    }
  }
  tooggleFavoriteAnime = (anime) => {
    let userId = 'default'
    let animeId = anime.id.toString()

    let data = {}

    if (anime.like) {
      // db.collection('userAnimes').doc(userId).collection('animes').doc(animeId).delete()
      anime.like = false

      data = {
        like: anime.like
      }
    } else {
      anime.like = true

      data = {
        animeRef: `animes/${animeId}`,
        score: 0,
        state: '',
        like: anime.like,
        anime: this.getBasicInfo(anime),
      }
    }
    db
      .collection('userAnimes')
      .doc(userId)
      .collection('animes')
      .doc(animeId)
      .set(data, { merge: true })

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
        <ListItem>
          <ListItemSecondaryAction>
            <Button onClick={this.nextPage}>
              Mas
            </Button>
          </ListItemSecondaryAction>
        </ListItem>
      </List>
    );
  }
  load () {
    let userId = 'default'

    let q
    if (this.pagination.currentPage !== 1){
      q = db.collection('animes')
        .orderBy(this.orderBy)
        .limit(this.pagination.perPage)
        .startAfter(this.pagination.lastVisible)
    } else {
      q = db.collection('animes')
        .orderBy(this.orderBy)
        .limit(this.pagination.perPage)
    }

    q.get()
      .then(query => {
        let animes = []
        let promises = []

        this.pagination.lastVisible = query.docs[query.docs.length - 1];

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
          .then(r => {
            let newAnimes = this.state.animes.concat(animes)
            this.setState({ animes: newAnimes })
          })
      })
  }
  nextPage = () => {
    this.pagination.currentPage += 1
    this.pagination.startAt += this.pagination.perPage
    this.load()
  }
  componentDidMount () {
    this.load()
  }
}

export default AnimeList;
