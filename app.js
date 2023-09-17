/**
 * This is a very minimal example for a websocket client
 * You could use this as a starting point to creating your own interfaces
 *
 * This example does not handle disconnections
 */

// this would need to resolve to the hostname of where ontime is running
const socket = new WebSocket('ws://localhost:4001/ws');

/**
 * Updates the html when a new message is received
 * @param {string} field
 * @param {any} payload
 */
const updateDOM = (field, payload) => {
  // get element
  const el = document.getElementById(field);
  if (el) {
    // change data
    el.innerText = JSON.stringify(payload, null, 2);

    // example running timer
    if (field === 'timer') {
      const timer = document.getElementById('current');
      // payload.running contains current timer in milliseconds
      // here I use a date object to do the conversion,
      // you should probably calculate this yourself or use a library
      const now = new Date(payload.current);
      // extract what we need
      timer.innerText = `${now.getUTCHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    }

    // update timestamp
    const tag = document.getElementById('timestamp');
    tag.innerText = new Date();
  }
};

socket.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);

  // all objects from ontime are structured with type and payload
  const { type, payload } = data;

  // we only need to read message type of ontime
  if (type === 'ontime') {
    // destructure known data from ontime
    // see https://cpvalente.gitbook.io/ontime/control-and-feedback/websocket-api

    console.log('Got message from ontime:', payload);
    const {
      timer,
      playback,
      timerMessage,
      publicMessage,
      lowerMessage,
      onAir,
      loaded,
      eventNow,
      eventNext,
      publicEventNow,
      publicEventNext,
    } = payload;

    // being explicit here for sake of clarity
    // there is a case for the object to include partial data

    if (timer) updateDOM('timer', timer);

    if (playback) updateDOM('playback', playback);

    if (timerMessage) updateDOM('messages-timer', timerMessage);

    if (publicMessage) updateDOM('messages-public', publicMessage);

    if (lowerMessage) updateDOM('messages-lower', lowerMessage);

    // since onAir is a boolean, we check to see if it might be undefined
    if (onAir != null) updateDOM('onAir', onAir);

    if (loaded) updateDOM('loaded', loaded);

    if (eventNow) updateDOM('event-now', eventNow);
    if (eventNext) updateDOM('event-next', eventNext);
    if (publicEventNow) updateDOM('public-event-now', publicEventNow);
    if (publicEventNext) updateDOM('public-event-next', publicEventNext);
  }
});
