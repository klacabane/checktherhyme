import Queries from '../queries';

const pgp = require('pg-promise')({});
const db = pgp('postgresql://localhost/checktherhyme');

export default {
  getArtists() {
    return db.manyOrNone('select * from Artist')
      .then(data => {
        return data;
      });
  },

  getTrack(id) {
    return db.oneOrNone(Queries.GET_TRACK, id)
      .then(() => 5);
  }
};
