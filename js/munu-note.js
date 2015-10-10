(function () {

  var audio = document.querySelector('#player > audio'),
      $stopBtn = $('#player > .stop'),
      $playPauseBtn = $('#player > .play-pause'),
      $repeatBtn = $('#player > .repeat'),
      $volume = $('#player > .volume'),
      $volumeBar = $('#player > .volume-bar'),
      $currTime = $('#player > .player-curr-time'),
      $totalTime = $('#player > .player-total-time'),
      $timebar = $('#player > .player-timebar'),
      $playerCursor = $('#player > .player-cursor'),
      $playerCursorArea = $('#player > .player-cursor-area');

  var $rows = $('.row'),
      currRowIndex = 0,
      prevVolumeLevel = 1,
      currPosHtml = '<div class="curr-pos">' +
                      '<span class="glyphicon glyphicon-chevron-right"></span>' +
                      '<span class="glyphicon glyphicon-chevron-left"></span>' +
                    '</div>';

  var $metronome = $('#metronome'),
      $noteList = $('#note-list');

  function formatSec(secValue) {
    var min = parseInt(secValue / 60),
        sec = parseInt(secValue % 60);
    return (min < 10 ? '0' : '') + min + ':' + (sec < 10 ? '0' : '') + sec ;
  }

  (function () {
    var arcRegex = /(\d)n(?:-(\d)d)?/,
        beatRegex = /.* beat-(\dn(?:-\dd)?)/,
        toInt = function (e) { return e === undefined ? 0 : parseInt(e); },
        beatLeft = {
          '1n': 25,
          '1n-1d': 18,
          '2n': 18,
          '2n-1d': 11,
          '3n': 10,
          '3n-1d': 5,
          '4n': 2
        },
        beatRight = {
          '1n': 25,
          '1n-1d': 18,
          '2n': 18,
          '2n-1d': 11,
          '3n': 10,
          '3n-1d': 5,
          '4n': 2,
          '4n-1d': -8
        };

    $('.arc[data-arc-from]').each(function (i, e) {
      var from = arcRegex.exec(e.dataset.arcFrom).slice(1).map(toInt),
          to = arcRegex.exec(e.dataset.arcTo).slice(1).map(toInt),
          crossCount = parseInt(e.dataset.arcCross),
          fromBeatN = beatRegex.exec(e.parentNode.parentNode.className)[1],
          toBeatN = (function () {
                      var resultBeat = e.parentNode.parentNode,
                          crossTemp = crossCount;
                      while (crossTemp > 0) {
                        resultBeat = resultBeat.nextElementSibling;
                        crossTemp--;
                      }
                      return beatRegex.exec(resultBeat.className)[1];
                    } ()),
          beatWidth = e.parentNode.parentNode.clientWidth,
          minWidth = from[0] * 15 + from[1] * 8 + beatRight[fromBeatN] +
                     crossCount * 10 + (crossCount - 1) * beatWidth +
                     beatLeft[toBeatN] + to[0] * 15 + to[1] * 8;
      $(e).css({
        minWidth: minWidth,
        top: (function () {
               return minWidth > 60 ? -10 : -8;
             }())
      });

    });
  }());

  (function () {
    var sectionSepWidth = 30,
        maskOffset = 16;

    $('.crescendo, .decrescendo').each(function (i, e) {
      var $e = $(e),
          cross = parseInt(e.dataset.cross),
          sectionWidth = e.parentNode.clientWidth,
          borderWidthValue = (sectionWidth * cross) + (sectionSepWidth * (cross - 1)),
          borderWidth = ($e.hasClass('crescendo') ?
                        '5px ' + borderWidthValue + 'px 5px 0px' :
                        '5px 0px 5px ' + borderWidthValue + 'px'),
          maskLeft = ($e.hasClass('crescendo') ? maskOffset * cross : -maskOffset * cross);
      $e.find('span').css({
        borderWidth: borderWidth
      });
      $e.find('.mask').css({
        left: maskLeft
      });
    });
  }());

  (function () {
    var a1 = new Audio('sound/beat1.mp3');
    var a2 = new Audio('sound/beat2.mp3');
    var count = -8;
    var bpm = 80;
    var timer;
    function exec() {
      if (count % 2 === 0) {
        a1.currentTime = 0;
        a1.play();
        // count = 0;
      } else {
        a2.currentTime = 0;
        a2.play();
      }

      if (count < 0) {
        window.scrollTo(0, 0);
      }

      if (count % 12 === 0) {
        currRowIndex = count / 12;
        var $currRow = $($rows.get(currRowIndex));
        if ($currRow.length === 0) {
          $($rows.get($rows.length - 1)).find('.curr-pos').remove();
          count = -8;
        } else {
          if ($currRow.prev().hasClass('row')) {
            $currRow.prev().find('.curr-pos').remove();
          }
          $currRow.prepend(currPosHtml);
          var currPosEle = document.querySelector('.curr-pos'),
              screenHeight = document.documentElement.clientHeight,
              currPosEleTop = currPosEle.getBoundingClientRect().top,
              diff = screenHeight - currPosEleTop;
          if (diff < 200 || diff > 800) {
            window.scrollTo(0, $('.curr-pos').parent().position().top - 200);
          }
        }
      }

      count++;
      timer = setTimeout(exec, 60 / bpm * 1000);
    }

    $metronome.find('.bpm-slide').on('input', function (e) {
      $metronome.find('.tempo').text(this.value);
      bpm = parseInt(this.value);
    });

    $metronome.find('.tempo-trigger').on('click', function (e) {
      $(this).find('span').toggleClass('glyphicon-play');
      $(this).find('span').toggleClass('glyphicon-stop');
      if (!timer) {
        timer = setTimeout(exec, 0);
      } else {
        clearTimeout(timer);
        timer = undefined;
        count = -8;
        $('.curr-pos').remove();
      }
    });

    $metronome.find('.metronome-toggle').on('click', function (e) {
      var $toggle = $(this);
      $toggle.toggleClass('off');

      if ($toggle.hasClass('off')) {
        $metronome.css('left', -300);
      } else {
        $metronome.css('left', 0);
      }
    });

    $metronome.find('#tempo-sound').on('change', function (e) {
      a1 = new Audio('sound/' + this.value + '1.mp3');
      a2 = new Audio('sound/' + this.value + '2.mp3');
    });
  } ());

  (function () {
    $noteList.find('ul:first').on('click', '.folder', function (e) {
      $(this.nextElementSibling).toggleClass('hide');
    });

    $noteList.find('.note-list-toggle').on('click', function (e) {
      var $toggle = $(this);
      $toggle.toggleClass('off');

      if ($toggle.hasClass('off')) {
        $noteList.css('left', -300);
      } else {
        $noteList.css('left', 0);
      }
    });
  } ());

  $(audio)
    .on('loadeddata', function (e) {
      $currTime.text(formatSec(this.currentTime));
      $totalTime.text(formatSec(this.duration));
      this.loop = $repeatBtn.hasClass('repeat-on');
    })
    .on('timeupdate', function (e) {
      var currTimeText = formatSec(this.currentTime);

      $currTime.text(currTimeText);
      $timebar.css({
        width: (this.currentTime / this.duration * 100) + '%'
      });
      $playerCursor.css({
        left: parseInt($timebar.css('width')) - parseInt($playerCursor.css('width'))
      });

      do {
        if (currRowIndex >= $rows.length) {
          currRowIndex = 0;
        }
        var $currRow = $($rows.get(currRowIndex));
        if (currTimeText.localeCompare($currRow.data('start-time')) > 0 &&
            currTimeText.localeCompare($currRow.data('end-time')) <=0) {
          if (!$currRow.find('.curr-pos').length) {
            $currRow.prepend(currPosHtml);
          }
          break;
        } else {
          $currRow.find('.curr-pos').remove();
          currRowIndex++;
        }
      } while (currRowIndex < $rows.length);
    })
    .on('ended', function (e) {
      if ($repeatBtn.hasClass('repeat-off')) {
        audio.currentTime = 0;
        $playPauseBtn.toggleClass('glyphicon-play');
        $playPauseBtn.toggleClass('glyphicon-pause');
      }
    });


  $stopBtn.on('click', function (e) {
    audio.pause();
    audio.currentTime = 0;
    if ($playPauseBtn.hasClass('glyphicon-pause')) {
      $playPauseBtn.toggleClass('glyphicon-play');
      $playPauseBtn.toggleClass('glyphicon-pause');
    }
    currRowIndex = 0;
    $('.curr-pos').remove();
  });

  $playPauseBtn.on('click', function (e) {
    var isPlay = $playPauseBtn.hasClass('glyphicon-play');
    $playPauseBtn.toggleClass('glyphicon-play');
    $playPauseBtn.toggleClass('glyphicon-pause');

    if (isPlay) {
      audio.play();
    } else {
      audio.pause();
    }
  });

  $repeatBtn.on('click', function (e) {
    $repeatBtn.toggleClass('repeat-on');
    $repeatBtn.toggleClass('repeat-off');
    audio.loop = $repeatBtn.hasClass('repeat-on');
  });

  $volume.on('click', function (e) {
    if ($volume.hasClass('glyphicon-volume-up')) {
      prevVolumeLevel = audio.volume;

      audio.volume = 0;
      $volumeBar.find('div').css({
        backgroundColor: '#fff'
      });

    } else {
      audio.volume = prevVolumeLevel;

      for (var i = 1; i <= prevVolumeLevel * 5; i++) {
        $volumeBar.find('.volume' + i).css({
          backgroundColor: '#333'
        });
      }
    }

    $volume.toggleClass('glyphicon-volume-up');
    $volume.toggleClass('glyphicon-volume-off');
  });

  $volumeBar.on('mousedown', function (e) {
    var targetClassName = $(e.target).attr('class');

    if (targetClassName === 'volume-bar') {
      return;
    }

    if ($volume.hasClass('glyphicon-volume-off')) {
      $volume.toggleClass('glyphicon-volume-up');
      $volume.toggleClass('glyphicon-volume-off');
    }

    $volumeBar.find('div').css({
      backgroundColor: '#fff'
    });

    switch (targetClassName) {
      case 'volume5':
        $volumeBar.find('.volume5').css({
          backgroundColor: '#333'
        });
      case 'volume4':
        $volumeBar.find('.volume4').css({
          backgroundColor: '#333'
        });
      case 'volume3':
        $volumeBar.find('.volume3').css({
          backgroundColor: '#333'
        });
      case 'volume2':
        $volumeBar.find('.volume2').css({
          backgroundColor: '#333'
        });
      case 'volume1':
        $volumeBar.find('.volume1').css({
          backgroundColor: '#333'
        });
    }

    audio.volume = targetClassName.slice(-1) / 5;
  });

  $playerCursorArea.on('click', function (e) {
    audio.currentTime = e.pageX / document.body.clientWidth * audio.duration;

    if ($playPauseBtn.hasClass('glyphicon-play')) {
      $playPauseBtn.trigger('click');
    }
  });

} ());

(function () {
  $(document.body).on('keyup', function (e) {
    if (e.which === 13) {
      $('.beat > input').replaceWith(function () {
        return '<span class="beat-number">' +
                 this.value.replace(/(\.|\s)/g, function(all, c) {
                   return '<span class="half">' + c + '</span>';
                 }) +
               '</span>';
      });
    }
  });

  $('.container').on('click', '.beat-number', function (e) {
    this.parentNode.insertAdjacentHTML('afterbegin', '<input type="text" class="form-control" value="' + this.textContent + '">');
    this.parentNode.removeChild(this);
  });
} ());
