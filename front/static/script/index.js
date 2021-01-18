$(function () {
  // rem


  let w = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth)
  document.documentElement.style.fontSize = w / 31.25 + 'px';
  window.addEventListener('resize', function () {

    let w = Math.min(document.documentElement.clientHeight, document.documentElement.clientWidth);
    document.documentElement.style.fontSize = w / 31.25 + 'px';
  })

  let getUrl = '/api/api/list.json'
  let page = 1
  let html = '<div class="list-item"> </div>'
  new Scrollload({
    container: document.querySelector('.scrollload-container'),
    content: document.querySelector('.scrollload-content'),
    loadMore: function (sl) {
      $.ajax({
        type: 'GET',
        url: getUrl,
        data: {
          pageNo: page,
          pageSize: 10,
        },
        dataType: 'json',
        success: function (result) {
          if(result.data.length == 0){
            sl.noMoreData();
            return
          }
          result.data.forEach(element => {
            $(sl.contentDom).append(html)
          });
          sl.unLock()
        },
        error: function (xhr, type) {
          sl.throwException()
        }
      })
    },
  })

  eventListener();

  function eventListener() {
    let _this = this
    $(document).on('click', '.flex-bar', function () {
      $('.flex-bar').removeClass('active')
      $(this).addClass('active');
    })
  }
})