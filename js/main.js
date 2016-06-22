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
  },
  {once: true}
);