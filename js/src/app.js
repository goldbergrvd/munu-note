var Beat = React.createClass({

  statics: {
    toXnXd: function (obj) {
      return obj.n + 'n' + (obj.d ? '-' + obj.d + 'd' : '');
    }
  },

  render: function () {
    var beatLength = 'beat-' + Beat.toXnXd(this.props.beat.notes.reduce((memo, note) => {
      memo.n += 1;
      if (note.right) {
        memo.d += 1;
      }

      return memo;
    }, {
      n: 0,
      d: 0
    }));

    // 音符
    var beat = this.props.beat.notes.reduce((memo, note) => {
      memo.push(<span className={"number" + (note.editing ? " note-editing" : "")}>{note.note}</span>);
      if (note.right) {
        memo.push(<span className="half">{note.right}</span>);
      }

      return memo;
    }, []);

    // 指法
    var beatTop = this.props.beat.notes.reduce((memo, note) => {
      memo.rightOffset.n += 1;
      if (note.right) {
        memo.rightOffset.d += 1;
      }

      var offset = '-offset-' + Beat.toXnXd(memo.rightOffset);

      if (note.finger.tip) {
        memo.result.push(<span className={"finger tip" + offset + " tip-" + note.finger.offset + "-level"}>{note.finger.tip}</span>);
      }

      if (note.bowing.tip) {
        memo.result.push(<span className={note.bowing.tip + "-bow tip" + offset + " tip-" + note.bowing.offset + "-level"}></span>);
      }

      if (note.inOut.tip) {
        memo.result.push(<span className={"finger tip" + offset + " tip-" + note.inOut.offset + "-level"}>{note.inOut.tip}</span>);
      }

      return memo;
    }, {
      result: [],
      rightOffset: {
        n: 0,
        d: 0
      }
    })
    .result;

    // 音符時值的底線
    var under = [8, 16, 32, 64].map((v) => {
      return this.props.beat.notes.reduce((memo, note) => {
        memo.rightOffset.n += 1;

        if (note.value >= v) {
          var lastValue;
          if (memo.continuous) {
            lastValue = memo.result[memo.result.length - 1];
          } else {
            lastValue = {
              rightOffset: {
                n: memo.rightOffset.n,
                d: memo.rightOffset.d
              },
              length: {
                n: 0,
                d: 0
              }
            }
            memo.result.push(lastValue);
          }

          lastValue.length.n += 1;
          if (note.right) {
            lastValue.length.d += 1;
          }

          memo.continuous = true;
        } else {
          memo.continuous = false;
        }

        if (note.right) {
          memo.rightOffset.d += 1;
        }

        return memo;
      }, {
        result: [],
        continuous: false,
        rightOffset: {
          n: 0,
          d: 0
        }
      })
      .result;
    });

    // 音符時值放進 beatBottom
    var beatBottom = [];
    under.forEach((eachUnder, i) => {
      var value = ((i) => {
        switch (i) {
          case 0: return '8';
          case 1: return '16';
          case 2: return '32';
          case 3: return '64';
        }
      }(i));
      eachUnder.forEach((eachValue) => {
        var type = "under-" + value + "th";
        var offset = "under-offset-" + Beat.toXnXd(eachValue.rightOffset);
        var length = "under-" + Beat.toXnXd(eachValue.length);
        beatBottom.push(<span className={"under " + type + " " + offset + " " + length}></span>);
      });
    });

    // 音高
    this.props.beat.notes.reduce((memo, note) => {
      memo.n += 1;

      switch (note.pitch) {
        case 'normal': break;
        case '8vb':
          beatBottom.push(<span className={"dot dot-offset-" + Beat.toXnXd(memo)}></span>);
          break;
        case '8va':
          beatTop.push(<span className={"dot dot-offset-" + Beat.toXnXd(memo)}></span>);
          break;
        case '15ma':
          beatTop.push(<span className={"dot dot-offset-" + Beat.toXnXd(memo)}></span>);
          beatTop.push(<span className={"dot dot-offset-" + Beat.toXnXd(memo) + " double-eight"}></span>);
          break;
        default:
          console.log('note.pitch 不應該出現 "' + note.pitch + '" 這種值...');
          break;
      }

      if (note.right) {
        memo.d += 1;
      }

      return memo;
    }, {
      n: 0,
      d: 0
    });

    // 特殊記號(頓音,保持音,延長, 撥弦)
    this.props.beat.notes.reduce((memo, note) => {
      memo.n += 1;

      if (note.specialSign.tip) {
        var type = note.specialSign.tip;
        var rightOffset = "tip-offset-" + Beat.toXnXd(memo);
        var tipOffset = "tip-" + note.specialSign.offset + "-level";
        if (type === 'pick') {
          beatTop.push(<span className={"finger " + rightOffset + " " + tipOffset}>＋</span>);
        } else {
          beatTop.push(<span className={type + " " + rightOffset + " " + tipOffset}></span>);
        }
      }

      if (note.right) {
        memo.d += 1;
      }

      return memo;
    }, {
      n: 0,
      d: 0
    });

    // 連弓
    this.props.beat.notes.reduce((memo, note) => {
      memo.rightOffset.n += 1;

      if (note.continuousBowPixel > 1) {
        memo.result.push({
          rightXnXd: Beat.toXnXd(memo.rightOffset),
          arcLength: note.continuousBowPixel
        });
      }

      if (note.right) {
        memo.rightOffset.d += 1;
      }

      return memo;
    }, {
      result: [],
      rightOffset: {
        n: 0,
        d: 0
      }
    })
    .result.forEach((e) => {
      var type = "arc";
      var rightOffset = "arc-offset-" + e.rightXnXd;
      var style = { width: e.arcLength };
      beatTop.push(<span className={type + " " + rightOffset} style={style}></span>);
    });

    return (
      <div className={"beat beat-2 " + beatLength}>
        <span className="beat-number">{beat}</span>
        <span className="beat-top">{beatTop}</span>
        <span className="beat-bottom">{beatBottom}</span>
      </div>
    );
  }

});

var Section = React.createClass({

  render: function () {
    return (
      <div className="col-lg-2">
        <div className="section">
          {
            this.props.section.beats.map((beat) => {
              return <Beat beat={beat} />;
            })
          }
        </div>
      </div>
    );
  }

});

var Row = React.createClass({

  render: function () {
    return (
      <div className="row">
        {
          this.props.sections.map((section) => {
            return <Section section={section} />;
          })
        }
      </div>
    );
  }

});


var NumberedMusicalNotation = React.createClass({

  getDefaultProps: function () {
    return {
      title: '賽馬',
      key: '1=F (6 3 弦)',
      meter: '2/4'
    };
  },

  render: function () {
    return (
      <div>
        <h1 className="text-center">{this.props.title}</h1>
        <h3>{this.props.key} {this.props.meter}</h3>
        {
          this.props.rows.map((row) => {
            return <Row sections={ row } />;
          })
        }
      </div>
    );
  }

});

var KeyboardEventMixin = {
  componentDidMount: function() {
    window.addEventListener('keyup', this.keyboardEvent, false);
  },

  componentWillReceiveProps: function(nextProps) {
    if (nextProps.keyboardEnable) {
      window.addEventListener('keyup', this.keyboardEvent, false);
    } else {
      window.removeEventListener('keyup', this.keyboardEvent);
    }
  }
};

var MusicalNoteEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      text: ['無', '0', '1', '2', '3', '4', '5', '6', '7', '—'],
      tip: ['~', '0', '1', '2', '3', '4', '5', '6', '7', '-']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 48: // 0
      case 49: // 1
      case 50: // 2
      case 51: // 3
      case 52: // 4
      case 53: // 5
      case 54: // 6
      case 55: // 7
        this.onClick(e.which - 47);
        break;
      case 192: // ~
        this.onClick(0);
        break;
      case 189: // -
        this.onClick(9);
        break;
    }
  },

  onClick: function (i) {
    this.props.onMusicalNoteChange(this.props.text[i]);
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset>
        <legend>音符</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ tip + 'selection' + (i === this.props.text.indexOf(this.props.value) ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}
                         data-tip={this.props.tip[i]}>{text}</span>;
          })
        }
      </fieldset>
    );
  }

});

var FingerMethodEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      text: ['無', '０', '一', '二', '三', '四'],
      tip: ['Q', 'W', 'E', 'R', 'T', 'Y']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 81: // Q
        this.onClick(0);
        break;
      case 87: // W
        this.onClick(1);
        break;
      case 69: // E
        this.onClick(2);
        break;
      case 82: // R
        this.onClick(3);
        break;
      case 84: // T
        this.onClick(4);
        break;
      case 89: // Y
        this.onClick(5);
        break;
    }
  },

  onClick: function (i) {
    var tip = this.props.text[i];
    if (tip === '無') {
      tip = '';
    }
    var selectedIndex = this.refs.fieldset.querySelector('select').selectedIndex;
    var offset = this.refs.fieldset.querySelector('option:nth-of-type(' + (selectedIndex + 1) + ')').value;
    this.props.onFingerMethodChange({
      tip: tip,
      offset: offset
    });
  },

  onOffsetChange: function (event) {
    var tip = this.refs.fieldset.querySelector('.selected').textContent;
    if (tip === '無') {
      tip = '';
    }
    var offset = event.target.value;
    this.props.onFingerMethodChange({
      tip: tip,
      offset: offset
    });
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset ref="fieldset">
        <legend>指法</legend>
        {
          this.props.text.map((text, i) => {
            var fingerStr = this.props.value.tip || '無';

            return <span className={ tip + 'selection' + (i === this.props.text.indexOf(fingerStr) ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}
                         data-tip={this.props.tip[i]}>{text}</span>;
          })
        }
        <span className="selection-tip">向上偏移：</span>
        <select onChange={this.onOffsetChange} value={this.props.value.offset}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </fieldset>
    );
  }

});

var BowingEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      items: [
        {text: '無', value: ''},
        {text: '拉弓', value: 'pull'},
        {text: '推弓', value: 'push'}
      ],
      tip: ['P', '[', ']']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 80: // P
        this.onClick(0);
        break;
      case 219: // [
        this.onClick(1);
        break;
      case 221: // ]
        this.onClick(2);
        break;
    }
  },

  onClick: function (i) {
    var tip = this.props.items[i].value;
    var selectedIndex = this.refs.fieldset.querySelector('select').selectedIndex;
    var offset = this.refs.fieldset.querySelector('option:nth-of-type(' + (selectedIndex + 1) + ')').value;
    this.props.onBowingChange({
      tip: tip,
      offset: offset
    });
  },

  onOffsetChange: function (event) {
    var text = this.refs.fieldset.querySelector('.selected').textContent;
    var selectedItem = this.props.items.find((item) => { return item.text === text; });
    var offset = event.target.value;
    this.props.onBowingChange({
      tip: selectedItem.value,
      offset: offset
    });
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset ref="fieldset">
        <legend>弓法</legend>
        {
          this.props.items.map((item, i) => {
            return <span className={ tip + 'selection' + (item.value === this.props.value.tip ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}
                         data-tip={this.props.tip[i]}>{item.text}</span>;
          })
        }
        <span className="selection-tip">向上偏移：</span>
        <select onChange={this.onOffsetChange} value={this.props.value.offset}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </fieldset>
    );
  }

});

var InOutSideEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      text: ['無', '內弦', '外弦'],
      tip: ['U', 'I', 'O']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 85: // U
        this.onClick(0);
        break;
      case 73: // I
        this.onClick(1);
        break;
      case 79: // O
        this.onClick(2);
        break;
    }
  },

  onClick: function (i) {
    var tip = this.props.text[i].substring(0, 1);
    if (tip === '無') {
      tip = '';
    }
    var selectedIndex = this.refs.fieldset.querySelector('select').selectedIndex;
    var offset = this.refs.fieldset.querySelector('option:nth-of-type(' + (selectedIndex + 1) + ')').value;
    this.props.onInOutChange({
      tip: tip,
      offset: offset
    });
  },

  onOffsetChange: function (event) {
    var tip = this.refs.fieldset.querySelector('.selected').textContent.substring(0, 1);
    if (tip === '無') {
      tip = '';
    }
    var offset = event.target.value;
    this.props.onInOutChange({
      tip: tip,
      offset: offset
    });
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset ref="fieldset">
        <legend>內外弦</legend>
        {
          this.props.text.map((text, i) => {
            var fingerStr = this.props.value.tip || '無';
            if (fingerStr !== '無') {
              fingerStr += '弦';
            }
            return <span className={ tip + 'selection' + (i === this.props.text.indexOf(fingerStr) ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}
                         data-tip={this.props.tip[i]}>{text}</span>;
          })
        }
        <span className="selection-tip">向上偏移：</span>
        <select onChange={this.onOffsetChange} value={this.props.value.offset}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </fieldset>
    );
  }

});

var PitchEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      items: ['normal', '8vb', '8va', '15ma'],
      itemMapping: {
        'normal': '正常',
        '8vb': { number: '8', postfix: 'vb'},
        '8va': { number: '8', postfix: 'va'},
        '15ma': { number: '15', postfix: 'ma'}
      },
      tip: ['A', 'S', 'D', 'F']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 65: // A
        this.onClick(0);
        break;
      case 83: // S
        this.onClick(1);
        break;
      case 68: // D
        this.onClick(2);
        break;
      case 70: // F
        this.onClick(3);
        break;
    }
  },

  onClick: function (i) {
    this.props.onPitchChange(this.props.items[i]);
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset>
        <legend>音高</legend>
        {
          this.props.items.map((text, i) => {
            var viewText;
            if (i === 0) {
              return <span className={ tip + 'selection' + (text === this.props.value ? ' selected' : '') }
                           onClick={this.onClick.bind(this, i)}
                           data-tip={this.props.tip[i]}>
                       {this.props.itemMapping[text]}
                     </span>;
            } else {
              var itemObj = this.props.itemMapping[text];
              return <span className={ tip + 'selection' + (text === this.props.value ? ' selected' : '') }
                           onClick={this.onClick.bind(this, i)}
                           data-tip={this.props.tip[i]}>
                       {itemObj.number}
                       <sup>{itemObj.postfix}</sup>
                     </span>;
            }
          })
        }
      </fieldset>
    );
  }

});

var NoteValueEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      items: [
        {text: '四分', value: 4},
        {text: '八分', value: 8},
        {text: '十六分', value: 16},
        {text: '三十二分', value: 32},
        {text: '六十四分', value: 64}
      ],
      tip: ['G', 'H', 'J', 'K', 'L']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 71: // G
        this.onClick(0);
        break;
      case 72: // H
        this.onClick(1);
        break;
      case 74: // J
        this.onClick(2);
        break;
      case 75: // K
        this.onClick(3);
        break;
      case 76: // L
        this.onClick(4);
        break;
    }
  },

  onClick: function (i) {
    this.props.onNoteValueChange(this.props.items[i].value);
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset>
        <legend>音符時值</legend>
        {
          this.props.items.map((item, i) => {
            return <span className={ tip + 'selection' + (item.value === this.props.value ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}
                         data-tip={this.props.tip[i]}>{item.text}</span>;
          })
        }
      </fieldset>
    );
  }

});

var FortePianoEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      text: ['正常', 'p', 'mp', 'pp', 'f', 'mf', 'ff'],
      tip: ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 90: // Z
        this.onClick(0);
        break;
      case 88: // X
        this.onClick(1);
        break;
      case 67: // C
        this.onClick(2);
        break;
      case 86: // V
        this.onClick(3);
        break;
      case 66: // B
        this.onClick(4);
        break;
      case 78: // N
        this.onClick(3);
        break;
      case 77: // M
        this.onClick(4);
        break;
    }
  },

  getInitialState: function () {
    return {
      selected: 0
    };
  },

  onClick: function (i) {
    this.setState({ selected: i });
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset>
        <legend>強弱</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ tip +'selection' + (i === this.state.selected ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}
                         data-tip={this.props.tip[i]}>{text}</span>;
          })
        }
      </fieldset>
    );
  }

});

var SpecialSignEditor = React.createClass({

  getDefaultProps: function () {
    return {
      items: [
        { text: '無', value: ''},
        { text: '頓音', value: 'staccato'},
        { text: '保持音', value: 'hold-tone'},
        { text: '延長', value: 'fermata'},
        { text: '撥弦', value: 'pick'}
      ]
    };
  },

  onClick: function (i) {
    var tip = this.props.items[i].value;
    var selectedIndex = this.refs.fieldset.querySelector('select').selectedIndex;
    var offset = this.refs.fieldset.querySelector('option:nth-of-type(' + (selectedIndex + 1) + ')').value;

    this.props.onSpecialSignChange({
      tip: tip,
      offset: offset
    });
  },

  onOffsetChange: function (event) {
    var tip = this.refs.fieldset.querySelector('.selected').textContent;
    this.props.items.forEach((item) => {
      if (item.text === tip) {
        tip = item.value;
      }
    });
    var offset = event.target.value;

    this.props.onSpecialSignChange({
      tip: tip,
      offset: offset
    });
  },

  render: function() {
    return (
      <fieldset ref="fieldset">
        <legend>特別記號</legend>
        {
          this.props.items.map((item, i) => {
            return <span className={ 'selection' + (item.value === this.props.value.tip ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}>{item.text}</span>;
          })
        }
        <span className="selection-tip">向上偏移：</span>
        <select onChange={this.onOffsetChange} value={this.props.value.offset}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
          <option value="7">7</option>
          <option value="8">8</option>
          <option value="9">9</option>
        </select>
      </fieldset>
    );
  }

});

var ContinuousBowEditor = React.createClass({

  onContinuousBowChange: function (event) {
    this.props.onContinuousBowChange(event.target.value);
  },

  onChange: function (event) {
    this.props.onContinuousBowChange(event.target.value);
  },

  onFocus: function (event) {
    this.props.onKeyboardEnable(false);
  },

  onBlur: function (event) {
    this.props.onKeyboardEnable(true);
  },

  render: function() {
    return (
      <fieldset ref="fieldset">
        <legend>連弓</legend>
        <span>長度：</span>
        <input value={this.props.value} onChange={this.onChange} onFocus={this.onFocus} onBlur={this.onBlur}></input>
        <span> pixel</span>
      </fieldset>
    );
  }

});

var AccidentalEditor = React.createClass({

  getDefaultProps: function () {
    return {
      text: ['無', '♯', '♭', '♮']
    };
  },

  getInitialState: function () {
    return {
      selected: 0
    };
  },

  onClick: function (i) {
    this.setState({ selected: i });
  },

  render: function () {
    return (
      <fieldset>
        <legend>變音</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ 'selection' + (i === this.state.selected ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}>{text}</span>;
          })
        }
      </fieldset>
    );
  }

});

var RightOfNumberEditor = React.createClass({

  mixins: [KeyboardEventMixin],

  getDefaultProps: function () {
    return {
      text: ['無', '附點', '空白'],
      tip: [',', '.', 'sp']
    };
  },

  keyboardEvent: function (e) {
    switch (e.which) {
      case 188: // ,
        this.onClick(0);
        break;
      case 190: // .
        this.onClick(1);
        break;
      case 32: // space
        this.onClick(2);
        break;
    }
  },

  onClick: function (i) {
    var value = this.whichValue(i);
    this.props.onRightOfNoteChange(value);
  },

  whichValue: function (i) {
    switch (i) {
      case 1: return '.';
      case 2: return ' ';
      default: return '';
    }
  },

  whichIndex: function (value) {
    switch (value) {
      case '.': return 1;
      case ' ': return 2;
      default: return 0;
    }
  },

  render: function () {

    var tip = (this.props.keyboardEnable ? 'tip ' : '');

    return (
      <fieldset>
        <legend>右邊</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ tip + 'selection' + (i === this.whichIndex(this.props.value) ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}
                         data-tip={this.props.tip[i]}>{text}</span>;
          })
        }
      </fieldset>
    );
  }

});

var Pager = React.createClass({

  onPrevBeatClick: function () {
    this.props.onPrevBeatClick();
  },

  onNextBeatClick: function () {
    this.props.onNextBeatClick();
  },

  onPrevNoteClick: function () {
    this.props.onPrevNoteClick();
  },

  onNextNoteClick: function () {
    this.props.onNextNoteClick();
  },

  onDeleteClick: function () {
    this.props.onDeleteClick();
  },

  render: function() {
    return (
      <div>
        <span className="selection" onClick={this.onPrevBeatClick}>上一拍</span>
        <span className="selection" onClick={this.onPrevNoteClick}>上一符</span>
        <span className="selection" onClick={this.onNextNoteClick}>下一符</span>
        <span className="selection" onClick={this.onNextBeatClick}>下一拍</span>
        <span className="selection" onClick={this.onDeleteClick}>刪除</span>
        <span style={{marginLeft: 30}}>段：{this.props.section}</span>
        <span style={{marginLeft: 30}}>拍：{this.props.beat}</span>
        <span style={{marginLeft: 30}}>符：{this.props.note}</span>
      </div>
    );
  }

});


var EditPanel = React.createClass({

  getDefaultProps: function() {
    return {
      sectionsPerRow: 6
    };
  },

  getInitialState: function() {

    var sections = this.props.sections;

    if (sections.length === 0) {
      sections.push({
                      beats: [
                        {
                          notes: [new Note()]
                        }
                      ]
                    });
    }

    for (var sectionIndex = 0; sectionIndex < sections.length; sectionIndex++) {
      var section = sections[sectionIndex];

      for (var beatIndex = 0; beatIndex < section.beats.length; beatIndex++) {
        var beat = section.beats[beatIndex];

        for (var noteIndex = 0; noteIndex < beat.notes.length; noteIndex++) {
          var note = beat.notes[noteIndex];

          if (note.editing) {
            return {
              sections: sections,
              editSection: sectionIndex,
              editBeat: beatIndex,
              editNote: noteIndex,
              keyboard: true
            };
          }

        }
      }
    }
  },

  componentDidMount: function() {
    window.addEventListener('keyup', function (e) {
      console.log(e.which);
      switch (e.which) {
        case 37: // 左
          if (e.altKey) {
            this.onPrevBeatClick();
          } else {
            this.onPrevNoteClick();
          }
          break;
        case 39: // 右
          if (e.altKey) {
            this.onNextBeatClick();
          } else {
            this.onNextNoteClick();
          }
          break;
        case 38: // 上
          this.onPrevLineClick();
          break;
        case 40: // 下
          this.onNextLineClick();
          break;
        case 8:
          this.onDeleteClick();
          break;
        // case 48: // 0
        // case 49: // 1
        // case 50: // 2
        // case 51: // 3
        // case 52: // 4
        // case 53: // 5
        // case 54: // 6
        // case 55: // 7
        //   this.onMusicalNoteChange('' + (e.which - 48));
        //   break;
        // case 192: // ~
        //   this.onMusicalNoteChange('無');
        //   break;
        // case 189: // -
        //   this.onMusicalNoteChange('—');
        //   break;
        // case 190: // .
        //   this.onRightOfNoteChange('.');
        //   break;
        // case 32: // space
        //   this.onRightOfNoteChange(' ');
        //   break;
        case 67: // c
          if (e.ctrlKey) {
            if (e.altKey) {
              this.onCopyPrevSection();
            } else {
              this.onCopyPrevBeat();
            }
          }
          break;
        case 27: // esc
          console.log(JSON.stringify(this.state.sections));
          break;
      }
    }.bind(this), false);

    this.renderMusicalNote();
  },

  renderMusicalNote: function () {
    var rows = this.state.sections.reduce((memo, section, i) => {
      if (i % this.props.sectionsPerRow === 0) {
        var row = [section];
        memo.push(row);
      } else {
        memo[memo.length - 1].push(section);
      }
      return memo;
    }, []);
    ReactDOM.render(<NumberedMusicalNotation rows={rows} />,
            document.querySelector('.container'));
  },

  onKeyboardEnable: function (isEnable) {
    this.setState({
      keyboard: isEnable
    });
  },

  setEditNoteValue: function(property, value) {
    console.log(property + ': ' + (value.tip ? value.tip + '-' + value.offset : value));
    var newSections = this.state.sections;
    if (property === 'right') {
      if (value) {
        newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].right = value;
      } else {
        delete newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].right;
      }
    } else {
      newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote][property] = value;
    }
    this.setState({ sections: newSections });
    this.renderMusicalNote();
  },

  onMusicalNoteChange: function (value) {
    this.setEditNoteValue('note', value);
  },

  onRightOfNoteChange: function (value) {
    this.setEditNoteValue('right', value);
  },

  onFingerMethodChange: function (value) {
    this.setEditNoteValue('finger', value);
  },

  onBowingChange: function (value) {
    this.setEditNoteValue('bowing', value);
  },

  onInOutChange: function (value) {
    this.setEditNoteValue('inOut', value);
  },

  onSpecialSignChange: function (value) {
    this.setEditNoteValue('specialSign', value);
  },

  onPitchChange: function (value) {
    this.setEditNoteValue('pitch', value);
  },

  onNoteValueChange: function (value) {
    this.setEditNoteValue('value', value);
  },

  onContinuousBowChange: function (value) {
    this.setEditNoteValue('continuousBowPixel', value);
  },

  onPrevLineClick: function () {
    var newSections = this.state.sections,
        newSectionIndex = this.state.editSection - this.props.sectionsPerRow;
    if (newSectionIndex >= 0) {
      delete newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].editing;
      newSections[newSectionIndex].beats[0].notes[0].editing = true;

      this.setState({
        sections: newSections,
        editSection: newSectionIndex,
        editBeat: 0,
        editNote: 0
      });

      this.renderMusicalNote();
    }
  },

  onNextLineClick: function () {
    var newSections = this.state.sections,
        newSectionIndex = this.state.editSection + this.props.sectionsPerRow;
    if (newSectionIndex < newSections.length) {
      delete newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].editing;
      newSections[newSectionIndex].beats[0].notes[0].editing = true;

      this.setState({
        sections: newSections,
        editSection: newSectionIndex,
        editBeat: 0,
        editNote: 0
      });

      this.renderMusicalNote();
    }
  },

  onPrevBeatClick: function () {
    console.log('prev beat: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
  },

  onNextBeatClick: function () {
    console.log('next beat: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var newNoteIndex = 0;
    var newBeatIndex = this.state.editBeat;
    var newSectionIndex = this.state.editSection;
    if (this.state.editBeat === 0) {
      newBeatIndex = 1;
    } else {
      newBeatIndex = 0;
      newSectionIndex += 1;
    }

    var newSections = this.state.sections;
    delete newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].editing;
    if (newSections[newSectionIndex]) {
      if (newSections[newSectionIndex].beats[newBeatIndex]) {
        newSections[newSectionIndex].beats[newBeatIndex].notes[newNoteIndex].editing = true;
      } else {
        newSections[newSectionIndex].beats.push({
          notes: [new Note()]
        });
      }
    } else {
      newSections.push({
        beats: [
          {
            notes: [new Note()]
          }
        ]
      });
    }

    this.setState({
      sections: newSections,
      editSection: newSectionIndex,
      editBeat: newBeatIndex,
      editNote: newNoteIndex
    });

    this.renderMusicalNote();
  },

  onPrevNoteClick: function () {
    console.log('prev note: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var newSections = this.state.sections;

    var prevSectionIndex = this.state.editSection;
    var prevBeatIndex = this.state.editBeat;
    var prevNoteIndex = this.state.editNote;
    if (prevNoteIndex === 0) {
      if (prevBeatIndex === 0) {
        if (prevSectionIndex === 0) {

        } else {
          delete newSections[prevSectionIndex].beats[prevBeatIndex].notes[prevNoteIndex].editing;
          prevSectionIndex -= 1;
          prevBeatIndex = newSections[prevSectionIndex].beats.length - 1;
          prevNoteIndex = newSections[prevSectionIndex].beats[prevBeatIndex].notes.length - 1;
        }
      } else {
        delete newSections[prevSectionIndex].beats[prevBeatIndex].notes[prevNoteIndex].editing;
        prevBeatIndex -= 1;
        prevNoteIndex = newSections[prevSectionIndex].beats[prevBeatIndex].notes.length - 1;
      }
    } else {
      delete newSections[prevSectionIndex].beats[prevBeatIndex].notes[prevNoteIndex].editing;
      prevNoteIndex -= 1;
    }

    newSections[prevSectionIndex].beats[prevBeatIndex].notes[prevNoteIndex].editing = true;

    this.setState({
      sections: newSections,
      editSection: prevSectionIndex,
      editBeat: prevBeatIndex,
      editNote: prevNoteIndex
    });

    this.renderMusicalNote();
  },

  onNextNoteClick: function () {
    console.log('next note: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var nextNoteIndex = this.state.editNote + 1;
    var newSections = this.state.sections;
    var nextNote = newSections[this.state.editSection].beats[this.state.editBeat].notes[nextNoteIndex];

    delete newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].editing;
    if (!nextNote) {
      nextNote = new Note();
      newSections[this.state.editSection].beats[this.state.editBeat].notes.push(nextNote);
    } else {
      nextNote.editing = true;
    }

    this.setState({
      sections: newSections,
      editNote: nextNoteIndex
    });

    this.renderMusicalNote();
  },

  onDeleteClick: function () {
    console.log('delete note: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var newSections = this.state.sections;

    var newSectionIndex = this.state.editSection;
    var newBeatIndex = this.state.editBeat;
    var newNoteIndex = this.state.editNote;
    if (newNoteIndex === 0) {
      if (newBeatIndex === 0) {
        if (newSectionIndex === 0) {

        } else {
          newSections.pop();
          newSectionIndex -= 1;
          newBeatIndex = newSections[newSectionIndex].beats.length - 1;
          newNoteIndex = newSections[newSectionIndex].beats[newBeatIndex].notes.length - 1;
        }
      } else {
        newSections[newSectionIndex].beats.pop();
        newBeatIndex -= 1;
        newNoteIndex = newSections[newSectionIndex].beats[newBeatIndex].notes.length - 1;
      }
    } else {
      newSections[newSectionIndex].beats[newBeatIndex].notes.pop();
      newNoteIndex -= 1;
    }

    newSections[newSectionIndex].beats[newBeatIndex].notes[newNoteIndex].editing = true;

    this.setState({
      sections: newSections,
      editSection: newSectionIndex,
      editBeat: newBeatIndex,
      editNote: newNoteIndex
    });

    this.renderMusicalNote();
  },

  onCopyPrevBeat: function () {
    console.log('copy prev beat: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var newSections = this.state.sections;
    var copySectionIndex = this.state.editSection;
    var copyBeatIndex = this.state.editBeat;

    if (copyBeatIndex === 0) {
      if (copySectionIndex !== 0) {
        copySectionIndex -= 1;
        copyBeatIndex = newSections[copySectionIndex].beats.length - 1;
      } else {
        return;
      }
    } else {
      copyBeatIndex -= 1;
    }

    var copyBeat = JSON.parse(JSON.stringify(newSections[copySectionIndex].beats[copyBeatIndex]));
    var lastNoteIndex = copyBeat.notes.length - 1;
    copyBeat.notes[lastNoteIndex].editing = true;
    newSections[this.state.editSection].beats[this.state.editBeat] = copyBeat;

    this.setState({
      sections: newSections,
      editNote: lastNoteIndex
    });

    this.renderMusicalNote();
  },

  onCopyPrevSection: function () {
    console.log('copy prev section: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var newSections = this.state.sections;
    var copySectionIndex = this.state.editSection;

    if (copySectionIndex !== 0) {
      copySectionIndex -= 1;
    } else {
      return;
    }

    var copySection = JSON.parse(JSON.stringify(newSections[copySectionIndex]));
    var lastBeatIndex = copySection.beats.length - 1;
    var lastNoteOfLastBeatIndex = copySection.beats[lastBeatIndex].notes.length - 1;
    copySection.beats[lastBeatIndex].notes[lastNoteOfLastBeatIndex].editing = true;
    newSections[this.state.editSection] = copySection;

    this.setState({
      sections: newSections,
      editBeat: lastBeatIndex,
      editNote: lastNoteOfLastBeatIndex
    });

    this.renderMusicalNote();
  },

  render: function () {
    var note = this.state.sections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote];
    return (
      <div>
        <MusicalNoteEditor value={note.note} onMusicalNoteChange={this.onMusicalNoteChange} keyboardEnable={this.state.keyboard} />
        <FingerMethodEditor value={note.finger} onFingerMethodChange={this.onFingerMethodChange} keyboardEnable={this.state.keyboard} />
        <BowingEditor value={note.bowing} onBowingChange={this.onBowingChange} keyboardEnable={this.state.keyboard} />
        <InOutSideEditor value={note.inOut} onInOutChange={this.onInOutChange} keyboardEnable={this.state.keyboard} />
        <PitchEditor value={note.pitch} onPitchChange={this.onPitchChange} keyboardEnable={this.state.keyboard} />
        <NoteValueEditor value={note.value} onNoteValueChange={this.onNoteValueChange} keyboardEnable={this.state.keyboard} />
        <FortePianoEditor />
        <SpecialSignEditor value={note.specialSign} onSpecialSignChange={this.onSpecialSignChange} />
        <ContinuousBowEditor value={note.continuousBowPixel} onContinuousBowChange={this.onContinuousBowChange} onKeyboardEnable={this.onKeyboardEnable} />
        <AccidentalEditor />
        <RightOfNumberEditor value={note.right} onRightOfNoteChange={this.onRightOfNoteChange} keyboardEnable={this.state.keyboard} />
        <Pager onPrevBeatClick={this.onPrevBeatClick}
               onNextBeatClick={this.onNextBeatClick}
               onPrevNoteClick={this.onPrevNoteClick}
               onNextNoteClick={this.onNextNoteClick}
               onDeleteClick={this.onDeleteClick}
               section={this.state.editSection + 1}
               beat={this.state.editBeat + 1}
               note={this.state.editNote + 1} />
      </div>
    );
  }

});

function Note() {
  this.note = '0';
  this.finger = {
    tip: '',
    offset: 1
  };
  this.bowing = {
    tip: '',
    offset: 1
  };
  this.inOut = {
    tip: '',
    offset: 1
  };
  this.value = 4;
  this.pitch = 'normal';
  this.specialSign = {
    tip: '',
    offset: 1
  };
  this.continuousBowPixel = 0;
  this.editing = true;
}

var sections = [];
// var sections = [{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"3","right":" "},{"note":"6"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"3","right":" "},{"note":"6"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"2"}]},{"notes":[{"note":"2","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"2"}]},{"notes":[{"note":"2","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"}]},{"notes":[{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"}]},{"notes":[{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"6","right":"."},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5","right":"."}]},{"notes":[{"note":"3"}]}]},{"beats":[{"notes":[{"note":"5","right":" "},{"note":"6"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"6","right":"."},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"6","right":"."},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"1","right":"."}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"3","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"1","right":"."},{"note":"2"}]},{"notes":[{"note":"3","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"3"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"5"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"6"}]},{"notes":[{"note":"1"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"6"},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"5"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"2"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"3","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"5"}]},{"notes":[{"note":"6","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"1"},{"note":"1"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"2"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"3","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"6"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"5"},{"note":"6"},{"note":"1"}]},{"notes":[{"note":"5"},{"note":"6"},{"note":"5"},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"1"},{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"2"}]},{"notes":[{"note":"7","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"2"}]},{"notes":[{"note":"7","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"2"}]},{"notes":[{"note":"7","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"5"}]},{"notes":[{"note":"3","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"2"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"2"}]},{"notes":[{"note":"3","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"5"},{"note":"3"},{"note":"2"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"5"},{"note":"3"},{"note":"2"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"6"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"}]},{"notes":[{"note":"5"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"5"},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"6"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"5"},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"0"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—","editing":true}]}]}];
// var sections = [{"beats":[{"notes":[{"note":"6","finger":{"tip":"二","offset":"4"},"bowing":{"tip":"pull","offset":"6"},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"3","finger":{"tip":"０","offset":"4"},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"一","offset":"4"},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":"6"},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"pull","offset":"3"},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":"6"},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"—","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":"."},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"—","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":"."},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"—","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":"."},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"right":"."}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":"."},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"—","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8,"right":" "},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":8}]}]},{"beats":[{"notes":[{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"5","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"3","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]},{"notes":[{"note":"2","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16},{"note":"1","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":16}]}]},{"beats":[{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]},{"notes":[{"note":"6","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4}]}]},{"beats":[{"notes":[{"note":"0","finger":{"tip":"","offset":1},"bowing":{"tip":"","offset":1},"inOut":{"tip":"","offset":1},"value":4,"editing":true}]}]}];

ReactDOM.render(<EditPanel sections={sections} />, document.querySelector('.edit-panel'));
