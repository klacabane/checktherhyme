import rp from 'request-promise';
import R from 'ramda';
import cheerio from 'cheerio';

const BASE_URL = 'https://genius.com';
const searchUrl = term => `${BASE_URL}/api/search/song?q=${term}`;

const extractTracks = R.compose(
  R.map(track => ({ title: track.title, artist: track.primary_artist.name, url: track.url })),
  R.pluck('result'),
  R.path(['response', 'sections', 0, 'hits'])); 

const reSectionLine = /^\[.+\]$/;

const sectionType = R.compose(
  R.head,
  R.match(/[\w]+/),
  R.replace(/\[|\]/g, ''),
  R.head);

const isBar = R.compose(R.not, R.test(reSectionLine)); 
const sectionBars = R.compose(
  R.map(R.objOf('raw')),
  R.takeWhile(isBar),
  R.tail);

const buildSection = bars => ({
  type: sectionType(bars),
  bars: sectionBars(bars),
});

const buildSections = bars => {
  if (!bars.length) return [];

  const section = buildSection(bars);
  return R.prepend(section, buildSections(bars.slice(section.bars.length+1)));
};

const extractLyrics = html => cheerio.load(html)('.lyrics').text();

const cleanBars = R.compose(
  R.filter(R.length),
  R.map(R.trim),
  R.split('\n'));

const buildLyrics = R.compose(
  R.filter(s => s.bars.length), // Remove sections with no actual content.
  buildSections,
  cleanBars,
  extractLyrics);

export default {
  searchTracks(term) {
    return rp({ uri: searchUrl(term), json: true })
      .then(extractTracks);
  },

  getLyrics(uri) {
    return rp({ uri, json: true })
      .then(buildLyrics);
  },
};
