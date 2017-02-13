import m from 'mithril';
import R from 'ramda';
import Player from '../../audioplayer.js';

const lyrics = 
  "Wake up in the morning load my pistol can't leave home without it\n" +
  "Come from where you see a lot of bodies but don't talk about it\n" +
  "Hard to find the plug I middleman that package on consignment\n" +
  "Hookers, strippers, crackheads, robbers, trappers all in public housing\n" +
  "Uncle Bo was stealing from my granny can't leave shit around here\n" +
  "Roaches, rats, and ants inside my pantry can't leave food around here\n" +
  "Aunty Trish was sleep', I stole her car and when I'm servin', robbin'\n" +
  "Grinding with my family through the struggle hold 'em down regardless\n" +

  "Mama daddy kicked me out at fifteen while I'm renegading\n" +
  "Moved into appartments with my granny started going crazy\n" +
  "Then my brother Ju moved in he fresh up out the penitentiary\n" +
  "Whooped my ass he made me to a man I slanged his crack in vacants\n" +
  "Aunty Trish was smoking on my weed she used to work my patience\n" +
  "Every night I sneak out pull her keys out I'm driving paper chasing\n" +
  "One night we robbed the Asian lady let the police on pursuit\n" +
  "GD Cory riding with me let the shots go through the roof\n" +
  "Two days later HPD pulled up and questioned aunty Trish\n" +
  "She knew I took her car and hit a lick but she ain't tell 'em shit\n" +
  "They searched her car and let her go they almost charged her for a grammy\n" +
  "Never snitch betrayed the family but she always told my granny\n" +
  "My granny' oldest son is Alvin Jr. call him Uncle Main\n" +
  "That's my favorite uncle on occasion he smoke crack cocaine\n" +
  "Petty, thief and junkie but he always had my most respect\n" +
  "When I was six I've seen him stab a nigga and he bled to death\n" +

  "Wake up in the morning load my pistol can't leave home without it\n" +
  "Come from where you see a lot of bodies but don't talk about it\n" +
  "Hard to find the plug I middleman that package on consignment\n" +
  "Hookers, strippers, crackheads, robbers, trappers all in public housing\n" +
  "Uncle Bo was stealing from my granny can't leave shit around here\n" +
  "Roaches, rats, and ants inside my pantry can't leave food around here\n" +
  "Aunty Trish was sleep', I stole her car and when I'm servin', robbin'\n" +
  "Grinding with my family through the struggle hold 'em down regardless\n" +

  "My uncle Bo my granny youngest son he always doing extra\n" +
  "Moved in for the summer he was tired of living in a shelter\n" +
  "Up all night and sleep all day you never know his sleeping schedule\n" +
  "Gotta hide my money dope and clothes that nigga steal whatever\n" +
  "Bo was damn near 50 posted on the block with all the youngsters\n" +
  "He too old for that my granny said the streets gone' take him under\n" +
  "Always hitting places when I'm jugging with my older brother\n" +
  "Till he lost his life they shot him twice he tried to take some bundles\n" +
  "My cousin Pooh was Auntie's older son that nigga never listened\n" +
  "Gender with them pigeons he got sentenced 42 in prison\n" +
  "Certified killer he the reason why I started Crippin'\n" +
  "Aggravated, robbing, stealing, killing even shot some bitches\n" +
  "He turned me to a shooter said nobody gonna blast it for me\n" +
  "Pooh he was a savage uncle Bo he raised a crash dummy\n" +
  "When I was twelve he got me high my first time ever smoking grass\n" +
  "He caught his girlfriend cheating grabbed the Glock and shot 'er in her ass\n" +

  "Wake up in the morning load my pistol can't leave home without it\n" +
  "Come from where you see a lot of bodies but don't talk about it\n" +
  "Hard to find the plug I middleman that package on consignment\n" +
  "Hookers, strippers, crackheads, robbers, trappers all in public housing\n" +
  "Uncle Bo was stealing from my granny can't leave shit around here\n" +
  "Roaches, rats, and ants inside my pantry can't leave food around here\n" +
  "Aunty Trish was sleep', I stole her car and when I'm servin', robbin'\n" +
  "Grinding with my family through the struggle hold 'em down regardless";

const bars = lyrics.split('\n').map((bar, i) => ({ index: i+1, time: 12.0, words: bar.split(' ') }));

const isBefore = R.filter(w => w.time <= update.time);

const timeline = [
  { line: 1, word: 'Wake', time: 12.3 },
  { line: 1, word: 'up', time: 12.5 },
  { line: 1, word: 'in', time: 12.7 },
  { line: 1, word: 'the', time: 12.9 },
  { line: 1, word: 'morning', time: 13.1 },
  { line: 1, word: 'load', time: 13.3 },
  { line: 1, word: 'my', time: 13.6 },
  { line: 1, word: 'pistol', time: 13.9 },
  { line: 1, word: 'can\'t', time: 14.1 },
  { line: 1, word: 'leave', time: 14.3 },
  { line: 1, word: 'home', time: 14.6 },
  { line: 1, word: 'without', time: 14.8 },
  { line: 1, word: 'it', time: 14.9 },
  { line: 2, word: 'Come', time: 15.4 },
];

/**
 * Init body with lyrics by putting the first line in the middle of the container.
 * On audio progress (while player.playing => requestAnimationFrame loop do => read player.currentTime):
 *  - Highlight the current word if any
 *  - Display the word's line at the center of the screen
 */
export default {
  oninit() {
    this.words = [];
  },

  wordItem(word) {
    console.log(this);
  },

  view(vnode) {
    return m('.ui.grid', [
      m('audio#audioplayer', {
        oncreate({ dom }) {
          vnode.state.player = new Player(dom);

          vnode.state.subscription = vnode.state.player
            .init('/dist/audio.mkv')
            .subscribe(update => {
              vnode.state.words = timeline
                .filter(w => w.time <= update.time);

              m.redraw();
            });

            // vnode.state.player.play();
        },

        onremove() { vnode.state.subscription.dispose() }
      }),

      m('.row', { style: { height: '50px' } }),

      m('.three.column.row', [
        m('.four.wide.column'),

        m('.eight.wide.column', { style: { fontSize: '1.1em' } },
          m('.ui.list', bars.map(bar => m('.item', { style: { lineHeight: '1.6rem' } },
            bar.words.map(word => {
              const selected = vnode.state.words.find(w => w.word === word && w.line === bar.index);
              return m('span.word', {
                style: {
                  background: selected ? 'red' : 'white',
                  color: selected ? 'white' : 'black'
                },

                onmouseup() {
                  console.log({ line: bar.index, word: word, time: vnode.state.player.dom.currentTime });
                }
              }, m('span', word))
            })))
        )),

        m('.four.wide.column')
      ])
    ]);
  }
};
