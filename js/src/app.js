var Beat = React.createClass({

  render: function () {
    var beat = this.props.beat.notes.reduce((memo, note) => {
        memo.push(<span className={"number" + (note.editing ? " note-editing" : "")}>{note.note}</span>);
        if (note.right) {
          memo.push(<span className="half">{note.right}</span>);
        }

      return memo;
    }, []);

    return (
      <div className={"beat beat-2 beat-4n"}>
        <span className="beat-number">{beat}</span>
        <span className="beat-top"></span>
        <span className="beat-bottom"></span>
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

var MusicalNoteEditor = React.createClass({

  getDefaultProps: function () {
    return {
      text: ['無', '0', '1', '2', '3', '4', '5', '6', '7', '—']
    };
  },

  onClick: function (i) {
    this.props.onMusicalNoteChange(this.props.text[i]);
  },

  render: function () {
    return (
      <fieldset>
        <legend>音符</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ 'selection' + (i === this.props.text.indexOf(this.props.value) ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}>{text}</span>;
          })
        }
      </fieldset>
    );
  }

});

var FingerMethodEditor = React.createClass({

  getDefaultProps: function () {
    return {
      text: ['無', '０', '一', '二', '三', '四']
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
        <legend>指法</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ 'selection' + (i === this.state.selected ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}>{text}</span>;
          })
        }
        <span className="selection-tip">向上偏移：</span>
        <select>
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

  getDefaultProps: function () {
    return {
      text: ['無', '拉弓', '推弓']
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
        <legend>弓法</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ 'selection' + (i === this.state.selected ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}>{text}</span>;
          })
        }
        <span className="selection-tip">向上偏移：</span>
        <select>
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

  getDefaultProps: function () {
    return {
      text: ['無', '內弦', '外弦']
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
        <legend>內外弦</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ 'selection' + (i === this.state.selected ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}>{text}</span>;
          })
        }
        <span className="selection-tip">向上偏移：</span>
        <select>
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

  getDefaultProps: function () {
    return {
      text: ['正常', '8vb', '8va', '15ma']
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
        <legend>音高</legend>
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

var NoteValueEditor = React.createClass({

  getDefaultProps: function () {
    return {
      text: ['四分', '八分', '十六分', '三十二分', '六十四分']
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
        <legend>音符時值</legend>
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

var FortePianoEditor = React.createClass({

  getDefaultProps: function () {
    return {
      text: ['正常', 'p', 'mp', 'pp', 'f', 'mf', 'ff']
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
        <legend>強弱</legend>
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

  getDefaultProps: function () {
    return {
      text: ['無', '附點', '空白']
    };
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
    return (
      <fieldset>
        <legend>右邊</legend>
        {
          this.props.text.map((text, i) => {
            return <span className={ 'selection' + (i === this.whichIndex(this.props.value) ? ' selected' : '') }
                         onClick={this.onClick.bind(this, i)}>{text}</span>;
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
                          notes: [
                            {
                              note: "0",
                              editing: true
                            }
                          ]
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
              editNote: noteIndex
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
        case 48: // 0
        case 49: // 1
        case 50: // 2
        case 51: // 3
        case 52: // 4
        case 53: // 5
        case 54: // 6
        case 55: // 7
        case 56: // 8
        case 57: // 9
          this.onMusicalNoteChange('' + (e.which - 48));
          break;
        case 189: // -
          this.onMusicalNoteChange('—');
          break;
        case 190: // .
          this.onRightOfNoteChange('.');
          break;
        case 32: // space
          this.onRightOfNoteChange(' ');
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

  onMusicalNoteChange: function (value) {
    console.log('musical note change: ' + value);
    var newSections = this.state.sections;
    newSections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote].note = value;

    this.setState({
      sections: newSections
    });

    this.renderMusicalNote();
  },

  onRightOfNoteChange: function (value) {
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

    this.renderMusicalNote();
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
          notes: [
            {
              note: "0",
              editing: true
            }
          ]
        });
      }
    } else {
      newSections.push({
        beats: [
          {
            notes: [
              {
                note: "0",
                editing: true
              }
            ]
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

  render: function () {
    var note = this.state.sections[this.state.editSection].beats[this.state.editBeat].notes[this.state.editNote];
    return (
      <div>
        <MusicalNoteEditor value={note.note} onMusicalNoteChange={this.onMusicalNoteChange} />
        <FingerMethodEditor />
        <BowingEditor />
        <InOutSideEditor />
        <PitchEditor />
        <NoteValueEditor />
        <FortePianoEditor />
        <AccidentalEditor />
        <RightOfNumberEditor value={note.right} onRightOfNoteChange={this.onRightOfNoteChange} />
        <Pager onPrevBeatClick={this.onPrevBeatClick}
               onNextBeatClick={this.onNextBeatClick}
               onPrevNoteClick={this.onPrevNoteClick}
               onNextNoteClick={this.onNextNoteClick}
               onDeleteClick={this.onDeleteClick}
               section={this.state.editSection + 1}
               beat={this.state.editBeat + 1}z
               note={this.state.editNote + 1} />
      </div>
    );
  }

});

// var sections = [];
var sections = [{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"5"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"3","right":" "},{"note":"6"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"3","right":" "},{"note":"6"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":"."}]},{"notes":[{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"2"}]},{"notes":[{"note":"2","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"2"}]},{"notes":[{"note":"2","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"}]},{"notes":[{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"}]},{"notes":[{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"6"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"6","right":"."},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5","right":"."}]},{"notes":[{"note":"3"}]}]},{"beats":[{"notes":[{"note":"5","right":" "},{"note":"6"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"6","right":"."},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"5"}]},{"notes":[{"note":"6","right":"."},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"1","right":"."}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"}]},{"notes":[{"note":"3","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"1","right":"."},{"note":"2"}]},{"notes":[{"note":"3","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"3"}]},{"notes":[{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"5"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"6"}]},{"notes":[{"note":"1"},{"note":"2"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"6"},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"5"}]},{"notes":[{"note":"5","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"2"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"3","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"5"},{"note":"5"}]},{"notes":[{"note":"6","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"1"},{"note":"1"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"2"},{"note":"3"}]},{"notes":[{"note":"6","right":" "},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"3","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"6"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6"},{"note":"5"},{"note":"6"},{"note":"1"}]},{"notes":[{"note":"5"},{"note":"6"},{"note":"5"},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"2"},{"note":"3"},{"note":"2"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"1"},{"note":"6"},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"2"}]},{"notes":[{"note":"7","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"2"}]},{"notes":[{"note":"7","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"6"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"2"}]},{"notes":[{"note":"7","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"6","right":" "},{"note":"3"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"0","right":" "},{"note":"5"}]},{"notes":[{"note":"3","right":" "},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"2"}]},{"notes":[{"note":"1","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"2","right":" "},{"note":"2"}]},{"notes":[{"note":"3","right":" "},{"note":"1"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"5"},{"note":"3"},{"note":"2"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"1"},{"note":"6"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"5"},{"note":"3"},{"note":"2"}]},{"notes":[{"note":"1","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"6","right":"."}]},{"notes":[{"note":"3"},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1","right":" "},{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"3"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"6"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"3"}]},{"notes":[{"note":"5"},{"note":"3"},{"note":"5"}]}]},{"beats":[{"notes":[{"note":"5"},{"note":"3"},{"note":"5"}]},{"notes":[{"note":"6"},{"note":"5"},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"1"},{"note":"6"},{"note":"1"}]},{"notes":[{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]}]},{"beats":[{"notes":[{"note":"3"},{"note":"2"},{"note":"1"},{"note":"2"}]},{"notes":[{"note":"3"},{"note":"2"},{"note":"5"},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"0"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"6","right":" "},{"note":"6"}]}]},{"beats":[{"notes":[{"note":"6"}]},{"notes":[{"note":"—","editing":true}]}]}];


ReactDOM.render(<EditPanel sections={sections} />, document.querySelector('.edit-panel'));
