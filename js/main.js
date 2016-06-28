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
      currentCard = 0,
      slider = document.createElement('div'),
      prev = slider.appendChild(document.createElement('a')),
      cards = slider.appendChild(document.createElement('ul')),
      next = slider.appendChild(document.createElement('a')),
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
      },
      showCard = function (newIndex) {
        var
          childNodes = cards.childNodes,
          current = childNodes[currentCard],
          i = 0, mLeft = 0
        ;
        currentCard = newIndex;
        current.style.opacity = .5;
        childNodes[currentCard].style.opacity = 1;
        while (i < currentCard) mLeft += childNodes[i++].clientWidth;
        childNodes[0].style.marginLeft = (-mLeft) + 'px';
      },
      show = function (newIndex) {
        showBoard(newIndex);
        showCard(newIndex);
      }
    ;
    slider.className = 'slider';
    prev.textContent = '<';
    prev.href = '#prev';
    next.textContent = '>';
    next.href = '#next';
    prev.className = next.className = 'no-us';
    prev.onclick = next.onclick = function (e) {
      var childNodes = cards.childNodes;
      e.preventDefault();
      e.stopPropagation();
      if (this === next) {
        if ((currentCard + 1) < childNodes.length) {
          show(currentCard + 1);
        }
      } else if (0 < currentCard) {
        show(currentCard - 1);
      }
    };
    boards.forEach(
      function (board, i) {
        var
          name = board.getAttribute('data-name'),
          li = cards.appendChild(document.createElement('li'))
        ;
        li.className = 't-all';
        li.appendChild(new Image).src = '/img/boards/' + name + '.png';
        li.onclick = function () { show(i); };
        if (i) {
          board.style.display = 'none';
          li.style.opacity = .5;
        } else {
          board.parentNode.appendChild(slider);
        }
        if (
          location.href.lastIndexOf('#' + name) ===
          (location.href.length - name.length - 1)
        ) {
          showBoard(i);
          window.addEventListener('load', function () {
            showCard(currentBoard);
          });
        }
      }
    );
    document.body.addEventListener('keydown', function (e) {
      switch (e.keyCode) {
        case 37:
          showBoard(currentBoard - 1);
          showCard(currentBoard);
          break;
        case 39:
          showBoard(currentBoard + 1);
          showCard(currentBoard);
          break;
      }
    });

  },
  {once: true}
);