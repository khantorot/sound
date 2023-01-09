
function contentAnimation(data) {
  let page = data.next.namespace;

  if (page == 'index') {
    showIndex();
  } else if (page == 'sound') {
    showSound();
  }
}

function pageTransition(data) {

  if (data.trigger != 'back' && data.trigger != 'popstate' && data.trigger != 'forward') {
    sessionStorage.setItem('link', data.trigger.dataset.barbaTrigger);
  }
}



function delay(n) {
  n = n || 1000;
  return new Promise(done => {
    setTimeout(() => {
      done();
    }, n)
  });
}



barba.init({

  transitions: [{
    name: 'default-transition',
    async leave(data) {
      const done = this.async();
      pageTransition(data);
      await delay(1000);
      done();
    },
    async enter(data) {
      contentAnimation(data);
    },
    async once(data) {
      contentAnimation(data);
    }
  }]
});


barba.hooks.enter((data) => {
  document.documentElement.scrollTo(0, 0);
})

barba.hooks.after((data) => {
  if (data.next.namespace == 'index') {
    let link_id = sessionStorage.getItem('link_id');
    let link_data = JSON.parse(sessionStorage.getItem('link_data'));
    document.documentElement.scrollTo(0, link_data[link_id]);
  }
});

barba.hooks.leave((data) => {
  if (data.current.namespace == 'sound') {
    sessionStorage.setItem('link_id', document.querySelector('.work_page_title').getAttribute('data-id'));
  }
})

barba.hooks.afterOnce((data) => {
  if (data.next.namespace == 'index') {

    let works = document.querySelectorAll('.work');
    let link_data = [];

    works.forEach(element => {
      let scrolled = element.getBoundingClientRect().top + window.scrollY;
      link_data.push(scrolled);
    });
    sessionStorage.setItem('link_data', JSON.stringify(link_data));

  }
});




function scrollTo(element, to, duration) {
  let start = element.scrollTop,
    change = to - start,
    currentTime = 0,
    increment = 20;

  let animateScroll = function () {
    currentTime += increment;
    var val = Math.easeInOutQuad(currentTime, start, change, duration);
    element.scrollTop = val;
    if (currentTime < duration) {
      setTimeout(animateScroll, increment);
    }
  };
  animateScroll();
}

Math.easeInOutQuad = function (t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * t * t + b;
  t--;
  return -c / 2 * (t * (t - 2) - 1) + b;
};






const menu_btn = document.querySelector('.menu_btn');
const menu = document.querySelector('.menu');


menu_btn.addEventListener('click', menuAction);


function menuAction() {
  menu.classList.toggle('menu_show');
  document.querySelector('.container').classList.toggle('menu_show_page');

  if (menu.classList.contains('menu_show')) {
    menu_btn.innerHTML = 'close';
  } else {
    menu_btn.innerHTML = 'play';
  }
}




function showIndex() {

  let out = '';
  let works = document.querySelector('.works');
  const menu = document.querySelector('.menu');

  menu.classList.remove('sound_menu');
  document.querySelector('.intro').classList.add('intro_show')

  for (key in projects) {
    out += '<a href="./sound.html" class="work" data-barba-trigger="' + projects[key].name + '" data-id="' + key + '">';
    out += '<div class="work_title">' + projects[key].name + '</div>';
    out += '<img src="./content/images/play.png" alt="' + projects[key].name + '" class="work_image">';
    out += '</a>';
  }

  works.innerHTML = out;


  works.addEventListener('click', function (e) {
    if (e.target.classList.contains('work')) {
      let id = e.target.getAttribute('data-id');
      let link_data = JSON.parse(sessionStorage.getItem('link_data'));

      scrollTo(document.documentElement, link_data[id], 500);
      e.target.classList.add('picked_work');
    }
  })
}



function showSound() {
  const back_btn = document.querySelector('.back_btn');
  const menu = document.querySelector('.menu');
  const footer_sound = document.querySelector('.footer_sound');

  footer_sound.addEventListener('click', hideSound);
  back_btn.addEventListener('click', hideSound);
  menu.classList.add('sound_menu');

  function hideSound() {
    back_btn.style.pointerEvents = 'none';
    document.querySelector('.work_page_image').classList.remove('work_page_image_active');
    scrollTo(document.documentElement, 0, 500);

    setTimeout(function () {
      document.querySelector('.container').classList.add('hide_page');
    }, 500);
  }




  let out = '';
  let out_next = '';
  let info = '';
  let more = '';
  let name = sessionStorage.getItem('link');
  let work_page = document.querySelector('.work_page');
  let next_page = document.querySelector('.next_page');
  let info_inner = document.querySelector('.info');
  let more_inner = document.querySelector('.more');


  if (name == null) {
    name = projects[0].name;
  }

  for (key in projects) {
    if (name == projects[key].name) {
      document.title = projects[key].name;
      
      loadNewTrack(key);
      let last = Number(Object.keys(projects).length - 1);
      let next = (+key == last) ? 0 : +key + 1;


      out += '<div class="work_page_title" data-id="' + key + '">' + projects[key].name + '</div>';
      out += '<img src="./content/images/play.png" alt="' + projects[key].name + '" class="work_page_image work_page_image' + (+key + 1) + '">';

      info += '<div class= "info_boxes">';

      info += '<ul class="info_box">';
      info += '<li><img src="./content/images/sound.jpg" alt="' + projects[key].name + '"></li>';
      info += '</ul>';

      info += '<ul class="info_box">';
      info += '<h4>' + projects[key].name + '</h4>';
      info += '<li>October 25, 2019</li>';
      info += '</ul>';

      info += '<ul class="info_box">';
      info += '<h4>Produced by</h4>';
      projects[key].producer.forEach(element => {
        info += '<li>' + element + '</li>';

      });
      info += '</ul>';

      if (projects[key].featuring != -1 && projects[key].featuring != null && projects[key].featuring != undefined && projects[key].featuring != '') {
        info += '<ul class="info_box">';
        info += '<h4>Featuring</h4>';
        projects[key].featuring.forEach(element => {
          info += '<li>' + element + '</li>';
        });
        info += '</ul>';
      }
      info += '</div>';


      more += '<div class= "info_boxes">';
      projects[key].info.forEach(element => {
        more += '<ul class="info_box">';
        more += '<h4>' + element[0] + '</h4>';

        element[1].forEach(element => {
          more += '<li>' + element + '</li>';
        });
        more += '</ul>';
      });
      more += '</div>';

      out_next += '<div class="work">';
      out_next += '<div class="work_title">' + projects[next].name + '</div>';
      out_next += '<img src="./content/images/play.png" alt="' + projects[next].name + '" class="work_page_image work_page_image' + (+key + 2) + '">';
      out_next += '</div>';

      if (key == last) {
        footer_sound.style.display = 'flex';
        next_page.style.display = 'none';
      }

      document.querySelector('.video').innerHTML = '<iframe src="' + projects[key].video + '" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen class="music_video"></iframe>';
      readTextFile(projects[key].lyrics);
    }
  }
  
  work_page.innerHTML = out;
  next_page.innerHTML = out_next;
  info_inner.innerHTML = info;
  more_inner.innerHTML = more;


  setTimeout(function(){
    document.querySelector('.work_page_image').classList.add('work_page_image_active');
  }, 1)


  next_page.addEventListener('click', function () {
    sessionStorage.setItem('link', this.querySelector('.work_title').innerHTML);
    next_page.classList.add('next_page_active');
    let scrolled = next_page.getBoundingClientRect().top + window.scrollY;
    scrollTo(document.documentElement, scrolled, 500);
    setTimeout(function () {
      showSound();
      scrollTo(document.documentElement, 0, 0);
      next_page.classList.remove('next_page_active');
    }, 1000)
  })
}





function readTextFile(file) {
  var rawFile = new XMLHttpRequest();
  rawFile.open("GET", file, false);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4) {
      if (rawFile.status === 200 || rawFile.status == 0) {
        var allText = rawFile.responseText;
        document.querySelector('.lyrics').innerHTML = allText;
      }
    }
  }
  rawFile.send(null);
}




function createTrackItem(index, name, duration) {
  var trackItem = document.createElement('div');
  trackItem.setAttribute("class", "playlist-track-ctn");
  trackItem.setAttribute("id", "ptc-" + index);
  trackItem.setAttribute("data-index", index);
  document.querySelector(".playlist-ctn").appendChild(trackItem);

  var playBtnItem = document.createElement('div');
  playBtnItem.setAttribute("class", "playlist-btn-play");
  playBtnItem.setAttribute("id", "pbp-" + index);
  document.querySelector("#ptc-" + index).appendChild(playBtnItem);

  var btnImg = document.createElement('i');
  btnImg.setAttribute("class", "playlist-track-num");
  btnImg.innerHTML = index + 1 + '.';
  btnImg.setAttribute("id", "p-img-" + index);
  document.querySelector("#pbp-" + index).appendChild(btnImg);

  var trackInfoItem = document.createElement('div');
  trackInfoItem.setAttribute("class", "playlist-info-track");
  trackInfoItem.innerHTML = name
  document.querySelector("#ptc-" + index).appendChild(trackInfoItem);

  var trackDurationItem = document.createElement('div');
  trackDurationItem.setAttribute("class", "playlist-duration");
  trackDurationItem.innerHTML = duration
  document.querySelector("#ptc-" + index).appendChild(trackDurationItem);
}



for (var i = 0; i < projects.length; i++) {
  createTrackItem(i, projects[i].name, projects[i].duration);
}
var indexAudio = 0;

function loadNewTrack(index) {
  var player = document.querySelector('#source-audio')
  player.src = projects[index].audio
  document.querySelector('.title').innerHTML = projects[index].name
  this.currentAudio = document.getElementById("myAudio");
  this.currentAudio.load()
  this.toggleAudio()
  this.updateStylePlaylist(this.indexAudio, index)
  this.indexAudio = index;

  let h = document.querySelector('.playlist-track-ctn').clientHeight;
  scrollTo(playlist_ctn, index * h, 500);
}

var playListItems = document.querySelectorAll(".playlist-track-ctn");

for (let i = 0; i < playListItems.length; i++) {
  playListItems[i].addEventListener("click", getClickedElement.bind(this));
}

function getClickedElement(event) {
  for (let i = 0; i < playListItems.length; i++) {
    if (playListItems[i] == event.target) {
      var clickedIndex = event.target.getAttribute("data-index")
      if (clickedIndex == this.indexAudio) { // alert('Same audio');
        this.toggleAudio()
      } else {
        loadNewTrack(clickedIndex);
      }
    }
  }
}

document.querySelector('#source-audio').src = projects[indexAudio].audio
document.querySelector('.title').innerHTML = projects[indexAudio].name


var currentAudio = document.getElementById("myAudio");

currentAudio.load()

currentAudio.onloadedmetadata = function () {
  document.getElementsByClassName('duration')[0].innerHTML = this.getMinutes(this.currentAudio.duration)
}.bind(this);

var interval1;

function toggleAudio() {

  if (this.currentAudio.paused) {
    document.querySelector('#icon-play').style.display = 'none';
    document.querySelector('#icon-pause').style.display = 'flex';
    document.querySelector('#ptc-' + this.indexAudio).classList.add("active-track");
    this.playToPause(this.indexAudio)
    this.currentAudio.play();
  } else {
    document.querySelector('#icon-play').style.display = 'flex';
    document.querySelector('#icon-pause').style.display = 'none';
    this.pauseToPlay(this.indexAudio)
    this.currentAudio.pause();
  }
}

function pauseAudio() {
  this.currentAudio.pause();
  clearInterval(interval1);
}

var timer = document.getElementsByClassName('timer')[0]

var barProgress = document.getElementById("player-progress-bar-ctn");


var width = 0;

function onTimeUpdate() {
  var t = this.currentAudio.currentTime
  timer.innerHTML = this.getMinutes(t);
  this.setBarProgress();
  if (this.currentAudio.ended) {
    document.querySelector('#icon-play').style.display = 'flex';
    document.querySelector('#icon-pause').style.display = 'none';
    this.pauseToPlay(this.indexAudio)
    if (this.indexAudio < projects.length - 1) {
      var index = parseInt(this.indexAudio) + 1
      this.loadNewTrack(index)
    }
  }
}


function setBarProgress() {
  var progress = (this.currentAudio.currentTime / this.currentAudio.duration) * 100;
  document.getElementById("player-progress-bar-ctn").style.width = progress + "%";
}


function getMinutes(t) {
  var min = parseInt(parseInt(t) / 60);
  var sec = parseInt(t % 60);
  if (sec < 10) {
    sec = "0" + sec
  }
  if (min < 10) {
    min = "0" + min
  }
  return min + ":" + sec
}



var scroll_btn = document.querySelector('.btn-scroll');
var playlist_ctn = document.querySelector('.playlist-ctn');

scroll_btn.addEventListener('click', function () {
  scrollTo(playlist_ctn, 0, 500);
})

var progressbar = document.querySelector('#player-progress-ctn')
progressbar.addEventListener("click", seek.bind(this));


function seek(event) {
  var percent = event.offsetX / progressbar.offsetWidth;
  this.currentAudio.currentTime = percent * this.currentAudio.duration;
  barProgress.style.width = percent * 100 + "%";
}

function forward() {
  this.currentAudio.currentTime = this.currentAudio.currentTime + 5
  this.setBarProgress();
}

function rewind() {
  this.currentAudio.currentTime = this.currentAudio.currentTime - 5
  this.setBarProgress();
}


function next() {
  if (this.indexAudio < projects.length - 1) {
    var oldIndex = this.indexAudio
    this.indexAudio++;
    updateStylePlaylist(oldIndex, this.indexAudio)
    this.loadNewTrack(this.indexAudio);
  }
}

function previous() {
  if (this.indexAudio > 0) {
    var oldIndex = this.indexAudio
    this.indexAudio--;
    updateStylePlaylist(oldIndex, this.indexAudio)
    this.loadNewTrack(this.indexAudio);
  }
}

function updateStylePlaylist(oldIndex, newIndex) {
  document.querySelector('#ptc-' + oldIndex).classList.remove("active-track");
  this.pauseToPlay(oldIndex);
  document.querySelector('#ptc-' + newIndex).classList.add("active-track");
  this.playToPause(newIndex)
}

function playToPause(index) {
  var ele = document.querySelector('#p-img-' + index)
  ele.classList.remove("fa-play");
  ele.classList.add("fa-pause");
}

function pauseToPlay(index) {
  var ele = document.querySelector('#p-img-' + index)
  ele.classList.remove("fa-pause");
  ele.classList.add("fa-play");
}




function setVolume() {
  const volume_slider = document.querySelector(".vol-slider");

  currentAudio.volume = volume_slider.value / 100;

  var volUp = document.querySelector('#icon-vol-up');
  var volMute = document.querySelector('#icon-vol-mute');
  
  if(volume_slider.value == 0) {
    volUp.style.display = "none"
    volMute.style.display = "flex"
  } else{
    volMute.style.display = "none"
    volUp.style.display = "flex"
  }
}








