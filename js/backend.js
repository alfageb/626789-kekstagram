'use strict';

(function () {

  var Url = {
    UPLOAD_IMG: 'https://js.dump.academy/kekstagram',
    GALLERY_IMGS: 'https://js.dump.academy/kekstagram/data'
  };

  function failHandler(errorHandler) {
    errorHandler('Произошла ошибка соединения');
  }

  function timeoutHandler(errorHandler, time) {
    errorHandler('Запрос не успел выполниться за ' + time / 1000 + ' сек.');
  }

  function renderErrorNode(message) {
    var TIME_TO_SHOW = 6000;
    var existingError = document.querySelector('.error');

    var node = document.createElement('div');
    node.classList = 'error';
    node.style = 'position: fixed; right: 20px; bottom: 20px; max-width: 400px; padding: 10px; font-size: 16px; text-transform: none; color: #000; background: #fff; border-right: 4px solid #ff4d4d; z-index: 3;';
    node.textContent = message;

    if (existingError) {
      existingError.remove();
    }
    document.body.insertAdjacentElement('beforeend', node);

    setTimeout(function () {
      node.remove();
    }, TIME_TO_SHOW);
  }

  function request(loadHandler, errorHandler) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        loadHandler(xhr.response);
      } else {
        errorHandler('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      failHandler(errorHandler);
    });

    xhr.addEventListener('timeout', function () {
      timeoutHandler(errorHandler, xhr.timeout);
    });

    xhr.timeout = 10000;

    return xhr;
  }

  function load(loadHandler, errorHandler) {
    var xhr = request(loadHandler, errorHandler);

    xhr.open('GET', Url.GALLERY_IMGS);
    xhr.send();
  }

  function upload(data, loadHandler, errorHandler) {
    var xhr = request(loadHandler, errorHandler);

    xhr.open('POST', Url.UPLOAD_IMG);
    xhr.send(data);
  }

  window.backend = {
    load: load,
    upload: upload,
    showError: renderErrorNode
  };
})();
