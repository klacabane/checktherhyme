import Rx from 'rx';

const state = {
  playing: 'playing',
  paused: 'paused',
  stopped: 'stopped',
  loading: 'loading'
};

export default class {
  constructor(element) {
    this.dom = element;
    this._pauser = new Rx.Subject();
    this._state = state.stopped;

    const progress$ = Rx.Observable
      .timer(0, 50)
      .map(() => this.dom.currentTime)
      .pausable(this._pauser);

    const playing$ = Rx.Observable
      .fromEvent(this.dom, 'playing')
      .do(() => this._pauser.onNext(true))
      .map(state.playing);

    const pauseOrEnd$ = Rx.Observable
      .merge(
        Rx.Observable.fromEvent(this.dom, 'pause').map(state.paused),
        Rx.Observable.fromEvent(this.dom, 'ended').map(state.stopped)
      )
      .do(() => this._pauser.onNext(false));

    const state$ = Rx.Observable
      .merge(playing$, pauseOrEnd$);

    this._source$ = Rx.Observable
      .combineLatest(
        progress$,
        state$,
        (time, state) => ({ time, state })
      );
  }

  init(src) {
    this.dom.src = src;
    return this._source$;
  }

  play() {
    this.dom.play();
  }

  pause() {
    this.dom.pause();
  }
};
