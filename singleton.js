const player_factory = ({src,show,txt}) => {

// create all elements
  const frame = document.createElement('div')
  const sub_frame = document.createElement('div')
  const sub_sub_frame = document.createElement('div')
  const player = document.createElement('audio')
  const button = document.createElement('div')
  const title = document.createElement('div')
  const info = document.createElement('div')
  const progress = document.createElement('div')
  const marker = document.createElement('div')

// add styling
  button.style.backgroundImage = 'url(assets/material_design_play.svg)';
  button.style.height = '80%';
  button.style.width = '20%';
  button.style.backgroundRepeat = 'no-repeat';
  button.style.backgroundSize = 'contain';
  button.style.marginLeft = '5%';

  frame.style.backgroundColor = 'rgba(100,100,140,90)';
  frame.style.zIndex = '1';
  frame.style.color = 'white';  
  frame.style.width = '100%';
  frame.style.height = '20%';
  frame.style.display = 'flex';
  frame.style.flexDirection = 'column';
  frame.style.justifyContent = 'space-between';

  sub_frame.style.display = 'flex';
  sub_frame.style.alignItems = 'center';
  sub_frame.style.justifyContent = 'space-between';

  sub_sub_frame.style.display = 'flex';
  sub_sub_frame.style.width = '70%';
  sub_sub_frame.style.flexDirection = 'column';
  sub_sub_frame.style.justifyContent = 'space-evenly';
  sub_sub_frame.style.alignItems = 'center';
  sub_sub_frame.style.margin = '20px';

  progress.style.height = '10px';
  progress.style.width = '100%';
  progress.style.backgroundImage = 'linear-gradient(to right,yellow,yellow 0%,grey 0%,grey)';
  progress.style.display = 'flex';
  progress.style.alignItems = 'center';

  marker.style.backgroundColor = 'grey';
  marker.style.height = '170%';
  marker.style.border = 'solid yellow 1px';
  marker.style.width = '5px';
  marker.style.borderRadius = '2px';

// update UI when new track is loaded into player
  const update_ui = ({src,show,txt}) =>
        (player.src = src)
        && (title.textContent = show)
        && (info.textContent = txt)

// update button state to indicate playing or paused
  const update_button = (state) => 
        (state)
        ? (button.style.backgroundImage = 'url(assets/material_design_pause.svg)')
        : (button.style.backgroundImage = 'url(assets/material_design_play.svg)')

// simple state machine factory
  const init = (init,cb) => ({get:() => init,set: (cb) ? (next) => cb(init=next) : (next) => init=next})
// state machine to track current playing/paused state
  const playing = init(false,update_button)
// state machine to track current track in player
  const current = init({src,show,txt},update_ui)

// functions to load and control player, accessible to link_wrapper & button
  const load = (obj) => current.set(obj)
  const play = () => (player.play() || true) && playing.set(true)
  const pause = () => (player.pause() || true) && playing.set(false)

// functions to control progress bar

  const update_progress = (e) => {
    const divide = Math.floor((e.target.buffered.end(0)/e.target.duration)*100);

    progress.style.backgroundImage = `linear-gradient(to right,yellow,yellow ${divide}%,grey ${divide}%,grey)`
    return true
  }

  const update_marker = (e) =>
        (marker.style.marginLeft=`${(e.target.currentTime/e.target.duration)*100}%`)

  const update_progress_bar = (e) =>
        (e.target.duration)
        && update_progress(e)
        && update_marker(e)

  const scrub = (e) => (Math.floor(e.offsetX/e.target.clientWidth*player.duration)<player.buffered.end(0))
        && (player.currentTime = (Math.floor(e.offsetX/e.target.clientWidth*player.duration)))


  button.addEventListener('click',()=>(playing.get()) ? pause() : play())
  player.addEventListener('timeupdate',update_progress_bar)
  progress.addEventListener('click',scrub)

// wrapper function for links to load player. Available as property on player object
  const link_wrapper = ({src,show,txt}) => {
    const text = document.createElement('text')
    text.textContent = show
    text.addEventListener('click',()=>current.set({src,show,txt}) && play())
    return text
  }

// append-o-rama
  sub_sub_frame.appendChild(title)
  sub_sub_frame.appendChild(info)
  progress.appendChild(marker)
  sub_frame.appendChild(button)
  sub_frame.appendChild(sub_sub_frame)
  frame.appendChild(sub_frame)
  frame.appendChild(progress)

// create ui property and initialize player with init value received as argument
  const ui = frame
  update_ui({src,show,txt})

// return player object
  return ({ui,link_wrapper})
}
