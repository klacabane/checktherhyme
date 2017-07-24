import m from 'mithril';
import R from 'ramda';
import Player from '../../audioplayer.js';

const isBefore = R.filter(w => w.time <= update.time);

export default {
  oninit() {
    this.lyrics = [];

    m.request({
      url: '/api/track/2',
      background: true,
    })
    .then(lyrics => {
      this.lyrics = lyrics;
      m.redraw();
    });

    this.selections = {};

    this.insertSelection = (node, start, len, content) => {
        const dataset = node.dataset;
        const wordIndex = dataset.wordIndex;
        const barIndex = dataset.barIndex;
        const sectionIndex = dataset.sectionIndex;

        if (!this.selections[sectionIndex]) this.selections[sectionIndex] = {};
        if (!this.selections[sectionIndex][barIndex]) this.selections[sectionIndex][barIndex] = {};
        if (!this.selections[sectionIndex][barIndex][wordIndex]) this.selections[sectionIndex][barIndex][wordIndex] = [];

        const selection = {
          start,
          len,
          content: content || node.textContent.trim(),
        };

        this.selections[sectionIndex][barIndex][wordIndex].push(selection);
    };

    document.addEventListener('mouseup', e => {
      const selection = document.getSelection();
      const range = selection.getRangeAt(0);
      if (!range.toString()) return;

      if (range.startContainer === range.endContainer) {
        this.insertSelection(range.startContainer.parentNode, range.startOffset, range.endOffset - range.startOffset, range.toString());
      } else {
        const wrapper = range.commonAncestorContainer.className;
        const children = range.cloneContents().children;
        if (wrapper === 'bar') {
          for (let i = 0; i < children.length; i++) {
            const word = children.item(i);
            const start = i === 0 ? range.startOffset : 0;
            const len = i === children.length - 1 ? range.endOffset - start : word.textContent.length;
            this.insertSelection(word, start, len);
          }
        } else {
          for (let i = 0; i < children.length; i++) {
            const bar = children.item(i);
            if (bar.className !== 'bar') continue;

            for (let j = 0; j < bar.childNodes.length; j++) {
                const word = bar.childNodes.item(j);
                const start = i === 0 && j === 0 ? range.startOffset : 0;
                const len = i === children.length - 1 && j === bar.childNodes.length - 1
                  ? range.endOffset - start : word.textContent.length;
                this.insertSelection(word, start, len);
            }
          }
        }
      }

      selection.empty();
      m.redraw();
    });
  },

  view(vnode) {
    return m('.ui.grid', [
      m('audio#audioplayer', {
        oncreate({ dom }) {
          vnode.state.player = new Player(dom);

          vnode.state.subscription = vnode.state.player
            .init('/dist/no-explanation.mkv')
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

        m('.eight.wide.column',
          m('.ui.list', vnode.state.lyrics.map((section, sectionIndex) => m('.section', { 'data-section-index': sectionIndex }, [
            m('div', section.type),

            section.bars.map((bar, barIndex) => {
              return [
                m('.bar',
                  { 'data-bar-index': barIndex },
                  bar.raw.split(' ')
                    .map((word, wordIndex) => {
                      let element;
                      if (vnode.state.selections[sectionIndex] && vnode.state.selections[sectionIndex][barIndex]) {
                        const selections = vnode.state.selections[sectionIndex][barIndex][wordIndex];
                        if (!selections) {
                          element = word;
                        } else {
                          const selection = selections[0];
                          element = m.trust(word.substr(0, selection.start) + '<span style="background: red;">' + word.substr(selection.start, selection.len) + '</span>' + word.substr(selection.start + selection.content.length));
                        }
                      } else {
                          element = m.trust(word);
                      }
                      
                      return m('span.word', {
                        'data-word-index': wordIndex, style: { marginRight: '4px' },
                        'data-bar-index': barIndex,
                        'data-section-index': sectionIndex
                      }, element);
                    })),

                  m('br')
              ];
            })
          ])))
        ),

        m('.four.wide.column')
      ])
    ]);
  }
};
