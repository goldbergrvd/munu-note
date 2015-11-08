"use strict";

var Beat = React.createClass({
  displayName: "Beat",

  render: function render() {
    var beat = this.props.beat.notes.reduce(function (memo, note) {
      memo.push(React.createElement(
        "span",
        { className: "number" + (note.editing ? " note-editing" : "") },
        note.note
      ));
      if (note.right) {
        memo.push(React.createElement(
          "span",
          { className: "half" },
          note.right
        ));
      }

      return memo;
    }, []);

    return React.createElement(
      "div",
      { className: "beat beat-2 beat-4n" },
      React.createElement(
        "span",
        { className: "beat-number" },
        beat
      ),
      React.createElement("span", { className: "beat-top" }),
      React.createElement("span", { className: "beat-bottom" })
    );
  }

});

var Section = React.createClass({
  displayName: "Section",

  render: function render() {
    return React.createElement(
      "div",
      { className: "col-lg-2" },
      React.createElement(
        "div",
        { className: "section" },
        this.props.section.beats.map(function (beat) {
          return React.createElement(Beat, { beat: beat });
        })
      )
    );
  }

});

var Row = React.createClass({
  displayName: "Row",

  render: function render() {
    return React.createElement(
      "div",
      { className: "row" },
      this.props.sections.map(function (section) {
        return React.createElement(Section, { section: section });
      })
    );
  }

});

var NumberedMusicalNotation = React.createClass({
  displayName: "NumberedMusicalNotation",

  getDefaultProps: function getDefaultProps() {
    return {
      title: '賽馬',
      key: '1=F (6 3 弦)',
      meter: '2/4'
    };
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "h1",
        { className: "text-center" },
        this.props.title
      ),
      React.createElement(
        "h3",
        null,
        this.props.key,
        " ",
        this.props.meter
      ),
      this.props.rows.map(function (row) {
        return React.createElement(Row, { sections: row });
      })
    );
  }

});

var MusicalNoteEditor = React.createClass({
  displayName: "MusicalNoteEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['無', '0', '1', '2', '3', '4', '5', '6', '7', '—']
    };
  },

  onClick: function onClick(i) {
    this.props.onMusicalNoteChange(this.props.text[i]);
  },

  render: function render() {
    var _this = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "音符"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this.props.text.indexOf(_this.props.value) ? ' selected' : ''),
            onClick: _this.onClick.bind(_this, i) },
          text
        );
      })
    );
  }

});

var FingerMethodEditor = React.createClass({
  displayName: "FingerMethodEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['無', '０', '一', '二', '三', '四']
    };
  },

  getInitialState: function getInitialState() {
    return {
      selected: 0
    };
  },

  onClick: function onClick(i) {
    this.setState({ selected: i });
  },

  render: function render() {
    var _this2 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "指法"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this2.state.selected ? ' selected' : ''),
            onClick: _this2.onClick.bind(_this2, i) },
          text
        );
      }),
      React.createElement(
        "span",
        { className: "selection-tip" },
        "向上偏移："
      ),
      React.createElement(
        "select",
        null,
        React.createElement(
          "option",
          { value: "1" },
          "1"
        ),
        React.createElement(
          "option",
          { value: "2" },
          "2"
        ),
        React.createElement(
          "option",
          { value: "3" },
          "3"
        ),
        React.createElement(
          "option",
          { value: "4" },
          "4"
        ),
        React.createElement(
          "option",
          { value: "5" },
          "5"
        ),
        React.createElement(
          "option",
          { value: "6" },
          "6"
        ),
        React.createElement(
          "option",
          { value: "7" },
          "7"
        ),
        React.createElement(
          "option",
          { value: "8" },
          "8"
        ),
        React.createElement(
          "option",
          { value: "9" },
          "9"
        )
      )
    );
  }

});

var BowingEditor = React.createClass({
  displayName: "BowingEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['無', '拉弓', '推弓']
    };
  },

  getInitialState: function getInitialState() {
    return {
      selected: 0
    };
  },

  onClick: function onClick(i) {
    this.setState({ selected: i });
  },

  render: function render() {
    var _this3 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "弓法"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this3.state.selected ? ' selected' : ''),
            onClick: _this3.onClick.bind(_this3, i) },
          text
        );
      }),
      React.createElement(
        "span",
        { className: "selection-tip" },
        "向上偏移："
      ),
      React.createElement(
        "select",
        null,
        React.createElement(
          "option",
          { value: "1" },
          "1"
        ),
        React.createElement(
          "option",
          { value: "2" },
          "2"
        ),
        React.createElement(
          "option",
          { value: "3" },
          "3"
        ),
        React.createElement(
          "option",
          { value: "4" },
          "4"
        ),
        React.createElement(
          "option",
          { value: "5" },
          "5"
        ),
        React.createElement(
          "option",
          { value: "6" },
          "6"
        ),
        React.createElement(
          "option",
          { value: "7" },
          "7"
        ),
        React.createElement(
          "option",
          { value: "8" },
          "8"
        ),
        React.createElement(
          "option",
          { value: "9" },
          "9"
        )
      )
    );
  }

});

var InOutSideEditor = React.createClass({
  displayName: "InOutSideEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['無', '內弦', '外弦']
    };
  },

  getInitialState: function getInitialState() {
    return {
      selected: 0
    };
  },

  onClick: function onClick(i) {
    this.setState({ selected: i });
  },

  render: function render() {
    var _this4 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "內外弦"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this4.state.selected ? ' selected' : ''),
            onClick: _this4.onClick.bind(_this4, i) },
          text
        );
      }),
      React.createElement(
        "span",
        { className: "selection-tip" },
        "向上偏移："
      ),
      React.createElement(
        "select",
        null,
        React.createElement(
          "option",
          { value: "1" },
          "1"
        ),
        React.createElement(
          "option",
          { value: "2" },
          "2"
        ),
        React.createElement(
          "option",
          { value: "3" },
          "3"
        ),
        React.createElement(
          "option",
          { value: "4" },
          "4"
        ),
        React.createElement(
          "option",
          { value: "5" },
          "5"
        ),
        React.createElement(
          "option",
          { value: "6" },
          "6"
        ),
        React.createElement(
          "option",
          { value: "7" },
          "7"
        ),
        React.createElement(
          "option",
          { value: "8" },
          "8"
        ),
        React.createElement(
          "option",
          { value: "9" },
          "9"
        )
      )
    );
  }

});

var PitchEditor = React.createClass({
  displayName: "PitchEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['正常', '8vb', '8va', '15ma']
    };
  },

  getInitialState: function getInitialState() {
    return {
      selected: 0
    };
  },

  onClick: function onClick(i) {
    this.setState({ selected: i });
  },

  render: function render() {
    var _this5 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "音高"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this5.state.selected ? ' selected' : ''),
            onClick: _this5.onClick.bind(_this5, i) },
          text
        );
      })
    );
  }

});

var NoteValueEditor = React.createClass({
  displayName: "NoteValueEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['四分', '八分', '十六分', '三十二分', '六十四分']
    };
  },

  getInitialState: function getInitialState() {
    return {
      selected: 0
    };
  },

  onClick: function onClick(i) {
    this.setState({ selected: i });
  },

  render: function render() {
    var _this6 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "音符時值"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this6.state.selected ? ' selected' : ''),
            onClick: _this6.onClick.bind(_this6, i) },
          text
        );
      })
    );
  }

});

var FortePianoEditor = React.createClass({
  displayName: "FortePianoEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['正常', 'p', 'mp', 'pp', 'f', 'mf', 'ff']
    };
  },

  getInitialState: function getInitialState() {
    return {
      selected: 0
    };
  },

  onClick: function onClick(i) {
    this.setState({ selected: i });
  },

  render: function render() {
    var _this7 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "強弱"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this7.state.selected ? ' selected' : ''),
            onClick: _this7.onClick.bind(_this7, i) },
          text
        );
      })
    );
  }

});

var AccidentalEditor = React.createClass({
  displayName: "AccidentalEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['無', '♯', '♭', '♮']
    };
  },

  getInitialState: function getInitialState() {
    return {
      selected: 0
    };
  },

  onClick: function onClick(i) {
    this.setState({ selected: i });
  },

  render: function render() {
    var _this8 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "變音"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this8.state.selected ? ' selected' : ''),
            onClick: _this8.onClick.bind(_this8, i) },
          text
        );
      })
    );
  }

});

var RightOfNumberEditor = React.createClass({
  displayName: "RightOfNumberEditor",

  getDefaultProps: function getDefaultProps() {
    return {
      text: ['無', '附點', '空白']
    };
  },

  onClick: function onClick(i) {
    var value = this.whichValue(i);
    this.props.onRightOfNoteChange(value);
  },

  whichValue: function whichValue(i) {
    switch (i) {
      case 1:
        return '.';
      case 2:
        return ' ';
      default:
        return '';
    }
  },

  whichIndex: function whichIndex(value) {
    switch (value) {
      case '.':
        return 1;
      case ' ':
        return 2;
      default:
        return 0;
    }
  },

  render: function render() {
    var _this9 = this;

    return React.createElement(
      "fieldset",
      null,
      React.createElement(
        "legend",
        null,
        "右邊"
      ),
      this.props.text.map(function (text, i) {
        return React.createElement(
          "span",
          { className: 'selection' + (i === _this9.whichIndex(_this9.props.value) ? ' selected' : ''),
            onClick: _this9.onClick.bind(_this9, i) },
          text
        );
      })
    );
  }

});

var Pager = React.createClass({
  displayName: "Pager",

  onPrevBeatClick: function onPrevBeatClick() {
    this.props.onPrevBeatClick();
  },

  onNextBeatClick: function onNextBeatClick() {
    this.props.onNextBeatClick();
  },

  onPrevNoteClick: function onPrevNoteClick() {
    this.props.onPrevNoteClick();
  },

  onNextNoteClick: function onNextNoteClick() {
    this.props.onNextNoteClick();
  },

  onDeleteClick: function onDeleteClick() {
    this.props.onDeleteClick();
  },

  render: function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(
        "span",
        { className: "selection", onClick: this.onPrevBeatClick },
        "上一拍"
      ),
      React.createElement(
        "span",
        { className: "selection", onClick: this.onPrevNoteClick },
        "上一符"
      ),
      React.createElement(
        "span",
        { className: "selection", onClick: this.onNextNoteClick },
        "下一符"
      ),
      React.createElement(
        "span",
        { className: "selection", onClick: this.onNextBeatClick },
        "下一拍"
      ),
      React.createElement(
        "span",
        { className: "selection", onClick: this.onDeleteClick },
        "刪除"
      ),
      React.createElement(
        "span",
        { style: { marginLeft: 30 } },
        "段：",
        this.props.section
      ),
      React.createElement(
        "span",
        { style: { marginLeft: 30 } },
        "拍：",
        this.props.beat
      ),
      React.createElement(
        "span",
        { style: { marginLeft: 30 } },
        "符：",
        this.props.note
      )
    );
  }

});

var EditPanel = React.createClass({
  displayName: "EditPanel",

  getDefaultProps: function getDefaultProps() {
    return {
      sectionsPerRow: 6
    };
  },

  getInitialState: function getInitialState() {

    var sections = this.props.sections;

    if (sections.length === 0) {
      sections.push({
        beats: [{
          notes: [{
            note: "0",
            editing: true
          }]
        }]
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
              editNote: noteIndex
            };
          }
        }
      }
    }
  },

  componentDidMount: function componentDidMount() {
    window.addEventListener('keyup', (function (e) {
      console.log(e.which);
      switch (e.which) {
        case 37:
          // 左
          if (e.altKey) {
            this.onPrevBeatClick();
          } else {
            this.onPrevNoteClick();
          }
          break;
        case 39:
          // 右
          if (e.altKey) {
            this.onNextBeatClick();
          } else {
            this.onNextNoteClick();
          }
          break;
        case 38:
          // 上
          this.onPrevLineClick();
          break;
        case 40:
          // 下
          this.onNextLineClick();
          break;
        case 8:
          this.onDeleteClick();
          break;
        case 48: // 0
        case 49: // 1
        case 50: // 2
        case 51: // 3
        case 52: // 4
        case 53: // 5
        case 54: // 6
        case 55: // 7
        case 56: // 8
        case 57:
          // 9
          this.onMusicalNoteChange('' + (e.which - 48));
          break;
        case 189:
          // -
          this.onMusicalNoteChange('—');
          break;
        case 190:
          // .
          this.onRightOfNoteChange('.');
          break;
        case 32:
          // space
          this.onRightOfNoteChange(' ');
          break;
        case 27:
          // esc
          console.log(JSON.stringify(this.state.sections));
          break;
      }
    }).bind(this), false);

    this.renderMusicalNote();
  },

  renderMusicalNote: function renderMusicalNote() {
    var _this10 = this;

    var rows = this.state.sections.reduce(function (memo, section, i) {
      if (i % _this10.props.sectionsPerRow === 0) {
        var row = [section];
        memo.push(row);
      } else {
        memo[memo.length - 1].push(section);
      }
      return memo;
    }, []);
    ReactDOM.render(React.createElement(NumberedMusicalNotation, { rows: rows }), document.querySelector('.container'));
  },

  onMusicalNoteChange: function onMusicalNoteChange(value) {
    console.log('musical note change: ' + value);
    var newSections = this.state.sections;
    newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].note = value;

    this.setState({
      sections: newSections
    });
    // this.props.onEdit(newSections);
    this.renderMusicalNote();
  },

  onRightOfNoteChange: function onRightOfNoteChange(value) {
    console.log('right of note change: ' + value);
    var newSections = this.state.sections;
    if (value) {
      newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].right = value;
    } else {
      delete newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].right;
    }

    this.setState({
      sections: newSections
    });
    console.log(newSections);
    // this.props.onEdit(newSections);
    this.renderMusicalNote();
  },

  onPrevLineClick: function onPrevLineClick() {
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

  onNextLineClick: function onNextLineClick() {
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

  onPrevBeatClick: function onPrevBeatClick() {
    console.log('prev beat: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
  },

  onNextBeatClick: function onNextBeatClick() {
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
          notes: [{
            note: "0",
            editing: true
          }]
        });
      }
    } else {
      newSections.push({
        beats: [{
          notes: [{
            note: "0",
            editing: true
          }]
        }]
      });
    }

    this.setState({
      sections: newSections,
      editSection: newSectionIndex,
      editBeat: newBeatIndex,
      editNote: newNoteIndex
    });
    // this.props.onEdit(newSections);
    this.renderMusicalNote();
  },

  onPrevNoteClick: function onPrevNoteClick() {
    console.log('prev note: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var newSections = this.state.sections;

    var prevSectionIndex = this.state.editSection;
    var prevBeatIndex = this.state.editBeat;
    var prevNoteIndex = this.state.editNote;
    if (prevNoteIndex === 0) {
      if (prevBeatIndex === 0) {
        if (prevSectionIndex === 0) {} else {
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

  onNextNoteClick: function onNextNoteClick() {
    console.log('next note: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var nextNoteIndex = this.state.editNote + 1;
    var newSections = this.state.sections;
    var nextNote = newSections[this.state.editSection].beats[this.state.editBeat].notes[nextNoteIndex];

    delete newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].editing;
    if (!nextNote) {
      nextNote = {
        note: "0",
        editing: true
      };
      newSections[this.state.editSection].beats[this.state.editBeat].notes.push(nextNote);
    } else {
      nextNote.editing = true;
    }

    this.setState({
      sections: newSections,
      editNote: nextNoteIndex
    });

    // this.props.onEdit(newSections);
    this.renderMusicalNote();
  },

  onDeleteClick: function onDeleteClick() {
    console.log('delete note: section<' + this.state.editSection + '> beat<' + this.state.editBeat + '> note<' + this.state.editNote + '>');
    var newSections = this.state.sections;

    var newSectionIndex = this.state.editSection;
    var newBeatIndex = this.state.editBeat;
    var newNoteIndex = this.state.editNote;
    if (newNoteIndex === 0) {
      if (newBeatIndex === 0) {
        if (newSectionIndex === 0) {} else {
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
    // this.props.onEdit(newSections);
    this.renderMusicalNote();
  },

  render: function render() {
    var note = this.state.sections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote];
    return React.createElement(
      "div",
      null,
      React.createElement(MusicalNoteEditor, { value: note.note, onMusicalNoteChange: this.onMusicalNoteChange }),
      React.createElement(FingerMethodEditor, null),
      React.createElement(BowingEditor, null),
      React.createElement(InOutSideEditor, null),
      React.createElement(PitchEditor, null),
      React.createElement(NoteValueEditor, null),
      React.createElement(FortePianoEditor, null),
      React.createElement(AccidentalEditor, null),
      React.createElement(RightOfNumberEditor, { value: note.right, onRightOfNoteChange: this.onRightOfNoteChange }),
      React.createElement(Pager, { onPrevBeatClick: this.onPrevBeatClick,
        onNextBeatClick: this.onNextBeatClick,
        onPrevNoteClick: this.onPrevNoteClick,
        onNextNoteClick: this.onNextNoteClick,
        onDeleteClick: this.onDeleteClick,
        section: this.state.editSection + 1,
        beat: this.state.editBeat + 1, z: true,
        note: this.state.editNote + 1 })
    );
  }

});

// var sections = [];
var sections = [{ "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6" }, { "note": "5" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "6" }, { "note": "5" }, { "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6" }, { "note": "5" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "6" }, { "note": "5" }, { "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "3", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "5", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "3", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "5", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": "." }] }, { "notes": [{ "note": "6" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": "." }] }, { "notes": [{ "note": "6" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": "." }] }, { "notes": [{ "note": "6" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": "." }] }, { "notes": [{ "note": "6" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": " " }, { "note": "2" }] }, { "notes": [{ "note": "2", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": " " }, { "note": "2" }] }, { "notes": [{ "note": "2", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "5" }] }, { "notes": [{ "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "2" }] }, { "notes": [{ "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }] }, { "notes": [{ "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "5" }] }, { "notes": [{ "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "2" }] }, { "notes": [{ "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }] }, { "notes": [{ "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }, { "notes": [{ "note": "6" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }, { "notes": [{ "note": "6" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "—" }] }] }, { "beats": [{ "notes": [{ "note": "3" }] }, { "notes": [{ "note": "6", "right": "." }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "5", "right": "." }] }, { "notes": [{ "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "5", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "—" }] }] }, { "beats": [{ "notes": [{ "note": "3" }] }, { "notes": [{ "note": "6", "right": "." }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "5" }] }, { "notes": [{ "note": "5", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }] }, { "notes": [{ "note": "—" }] }] }, { "beats": [{ "notes": [{ "note": "5" }] }, { "notes": [{ "note": "6", "right": "." }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "1", "right": "." }] }, { "notes": [{ "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }] }, { "notes": [{ "note": "3", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "1", "right": "." }, { "note": "2" }] }, { "notes": [{ "note": "3", "right": " " }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "—" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "3" }, { "note": "3" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "5" }, { "note": "5" }, { "note": "5" }] }, { "notes": [{ "note": "5", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "5" }, { "note": "5" }, { "note": "6" }] }, { "notes": [{ "note": "1" }, { "note": "2" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6" }, { "note": "6" }, { "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "3" }, { "note": "3" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "5" }, { "note": "5" }, { "note": "5" }] }, { "notes": [{ "note": "5", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "2" }, { "note": "3" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "3", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "5" }, { "note": "5" }, { "note": "5" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "1" }, { "note": "1" }, { "note": "1" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "2" }, { "note": "3" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "3", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "1" }, { "note": "6" }, { "note": "1" }, { "note": "2" }] }, { "notes": [{ "note": "3" }, { "note": "2" }, { "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6" }, { "note": "5" }, { "note": "6" }, { "note": "1" }] }, { "notes": [{ "note": "5" }, { "note": "6" }, { "note": "5" }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "2" }, { "note": "3" }, { "note": "2" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "1" }, { "note": "6" }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "2" }] }, { "notes": [{ "note": "7", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "2" }] }, { "notes": [{ "note": "7", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "2" }] }, { "notes": [{ "note": "7", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "0", "right": " " }, { "note": "5" }] }, { "notes": [{ "note": "3", "right": " " }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "1", "right": " " }, { "note": "2" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "2", "right": " " }, { "note": "2" }] }, { "notes": [{ "note": "3", "right": " " }, { "note": "1" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "6" }, { "note": "1" }, { "note": "6" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "6" }, { "note": "1" }, { "note": "6" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "5" }, { "note": "3" }, { "note": "2" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "6" }, { "note": "1" }, { "note": "6" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "6" }, { "note": "1" }, { "note": "6" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "5" }, { "note": "3" }, { "note": "2" }] }, { "notes": [{ "note": "1", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "6", "right": "." }] }, { "notes": [{ "note": "3" }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "1", "right": " " }, { "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "3" }] }] }, { "beats": [{ "notes": [{ "note": "1" }, { "note": "6" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "3" }] }, { "notes": [{ "note": "5" }, { "note": "3" }, { "note": "5" }] }] }, { "beats": [{ "notes": [{ "note": "5" }, { "note": "3" }, { "note": "5" }] }, { "notes": [{ "note": "6" }, { "note": "5" }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "1" }, { "note": "6" }, { "note": "1" }] }, { "notes": [{ "note": "2" }, { "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }, { "notes": [{ "note": "3" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }, { "notes": [{ "note": "3" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }, { "notes": [{ "note": "3" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }] }, { "beats": [{ "notes": [{ "note": "3" }, { "note": "2" }, { "note": "1" }, { "note": "2" }] }, { "notes": [{ "note": "3" }, { "note": "2" }, { "note": "5" }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "—" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "—" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "—" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "0" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "6", "right": " " }, { "note": "6" }] }] }, { "beats": [{ "notes": [{ "note": "6" }] }, { "notes": [{ "note": "—", "editing": true }] }] }];

// ReactDOM.render(<NumberedMusicalNotation rows={sections} />,
//             document.querySelector('.container'));

ReactDOM.render(React.createElement(EditPanel, { sections: sections }), document.querySelector('.edit-panel'));