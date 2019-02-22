import firebase from 'firebase'

// import 'firebase/firestore';

import config from 'firebase/config.js'

export default firebase.initializeApp(config)

const db = firebase.firestore()

const settings = { timestampsInSnapshots: true }

db.settings(settings)

export {
  db
}
