/*!
 * Copyright (c) 2016 Andrea Giammarchi
 *
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom
 * the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
 * DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
 * TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 * OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

document.addEventListener(
  'DOMContentLoaded',
  function () {
    var arrow = document.createElement('span');
    arrow.classList.add('arrow', 't-all');
    document.queryAll('#powered-by .description p').forEach(
      function (p, i, all) {
        function magic(e) {
          e.preventDefault();
          e.stopPropagation();
          all.forEach(function (p, j) {
            if (j !== i) p.classList.add('hidden');
          });
          p.classList.remove('hidden');
          switch (i) {
            case 0: arrow.style.left = '10%'; break;
            case 1: arrow.style.left = '50%'; break;
            case 2: arrow.style.left = '90%'; break;
          }
        }
        this[i].addEventListener('click', magic);
        this[i].addEventListener('mouseover', magic);
        if (!i) {
          p.parentNode.appendChild(arrow);
          this[i].dispatchEvent(new CustomEvent('click'));
        }
      },
      document.queryAll('#powered-by li')
    );

    var
      currentBoard = 0,
      boards = document.queryAll('#carousel .board'),
      showBoard = function (newIndex) {
        var board, name;
        boards[currentBoard].style.display = 'none';
        if (newIndex < 0) currentBoard = boards.length + newIndex;
        else currentBoard = newIndex % boards.length;
        board = boards[currentBoard];
        name = board.getAttribute('data-name');
        board.style.display = 'block';
        board.style.backgroundImage = 'url(/img/boards/' + name + '.png)';
        location.href = location.href.split('#')[0] + '#' + name;
        rotateY();
      },
      rotateY = function () {
        var
          y = parseInt(5 + Math.random() * 20),
          x = y + (document.body.clientWidth > 600 ? 10 : -5),
          transform = 'rotateY(-' + y + 'deg) translateX(-' + x + 'px)'
        ;
        document.querySelector('#carousel .skeweed-bg').style.cssText = [
          '-webkit-transform:' + transform,
          '-moz-transform:' + transform,
          '-ms-transform:' +transform,
          'transform:' + transform
        ].join(';');
      }
    ;
    boards.forEach(
      function (board, i) {
        var name = board.getAttribute('data-name');
        if (i) board.style.display = 'none';
        else rotateY();
        if (
          location.href.lastIndexOf('#' + name) ===
          (location.href.length - name.length - 1)
        ) {
          showBoard(i);
        }
      }
    );
    document.body.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
        case 37: showBoard(currentBoard - 1); break;
        case 39: showBoard(currentBoard + 1); break;
      }
    });
    document.body.addEventListener('click', function (e) {
      if (!e.target.closest('a')) {
        e.preventDefault();
        e.stopPropagation();
        showBoard(currentBoard + (
          e.pageX < document.body.clientWidth / 2 ? -1 : +1
        ));
      }
    });

  },
  {once: true}
);