document.addEventListener(
  'DOMContentLoaded',
  function () {
    document.queryAll('.menu li').forEach(function (li, i, all) {
      if (i) li.addEventListener('click', this);
      else this.all = all;
    }, {
      dropActive: function (li) {
        li.classList.remove('active');
      },
      handleEvent: function (e) {
        e.stopPropagation();
        this.all.forEach(this.dropActive);
        e.currentTarget.classList.add('active');
      }
    });
  },
  {once: true}
);