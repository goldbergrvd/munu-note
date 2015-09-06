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
      $playerCursorArea = $('#player > .player-cursor-area'),
      $rows = $('.row'),
      currRowIndex = 0,
      prevVolumeLevel = 1,
      currPosHtml = '<div class="curr-pos">' +
                      '<span class="glyphicon glyphicon-chevron-right"></span>' +
                      '<span class="glyphicon glyphicon-chevron-left"></span>' +
                    '</div>';

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
        if (currRowIndex >= $rows.length) currRowIndex = 0;
        $currRow = $($rows.get(currRowIndex));
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

    if (targetClassName === 'volume-bar') return;

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
