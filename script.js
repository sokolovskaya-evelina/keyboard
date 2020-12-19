const Keyboard = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    display: null,
  },

  eventHandlers: {
    oninput: null,
    onclose: null,
  },

  properties: {
    value: '',
    capsLock: false,
    secondLang: false,
    shift: false,
    cursorPosition: 0,
    sound: true,
    voice: false,
  },

  init() {
    this.elements.display = document.querySelector('.use-keyboard-input');

    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.append(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    document.body.append(this.elements.main);
    this.elements.main.append(this.elements.keysContainer);

    document.querySelectorAll('.use-keyboard-input').forEach((element) => {
      element.addEventListener('blur', (event) => {
        event.preventDefault();
        element.focus();
      });

      element.addEventListener('focus', () => {
        this.open(element.value, currentValue => {
          element.value = currentValue;
        });
      });

      element.addEventListener('keydown', (event) => {
        this._triggerKbKeys(event);
      });

      element.addEventListener('keyup', (event) => {
        this._triggerKbKeys(event);
      });

      document.querySelector('.keyboard').addEventListener('mouseenter', () => {
        this.properties.value = element.value;
        this.properties.cursorPosition = this.elements.display.selectionStart;
      });
    });
  },

  _createKeys() {
    const fragment = document.createDocumentFragment();
    let keyLayout = [];

    if (!this.properties.secondLang) {
      if (!this.properties.shift) {
        keyLayout = [
          '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace', 'br',
          'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', 'caps', 'br',
          'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'enter', 'br',
          'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'br',
          'sound', 'lang', 'shift', 'space', 'left', 'right', 'voice',
        ];
      } else {
        keyLayout = [
          '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', 'backspace', 'br',
          'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', 'caps', 'br',
          'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '\"', 'enter', 'br',
          'done', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', 'br',
          'sound', 'lang', 'shift', 'space', 'left', 'right', 'voice',
        ];
      }
    } else {
      if (!this.properties.shift) {
        keyLayout = [
          'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'backspace', 'br',
          'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'caps', 'br',
          'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter', 'br',
          'done', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'br',
          'sound', 'lang', 'shift', 'space', 'left', 'right', 'voice',
        ];
      } else {
        keyLayout = [
          'ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', 'backspace', 'br',
          'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', 'caps', 'br',
          'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter', 'br',
          'done', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', 'br',
          'sound', 'lang', 'shift', 'space', 'left', 'right', 'voice',
        ];
      }
    }

    const createIconHTML = (iconName) => {
      return `<icon class="material-icons">${iconName}</icon>`;
    }

    keyLayout.forEach((key) => {
      const insertLineBreak = ['br'].indexOf(key) !== -1;
      const keyElement = document.createElement('button');

      keyElement.setAttribute('type', 'button');
      keyElement.setAttribute('data-code', key);
      keyElement.classList.add('keyboard__key');

      const isActive = (prop, activeClass = 'keyboard__key--active') => {
        if (prop === true) {
          keyElement.classList.add(activeClass);
        } else {
          keyElement.classList.remove(activeClass);
        }
      };

      switch (key) {
        case 'br':
          keyElement.classList.add('unvisible');
          keyElement.textContent = '';
          break;

        case 'backspace':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('backspace');

          keyElement.addEventListener('click', () => {
            this._backspace();
            this._sounds('backspace');
          });

          break;

        case 'caps':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('keyboard_capslock');

          isActive(this.properties.capsLock);

          keyElement.addEventListener('click', () => {
            this._toggleCapsLock();
            this._sounds('caps');

            isActive(this.properties.capsLock);

            //? было так ('keyboard__key--active', this.properties.capsLock) - см исходный код
          });

          break;

        case 'shift':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
          keyElement.innerHTML = createIconHTML('arrow_circle_up');

          isActive(this.properties.shift);

          keyElement.addEventListener('click', () => {
            this._toggleShift();
            this._sounds('shift');
          });

          break;

        case 'enter':
          keyElement.classList.add('keyboard__key--wide');
          keyElement.innerHTML = createIconHTML('keyboard_return');

          keyElement.addEventListener('click', () => {
            this._enter();
            this._sounds('enter');
          });

          break;

        case 'space':
          keyElement.classList.add('keyboard__key--extra-wide');
          keyElement.innerHTML = createIconHTML('space_bar');

          keyElement.addEventListener('click', () => {
            this._space();
            this._sounds('allKeys');
          });

          break;

        case 'left':
          keyElement.innerHTML = createIconHTML('west');

          keyElement.addEventListener('click', () => {
            this._leftArrow();
            this._sounds('left');
          });

          break;

        case 'right':
          keyElement.innerHTML = createIconHTML('east');

          keyElement.addEventListener('click', () => {
            this._rightArrow();
            this._sounds('right');
          });

          break;

        case 'sound':
          keyElement.innerHTML = (this.properties.sound)
            ? createIconHTML('volume_up')
            : createIconHTML('volume_off');

          keyElement.addEventListener('click', () => {
            this.properties.sound = !this.properties.sound;
            keyElement.innerHTML = (this.properties.sound)
              ? createIconHTML('volume_up')
              : createIconHTML('volume_off');
          });

          break;

        case 'voice':
          keyElement.innerHTML = (this.properties.voice)
            ? createIconHTML('mic')
            : createIconHTML('mic_off');

          keyElement.addEventListener('click', () => {
            this.properties.voice = !this.properties.voice;

            if (this.properties.voice) {
              keyElement.innerHTML = createIconHTML('mic');
              keyElement.style.color = 'red';

              this._speech();
            } else {
              keyElement.innerHTML = createIconHTML('mic_off');
              keyElement.style.color = 'white';
            }
          });

          break;

        case 'lang':
          keyElement.innerHTML = (this.properties.secondLang === false) ? 'en' : 'ru';

          keyElement.addEventListener('click', () => {
            this._toggleLang();
          });

          break;

        case 'done':
          keyElement.classList.add('keyboard__key--wide', 'keyboard__key--dark');
          keyElement.innerHTML = createIconHTML('check_circle');

          keyElement.addEventListener('click', () => {
            this.close();
            this._sounds('done');
            this._triggerEvent('onclose');
          });

          break;

        default:
          keyElement.textContent = key.toLocaleLowerCase();

          keyElement.addEventListener('click', () => {
            this._stringRenew(key)
            this._triggerEvent('oninput');
            this._cursorMove('get');

            this._sounds('allKeys');
          });

          break;
      }

      fragment.append(keyElement);

      if (insertLineBreak) {
        fragment.append(document.createElement('br'));
      }
    });

    return fragment;
  },

  _triggerEvent(handlerName) {
    if (typeof this.eventHandlers[handlerName] == 'function') {
      this.eventHandlers[handlerName](this.properties.value);
    }
  },

  _heightControl() {
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0) {
        if (this.properties.capsLock === this.properties.shift) {
          key.textContent = key.textContent.toLowerCase();
        } else {
          key.textContent = key.textContent.toUpperCase();
        }
      }
    }
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    this._heightControl();
  },

  _toggleLang() {
    this.properties.secondLang = !this.properties.secondLang;

    this.elements.keysContainer.innerHTML = '';
    this.elements.keysContainer.append(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this._heightControl();
  },

  _toggleShift() {
    this.properties.shift = !this.properties.shift;

    this.elements.keysContainer.innerHTML = '';
    this.elements.keysContainer.append(this._createKeys());
    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    this._heightControl();
  },

  _stringRenew(char) {
    const newText = (this.properties.capsLock === this.properties.shift)
      ? char.toLowerCase()
      : char.toUpperCase();

    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition)
      + newText
      + this.properties.value.substring(this.properties.cursorPosition);

    this.properties.cursorPosition += 1;
  },

  _cursorMove(param) {
    if (param === 'set') {
      this.properties.cursorPosition = this.elements.display.selectionStart = this.elements.display.selectionEnd
    }
    if (param === 'get') {
      this.elements.display.selectionStart = this.elements.display.selectionEnd = this.properties.cursorPosition;
    }
  },

  _leftArrow() {
    this.properties.cursorPosition = (this.properties.cursorPosition > 0)
              ? this.properties.cursorPosition - 1
              : 0;

    this._cursorMove('get');
    this._triggerEvent('oninput');
  },

  _rightArrow() {
    this.properties.cursorPosition = (this.properties.cursorPosition === this.properties.value.length)
              ? this.properties.value.length
              : this.properties.cursorPosition + 1;

    this._cursorMove('get');
    this._triggerEvent('oninput');
  },

  _backspace() {
    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition - 1)
              + this.properties.value.substring(this.properties.cursorPosition);

    this.properties.cursorPosition = (this.properties.cursorPosition !== 0)
      ? this.properties.cursorPosition - 1
      : 0;

    this._triggerEvent('oninput');
    this._cursorMove('get');
  },

  _enter() {
    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition)
      + '\n'
      + this.properties.value.substring(this.properties.cursorPosition);

    this._triggerEvent('oninput');
    this.properties.cursorPosition += 1;
    this._cursorMove('get');
  },

  _space() {
    this.properties.value = this.properties.value.substring(0, this.properties.cursorPosition)
      + ' '
      + this.properties.value.substring(this.properties.cursorPosition);

    this._triggerEvent('oninput');
    this.properties.cursorPosition += 1;
    this._cursorMove('get');
  },

  _triggerKbKeys(event) {
    if (/F[0-9]{1,2}/g.test(event.key)) return;

    const simbolKey = (event.key !== '\"')
      ? document.querySelector(`[data-code = "${event.key.toLowerCase()}"]`)
      : document.querySelector(`[data-code = '\"']`);

    const capsKey = document.querySelector(`button[data-code = 'caps']`);
    const shiftKey = document.querySelector(`button[data-code = 'shift']`);
    const leftKey = document.querySelector(`button[data-code = 'left']`);
    const rightKey = document.querySelector(`button[data-code = 'right']`);
    const backspaceKey = document.querySelector(`button[data-code = 'backspace']`);
    const enterKey = document.querySelector(`button[data-code = 'enter']`);
    const spaceKey = document.querySelector(`button[data-code = 'space']`);

    this._cursorMove('get');

    if (event.type === 'keydown') {
      event.preventDefault();

      switch (event.key) {
        case 'Shift':
          shiftKey.classList.add('active');
          if (event.repeat) return;

          this._toggleShift();
          this._sounds('shift');
          break;

        case 'CapsLock':
          this._toggleCapsLock();

          (this.properties.capsLock)
            ? capsKey.classList.add('keyboard__key--active')
            : capsKey.classList.remove('keyboard__key--active');

          capsKey.classList.add('active');

          this._sounds('caps');
          break;

        case 'ArrowLeft':
          leftKey.classList.add('active');
          this._leftArrow();
          this._sounds('left');
          break;

        case 'ArrowRight':
          rightKey.classList.add('active');
          this._rightArrow();
          this._sounds('right');
          break;

        case 'Backspace':
          backspaceKey.classList.add('active');
          this._backspace();
          this._sounds('backspace');
          break;

        case 'Enter':
          enterKey.classList.add('active');
          this._enter();
          this._sounds('enter');
          break;

        case ' ':
          spaceKey.classList.add('active');
          this._space();
          this._sounds('allKeys');
          break;

        default:
          if (simbolKey) {
            const text = simbolKey.textContent;

            this._stringRenew(text);
            this._triggerEvent('oninput');
            this._cursorMove('get');

            simbolKey.classList.add('active');

            this._sounds('allKeys');
          }
          break;
      }
    }


    if (event.type === 'keyup') {
      if (event.key === 'Shift') {
        this._toggleShift();

      } else {
        event.preventDefault();
        const activeKey = document.querySelector('.active');
        (activeKey) ? activeKey.classList.remove('active') : '';
      }
    }

    if (event.type === 'input') {
      this.properties.capsLock = false;
      this.properties.shift = false;

      this.elements.keysContainer.innerHTML = '';
      this.elements.keysContainer.append(this._createKeys());
      this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');
    }
  },

  _sounds(keyCode) {
    const audio = document.querySelector(`audio[data-code='${keyCode}']`);
    const key = document.querySelector(`[data-code='${keyCode}']`);

    if (!audio) return;
    if (!this.properties.sound) return;

    key.classList.add('playing');

    audio.currentTime = 0;
    audio.play();

    key.addEventListener('transitionend', () => {
      this._removeTransition();
    });
  },

  _removeTransition(event) {
    if (event.propertyName !== 'transform') return;
    event.target.classList.remove('playing');
  },

  //* speech recognition
  _speech() {
    const recognition = new SpeechRecognition();
    recognition.interimResults = true;
    recognition.lang = 'ru-RU';

    //let p = document.createElement('p');
    //const words = document.querySelector('.words');
    //this.elements.display.appendChild(p);

    recognition.addEventListener('result', event => {
      const voiceKey = document.querySelector(`button[data-code = 'voice']`);
      //console.log(event.results);
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      console.log(transcript);

      if (event.results[0].isFinal) {
        //p = document.createElement('p');
        this.properties.value += transcript + ' ';
        //console.log(this.properties.cursorPosition);
        this._triggerEvent('oninput');

      }

      voiceKey.addEventListener('click', () => {
        recognition.stop();
        this.properties.cursorPosition = this.properties.value.length;
        this._cursorMove('get');
      });
    });

    recognition.addEventListener('end', recognition.start);

    recognition.start();
  },



  open(initialValue, oninput, onclose) {
    this.properties.value = initialValue || '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.properties.value = '';
    this.eventHandlers.oninput = oninput;
    this.eventHandlers.onclose = onclose;
    this.elements.main.classList.add('keyboard--hidden');
  },
};

window.addEventListener('DOMContentLoaded', function () {
  Keyboard.init();
});

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
