let up = getUrlParam('prefer');
let ub = getUrlParam('b');
let um = getUrlParam('m');
let ut = getUrlParam('t');
let us = getUrlParam('s');
let ud = getUrlParam('d');
let strsearch;

if (!location.search) {
  strsearch = `?prefer=none&b=WASM&m=none&t=none&s=image&d=0`;
  let path = location.href;
  location.href = path + strsearch;
}

const componentToggle = () => {
  // $('#header-sticky-wrapper').attr('style', 'display:block');
  $('#header-sticky-wrapper').slideToggle();
  $('#query').slideToggle();
  $('.nav-pills').slideToggle();
  $('.github-corner').slideToggle();
  // $('#mobile-nav-toggle').slideToggle(100);
  $('footer').slideToggle();
  $('#extra span').toggle();
}

const disableModel = () => {
  if (`${um}` && `${ut}`) {
    let m_t = `${um}` + '_' + `${ut}`;
    $('.model input').attr('disabled', false)
    $('.model label').removeClass('cursordefault');
    $('#' + m_t).attr('disabled', true)
    $('#l-' + m_t).addClass('cursordefault');
  }
}

const checkedModelStyle = () => {
  if (`${um}` && `${ut}`) {
    $('.model input').removeAttr('checked');
    $('.model label').removeClass('checked');
    let m_t = `${um}` + '_' + `${ut}`;
    $('#' + m_t).attr('checked', 'checked');
    $('#l-' + m_t).addClass('checked');
  }
}

$(document).ready(() => {

  if (us == 'camera') {
    $('.nav-pills li').removeClass('active');
    $('.nav-pills #cam').addClass('active');
    $('#imagetab').removeClass('active');
    $('#cameratab').addClass('active');
  } else {
    $('.nav-pills li').removeClass('active');
    $('.nav-pills #img').addClass('active');
    $('#cameratab').removeClass('active');
    $('#imagetab').addClass('active');
    $('#fps').html('');
  }

  if (hasUrlParam('b')) {
    $('.backend input').removeAttr('checked');
    $('.backend label').removeClass('checked');
    $('#' + getUrlParam('b')).attr('checked', 'checked');
    $('#l-' + getUrlParam('b')).addClass('checked');
  }

  if (hasUrlParam('m') && hasUrlParam('t')) {
    checkedModelStyle();
  }

  if (hasUrlParam('prefer')) {
    $('.prefer input').removeAttr('checked');
    $('.prefer label').removeClass('checked');
    $('#' + getUrlParam('prefer')).attr('checked', 'checked');
    $('#l-' + getUrlParam('prefer')).addClass('checked');
  }

  const updateTitle = (backend, prefer, model, modeltype) => {
    model = model.replace(/_/g, ' ');
    let currentprefertext = {
      fast: 'FAST_SINGLE_ANSWER',
      sustained: 'SUSTAINED_SPEED',
      low: 'LOW_POWER',
      none: 'None',
    }[prefer];

    let backendtext = backend;
    if (backend !== 'WebML' && prefer !== 'none') {
      backendtext = backend + ' + WebML';
    }
    $('#ictitle').html(`Image Classification / ${backendtext} / ${currentprefertext} / ${model} (${modeltype})`);
  }
  updateTitle(ub, up, um, ut);

  $('input:radio[name=bp]').click(() => {
    $('.alert').hide();
    let polyfillId = $('input:radio[name="bp"]:checked').attr('id') || $('input:radio[name="bp"][checked="checked"]').attr('id');

    if (polyfillId !== currentBackend) {
      $('.b-polyfill input').removeAttr('checked');
      $('.b-polyfill label').removeClass('checked');
      $('#' + polyfillId).attr('checked', 'checked');
      $('#l-' + polyfillId).addClass('checked');
    } else if (currentPrefer === 'none') {
      showAlert('Select at least one backend');
      return;
    } else {
      $('.b-polyfill input').removeAttr('checked');
      $('.b-polyfill label').removeClass('checked');
      polyfillId = 'WebML';
    }

    currentBackend = polyfillId;
    updateTitle(currentBackend, currentPrefer, `${um}`, `${ut}`);
    strsearch = `?prefer=${currentPrefer}&b=${currentBackend}&m=${um}&t=${ut}&s=${us}&d=${ud}`;
    window.history.pushState(null, null, strsearch);

    if (um === 'none') {
      showError('No model selected', 'Please select a model to start prediction.');
      return;
    }
    
    utils.backend = '';
    updateBackend(us === 'camera');
  });

  $('input:radio[name=bw]').click(() => {
    $('.alert').hide();

    let webnnId = $('input:radio[name="bw"]:checked').attr('id') || $('input:radio[name="bw"][checked="checked"]').attr('id');

    if (webnnId !== currentPrefer) {
      $('.b-webnn input').removeAttr('checked');
      $('.b-webnn label').removeClass('checked');
      $('#' + webnnId).attr('checked', 'checked');
      $('#l-' + webnnId).addClass('checked');
    } else if (currentBackend === 'WebML') {
      showAlert('Select at least one backend');
      return;
    } else {
      $('.b-webnn input').removeAttr('checked');
      $('.b-webnn label').removeClass('checked');
      webnnId = 'none';
    }

    currentPrefer = webnnId;
    updateTitle(currentBackend, currentPrefer, `${um}`, `${ut}`);
    strsearch = `?prefer=${currentPrefer}&b=${currentBackend}&m=${um}&t=${ut}&s=${us}&d=${ud}`;
    window.history.pushState(null, null, strsearch);

    if (um === 'none') {
      showError('No model selected', 'Please select a model to start prediction.');
      return;
    }

    utils.backend = '';
    updateBackend(us === 'camera');
  });

  $('input:radio[name=m]').click(() => {
    $('.alert').hide();
    let rid = $('input:radio[name="m"]:checked').attr('id');
    if (rid.indexOf('_onnx') > -1) {
      um = rid.replace('_onnx', '');
      ut = 'onnx';
    }
    if (rid.indexOf('_tflite') > -1) {
      um = rid.replace('_tflite', '');
      ut = 'tflite';
    }
    if (currentBackend && currentPrefer) {
      strsearch = `?prefer=${currentPrefer}&b=${currentBackend}&m=${um}&t=${ut}&s=${us}&d=${ud}`;
    } else {
      strsearch = `?prefer=${up}&b=${ub}&m=${um}&t=${ut}&s=${us}&d=${ud}`;
    }
    // location.href = strsearch;
    window.history.pushState(null, null, strsearch);

    checkedModelStyle();
    disableModel();
    currentModel = `${um}_${ut}`;
    updateTitle(currentBackend, currentPrefer, `${um}`, `${ut}`);
    main(us === 'camera');
  });

  $('#extra').click(() => {
    componentToggle();
    let display;
    if (ud == '0') {
      display = '1';
      ud = '1';
    } else {
      display = '0';
      ud = '0';
    }

    let strsearch;
    if (currentBackend && currentPrefer) {
      strsearch = `?prefer=${currentPrefer}&b=${currentBackend}&m=${um}&t=${ut}&s=${us}&d=${display}`;
    } else {
      strsearch = `?prefer=${up}&b=${ub}&m=${um}&t=${ut}&s=${us}&d=${display}`;
    }
    window.history.pushState(null, null, strsearch);
  });
});

$(document).ready(() => {
  $('#img').click(() => {
    $('.alert').hide();
    $('#fps').html('');
    $('ul.nav-pills li').removeClass('active');
    $('ul.nav-pills #img').addClass('active');
    $('#imagetab').addClass('active');
    $('#cameratab').removeClass('active');
    us = 'image';
    strsearch = `?prefer=${up}&b=${ub}&m=${um}&t=${ut}&s=${us}&d=${ud}`;
    window.history.pushState(null, null, strsearch);
    
    if (um === 'none') {
      showError('No model selected', 'Please select a model to start prediction.');
      return;
    }

    updateScenario();
  });

  $('#cam').click(() => {
    $('.alert').hide();
    $('ul.nav-pills li').removeClass('active');
    $('ul.nav-pills #cam').addClass('active');
    $('#cameratab').addClass('active');
    $('#imagetab').removeClass('active');
    us = 'camera';
    strsearch = `?prefer=${up}&b=${ub}&m=${um}&t=${ut}&s=${us}&d=${ud}`;
    window.history.pushState(null, null, strsearch);
    
    if (um === 'none') {
      showError('No model selected', 'Please select a model to start prediction.');
      return;
    }

    updateScenario(true);
  });

  $('#fullscreen i svg').click(() => {
    $('#fullscreen i').toggle();
    toggleFullScreen();
    $('video').toggleClass('fullscreen');
    $('#overlay').toggleClass('video-overlay');
    $('#fps').toggleClass('fullscreen');
    $('#fullscreen i').toggleClass('fullscreen');
    $('#ictitle').toggleClass('fullscreen');
    $('#inference').toggleClass('fullscreen');
  });

});

const showProgress = async (text) => {
  $('#progressmodel').show();
  await $('#progressstep').html(text);
  $('.shoulddisplay').hide();
  $('.icdisplay').hide();
  $('#resulterror').hide();
}

const showResults = () => {
  $('#progressmodel').hide();
  $('.icdisplay').fadeIn();
  $('.shoulddisplay').fadeIn();
  $('#resulterror').hide();
}

const showError = (title, description) => {
  $('#progressmodel').hide();
  $('.icdisplay').hide();
  $('.shoulddisplay').hide();
  $('#resulterror').fadeIn();
  if (title && description) {
    $('.errortitle').html(title);
    $('.errordescription').html(description);
  } else {
    $('.errortitle').html('Prediction Failed');
    $('.errordescription').html('Please check error log for more details');
  }
}

const updateLoading = (loadedSize, totalSize, percentComplete) => {
  $('.loading-page .counter h1').html(`${loadedSize}/${totalSize}MB ${percentComplete}%`);
}

$(window).load(() => {
  if (ud != '0') {
    componentToggle();
  }
  disableModel();
  if (um === 'none') {
    showError('No model selected', 'Please select a model to start prediction.');
    return;
  }
  main(us === 'camera');
})