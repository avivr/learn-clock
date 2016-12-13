function roundDeg(deg) {
  return Math.round(deg / 30) * 30;
}

var clock = (function(date) {
  const minutes = date.getMinutes();
  const hours = date.getHours();
  let activeElement;

  window.addEventListener('mouseup', mouseUp, false);

  function mouseUp() {
    window.removeEventListener('mousemove', divMove, false);
    if (activeElement) {
      _clock.playTime();
    } 
    activeElement = undefined;
  }

  function mouseDown(e) {
    window.addEventListener('mousemove', divMove, false);
  }

  function divMove(e) {
    if (!activeElement) return;
    const div = activeElement;
    const rad = Math.atan2(e.clientX - 160, 160 - e.clientY);
    const deg = rad * (180 / Math.PI);

    _clock.setAngle(activeElement, deg);
  }


  var _clock = {
    hands: [
            {
              hand: 'hours',
              angle: roundDeg(hours * 30),
              element: document.querySelector('.hours')
            },
            {
              hand: 'minutes',
              angle: roundDeg(minutes * 6),
              element: document.querySelector('.minutes')
            }
          ],

    setAngle: function(element, deg) {
      const hand = this.hands.find(hand => hand.element === element);
      if (hand) hand.angle = roundDeg(deg);
      this.render();
    },

    playTime: function() {
      const hourHand = this.hands[0];
      const hourAudio = document.querySelector(`audio[data-hour="${hourHand.angle / 30}"]`);
      if (!hourAudio) return; 
      
      var playMinutes = (function playMinutes() {
        const minutesHand = this.hands[1];
        const minutesAudio = document.querySelector(`audio[data-minutes="${minutesHand.angle / 6}"]`);
        if (minutesAudio) minutesAudio.play();
        hourAudio.removeEventListener("ended", playMinutes);
      }).bind(this);

      hourAudio.play();
      hourAudio.addEventListener("ended", playMinutes);
    },

    render: function() {
      this.hands.forEach(hand => {
        hand.element.style.webkitTransform = 'rotateZ('+ hand.angle +'deg)';
        hand.element.style.transform = 'rotateZ('+ hand.angle +'deg)';
      });
    },

    attach: function() {
      this.hands.forEach(hand => {
        hand.element.addEventListener('mousedown', (e) => {
          if (e.target === hand.element) activeElement = hand.element;
          if (activeElement) mouseDown();
        }, true);
      });
    },

    init: function() {
      this.render();
      this.attach();
    }
  };

  return _clock; 
})(new Date());

clock.init();