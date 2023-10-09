//reloadHostTracks();
var trackSend;
function setTrackSend() {
  let opt = document.getElementById("host-tracks").options;
  let sel = document.getElementById("host-tracks").selectedIndex;
  trackSend = opt[sel].value;
}
//setTrackSend();

function reloadHostTracks() {
  let sel = document.getElementById("host-tracks");
  let i,
    s = sel.options.length;
  for (i = s; i >= 0; i--) {
    sel.remove(i);
  }
  let ids = parent.informTrackIDs();
  for (id in ids) {
    let opt = document.createElement("OPTION");
    opt.value = ids[id];
    opt.innerText = "ID[" + ids[id] + "]";
    sel.appendChild(opt);
  }
}

function updateSlider(e, v) {
  document.getElementById(e).innerText = document.getElementById(v).value;
}

function GetTrueOne(rname) {
  let options = document.getElementsByName(rname);
  let t;
  for (t = 0; t < options.length; t++) {
    if (options[t].checked == true) {
      return t;
    }
  }
}

let adjs = [];
let guitar, nStrings, nFrets, nDivision, nInterval, nLength, nWidth;
let presetTuningPattern = [];

function createHighlightControls() {
  document.getElementById("highlights").remove();
  const highlights = document.createElement("div");
  highlights.id = "highlights";
  document.getElementById("generated-opts").appendChild(highlights);
  //if(nDivision==Math.round(nDivision)){
  let notes = document.createElement("div");
  notes.innerText = "Highlight: ";
  highlights.appendChild(notes);

  for (let d = 0; d < intervals.length; d++) {
    let note = document.createElement("div");
    note.innerText = d + " ";
    note.className = "highlight-single";
    note.style.display = "inline-block";
    note.style.marginRight = "5px";
    note.style.width = "33px";
    note.style.wordBreak = "no-break";
    note.style.textAlign = "right";
    let checkbox = document.createElement("input");
    checkbox.className = "cboxhlight";
    checkbox.type = "checkbox";
    checkbox.name = "selected-note";
    checkbox.value = d;
    checkbox.onclick = () => {
      highlightNotes();
    };
    note.appendChild(checkbox);
    highlights.appendChild(note);
  }
  //}else{
  //    highlights.innerHTML = "These options are only available for integer divisions of integer intervals.";
  //}
}

function createColorOpts() {
  document.getElementById("color-opts").remove();
  const colorOpts = document.createElement("div");
  colorOpts.id = "color-opts";
  document.getElementById("generated-opts").appendChild(colorOpts);

  let notes = document.createElement("div");
  notes.innerText = "Color By: ";
  colorOpts.appendChild(notes);

  colorOpts.oninput = () => {
    highlightNotes();
  };

  let opt = document.createElement("div");
  opt.style.display = "inline-block";
  opt.style.marginRight = "10px";
  opt.innerText = "Single:";
  let inp = document.createElement("input");
  inp.type = "radio";
  inp.name = "color-opt";
  inp.checked = true;
  opt.appendChild(inp);
  colorOpts.appendChild(opt);

  opt = document.createElement("div");
  opt.style.display = "inline-block";
  opt.style.marginRight = "10px";
  opt.innerText = "Rank:";
  inp = document.createElement("input");
  inp.type = "radio";
  inp.name = "color-opt";
  inp.checked = false;
  opt.appendChild(inp);
  colorOpts.appendChild(opt);

  opt = document.createElement("div");
  opt.style.display = "inline-block";
  opt.style.marginRight = "10px";
  opt.innerText = "Row:";
  inp = document.createElement("input");
  inp.type = "radio";
  inp.name = "color-opt";
  inp.checked = false;
  opt.appendChild(inp);
  colorOpts.appendChild(opt);
}

function highlightFret(f, v) {
  for (let i = 0; i < strings.length; i++) {
    strings[i][f + 1][0].style.backgroundColor = v == 1 ? "#8f6f3f" : "#7b5929";
  }
}

const colors = [
  "#f00",
  "#0f0",
  "#00f",
  "#ff0",
  "#0ff",
  "#f0f",
  "#f90",
  "#0f9",
  "#90f",
  "#f09",
  "#9f0",
  "#09f",
];
let toplay = [];
function highlightNotes() {
  let st = document.getElementsByClassName("mark-highlight");
  for (let a = st.length; a > 0; a--) {
    st[a - 1].remove();
  }
  let cr = document.getElementsByClassName("chord-row-number");
  for (let a = cr.length; a > 0; a--) {
    cr[a - 1].remove();
  }
  let selected = document.getElementsByName("selected-note");
  let tohl = [];
  let torow = [];
  toplay = [];

  for (let s = 0; s < selected.length; s++) {
    if (selected.item(s).checked) {
      for (let n = 0; n < strings.length; n++) {
        for (let c = 0; c < strings[n].length; c++) {
          if (strings[n][c][4] == selected.item(s).value) {
            tohl.push([strings[n][c][0], strings[n][c][4]]);
            if (n == strings.length - 1) torow.push([strings[n][c][0], c]);
            if (toplay[n] == undefined) {
              toplay[n] = [];
            }
            toplay[n].push([
              strings[n][c][0],
              strings[n][c][5],
              strings[n][c][4],
            ]);
          }
        }
        toplay[n].sort(function (a, b) {
          return a[1] - b[1];
        });
        torow.sort(function (a, b) {
          return a[1] - b[1];
        });
      }
    }
  }

  if (tohl.length > 0) {
    for (let i = 0; i < tohl.length; i++) {
      let mark = document.createElement("div");
      mark.innerText = tohl[i][1];
      //mark.style.backgroundColor = colors[parseInt(tohl[i][1])];
      mark.style.zIndex = "10";
      mark.className = "mark-highlight";
      //mark.onclick = ()=>{toggleColors(mark)};
      tohl[i][0].appendChild(mark);
    }
  }
  if (torow.length > 0) {
    for (let i = 0; i < torow.length; i++) {
      let mark = document.createElement("div");
      mark.style.position = "absolute";
      mark.style.backgroundColor = "#002";
      mark.style.cursor = "pointer";
      mark.style.width = "13px";
      mark.style.height = "13px";
      mark.style.borderRadius = "50%";
      mark.style.color = "#aaa";
      mark.innerText = "►";
      mark.style.textAlign = "center";
      mark.style.bottom = "-110px";
      mark.style.marginLeft = "50%";
      mark.className = "chord-row-number";
      mark.onmouseenter = () => {
        playRowChord(i);
      };
      mark.onmouseleave = () => {
        markColorToggle(i);
      };
      torow[i][0].appendChild(mark);
    }
  }

  switch (GetTrueOne("color-opt")) {
    case 0:
      colorSingle();
      break;
    case 1:
      colorByRank();
      break;
    case 2:
      colorByRow();
      break;
    //default: colorSingle(); break;
  }
}

function colorByRow() {
  for (let p = 0; p < toplay.length; p++) {
    for (let t = 0; t < toplay[p].length; t++) {
      let nt = (t + rowPattern[rowPattern.length - 1 - p]) % toplay[p].length;
      if (toplay[p][nt] != undefined) {
        toplay[p][nt][0].getElementsByClassName(
          "mark-highlight"
        )[0].style.backgroundColor = colors[t % colors.length];
      } else {
        console.log("skipped");
        continue;
      }
    }
  }
}

function colorByRank() {
  for (let p = 0; p < toplay.length; p++) {
    for (let t = 0; t < toplay[p].length; t++) {
      if (toplay[p][t] != undefined) {
        toplay[p][t][0].getElementsByClassName(
          "mark-highlight"
        )[0].style.backgroundColor = colors[toplay[p][t][2] % colors.length];
      } else {
        console.log("skipped");
        continue;
      }
    }
  }
}

function colorSingle() {
  for (let p = 0; p < toplay.length; p++) {
    for (let t = 0; t < toplay[p].length; t++) {
      if (toplay[p][t] != undefined) {
        toplay[p][t][0].getElementsByClassName(
          "mark-highlight"
        )[0].style.backgroundColor = "#fa0";
      } else {
        console.log("skipped");
        continue;
      }
    }
  }
}

function markColorToggle(row) {
  for (let p = 0; p < toplay.length; p++) {
    let nt = (row + rowPattern[rowPattern.length - 1 - p]) % toplay[p].length;
    if (toplay[p][nt] != undefined) {
      toplay[p][nt][0].getElementsByClassName(
        "mark-highlight"
      )[0].style.border = "1px solid #000";
    } else continue;
  }
}

let rowPattern = [];
function createChordRowControls() {
  rowPattern = [];
  document.getElementById("chord-row").remove();
  const chordRow = document.createElement("div");
  chordRow.id = "chord-row";
  document.getElementById("generated-opts").appendChild(chordRow);

  let notes = document.createElement("div");
  notes.innerText = "Chord Pattern: ";
  chordRow.appendChild(notes);

  for (let i = 0; i < nStrings; i++) {
    let val = 0;
    let input = document.createElement("input");
    input.type = "number";
    input.name = "row-phase-number";
    input.value = val;
    input.min = 0;
    input.step = 1;
    input.style.width = "40px";
    chordRow.appendChild(input);
    input.oninput = () => {
      rowPattern[i] = parseInt(input.value);
    };
    rowPattern.push(val);
  }

  chordRow.oninput = () => {
    highlightNotes();
  };
}

let measures = [];
let strings = [];
let tuningPatterns = [];
let notesPool = [];
let intervals;
let gtp = 0;
function prepareGuitar() {
  strings = [];
  tuningPatterns = [];
  notesPool = [];
  intervals = [];
  adjs = [];
  presetTuningPattern = []; //yhnks

  nZoom = document.getElementById("nZoom").value / 1;
  nStrings = document.getElementById("nStrings").value;
  nInterval = document.getElementById("nInterval").value;
  nDivision = document.getElementById("nDivision").value;

  intervals = (function () {
    let ints = [];
    let selected = GetTrueOne("tuningType");
    switch (selected) {
      case 1:
        ints = readIntervalsList();
        break;
      case 0:
        for (let i = 0; i < nDivision; i++) {
          ints.push(Math.pow(nInterval, i / nDivision));
        }
        break;
    }
    return ints;
  })();

  gtp = 80;

  document.getElementById("full-guitar").remove();
  const fullGuitarUI = document.createElement("div");
  fullGuitarUI.id = "full-guitar";
  document.getElementById("guitar-parent").appendChild(fullGuitarUI);

  let controlsFrame = document.createElement("DIV");
  controlsFrame.style.position = "absolute";
  //controlsFrame.style.backgroundColor = "rgba(0,0,0,0.2)";
  controlsFrame.style.width = "100px";
  controlsFrame.style.height = "100%";
  //controlsFrame.style.top = gtp+"px";

  const tuningPatternSuggestion = (function () {
    let sug = [];
    let padding = Math.floor(intervals.length / 2) - 1;
    for (let i = 0; i < nStrings - 1; i++) {
      sug.push(padding);
      //if(sug[i]<1)sug[i]=1;
    }
    if (nStrings > 3) sug[sug.length - 2] = padding - 1;
    //if(sug[sug.length-2]<1)sug[sug.length-2]=1;

    return sug;
  })();

  tuningPatterns =
    presetTuningPattern.length == 0
      ? tuningPatternSuggestion
      : presetTuningPattern;

  for (let i = 0; i < nStrings - 1; i++) {
    let stringAdjust = document.createElement("div");
    stringAdjust.className = "stringAdjust";
    stringAdjust.innerText = "+ ";
    stringAdjust.style.position = "absolute";
    stringAdjust.style.top =
      (nStrings - 2 - i) * (nWidth / nStrings) + gtp + 5 + "px";
    stringAdjust.style.left = 25 + "px";
    let input = document.createElement("input");
    input.type = "number";
    input.value = tuningPatterns[i]; ///////////////////////////////////////////////////////
    input.style.padding = "0px";
    input.style.width = "40px";
    input.oninput = () => {
      tuningPatterns[i] = parseInt(input.value);
      createGuitarII(false);
    };
    input.id = "sa-" + i;
    adjs.push(input);
    stringAdjust.appendChild(input);
    controlsFrame.appendChild(stringAdjust);
  }

  fullGuitarUI.appendChild(controlsFrame);

  let guitarContainer = document.createElement("DIV");
  guitarContainer.style.position = "absolute";
  guitarContainer.id = "guitar-container";
  fullGuitarUI.appendChild(guitarContainer);

  createGuitarII(true);
}
prepareGuitar();

function mapNotes(stringsAmount, tuningPatterns, intervalsLength) {
  for (let c = 0; c < stringsAmount; c++) {
    let offset = 0;
    for (let o = c; o < tuningPatterns.length; o++) {
      offset += tuningPatterns[tuningPatterns.length - o - 1];
    }
    console.log(offset);
    for (let j = strings[c].length - 1; j >= 0; j--) {
      let test = (offset + j) % intervalsLength;
      strings[c][j][4] = test;
      strings[c][j][5] = offset + j + 1;
      //strings[c][j][6] = strings[c][j][1]/strings[c+c==5?0:1][(offset)%strings[c].length][1];
    }
  }
}

function toggleColors(el) {
  el.style.backgroundColor =
    "rgb(" +
    Math.random() * 255 +
    "," +
    Math.random() * 255 +
    "," +
    Math.random() * 255 +
    ")";
}

function readIntervalsList() {
  let inputNumbers = document.getElementById("intervalsList").value;
  inputNumbers = inputNumbers.split(",");
  //if(inputNumbers[0]==1)inputNumbers.pop();
  let parsed = [];
  for (let i in inputNumbers) {
    parsed.push(parseFloat(inputNumbers[i]));
  }
  return parsed;
}

function getAllIntervals() {
  let ns = document.getElementById("nStrings").value;
  let nf = document.getElementById("nFrets").value;
  let maxNotes = ns * nf; //strings * frets
  let intervals = [];
  let selected = GetTrueOne("tuningType");
  switch (selected) {
    case 1:
      let ints = readIntervalsList();
      let ct = 0;
      let h = ints[ints.length - 1]; //last
      let m = 1;
      for (let i = 0; i < maxNotes; i++) {
        ct++;
        let t = ints[i % ints.length] * m;
        if (ct == ints.length) {
          m *= h;
          ct = 0;
        }
        intervals.push(t);
      }
      break;
    case 0:
      for (let i = 0; i < maxNotes; i++) {
        intervals.push(Math.pow(nInterval, i / nDivision));
      }
      break;
  }
  return intervals;
}

function drawMeasures(obj) {
  if (document.getElementById("calcRuler").checked == false) return;

  let length = document.getElementById("nLength").value;
  nWidth = parseInt(document.getElementById("nWidth").value * nZoom);
  nStrings = document.getElementById("nStrings").value;

  let scale = document.getElementById("scaleUnit").value / length;

  let main = document.createElement("div");
  main.className = "measure-del";
  main.style.position = "absolute";
  main.style.marginLeft = -+obj[2] + "px";
  main.style.width = length + "px";
  main.style.height = "30px";
  main.style.top = 45 + (nStrings - obj[5]) * (nWidth / nStrings) + "px";
  main.style.border = "1px dashed #f50";
  main.style.borderTop = "none";
  main.style.fontSize = "10px";
  obj[0].appendChild(main);

  let left = document.createElement("div");
  left.style.position = "absolute";
  left.style.left = "0px";
  left.style.width = obj[2] + obj[4] + "px";
  left.innerText = (scale * Math.round((obj[2] + obj[4]) * 10000)) / 10000;
  left.style.textAlign = "center";
  left.style.bottom = "0px";
  left.style.color = "#f50";
  //left.style.height = gtp+(nStrings-obj[5])*(nWidth/nStrings)+"px";
  left.style.zIndex = 2;
  left.style.borderRight = "1px dashed #f50";
  main.appendChild(left);

  let right = document.createElement("div");
  right.style.position = "absolute";
  right.style.right = "0px";
  right.style.width = nLength - (obj[2] + obj[4]) + "px";
  right.innerText =
    scale * (nLength - Math.round((obj[2] + obj[4]) * 10000) / 10000);
  right.style.textAlign = "center";
  right.style.bottom = "0px";
  right.style.color = "#F50";
  //left.style.height = gtp+(nStrings-obj[5])*(nWidth/nStrings)+"px";
  right.style.zIndex = 2;

  main.appendChild(right);
}

function deleteMeasures() {
  let st = document.getElementsByClassName("measure-del");
  for (let a = st.length; a > 0; a--) {
    st[a - 1].remove();
  }
}

function drawRulers() {
  const guitarContainer = document.getElementById("guitar-container");

  let pos = document.getElementById("rulerPosition").value;

  if (document.getElementById("interval-ruler") != null) {
    document.getElementById("interval-ruler").remove();
    document.getElementById("fixed12-ruler").remove();
  }
  //document.getElementById('interval-ruler').remove();

  let mult = 1 / Math.pow(nInterval, 1 / nDivision);
  let edomult = 1 / Math.pow(2, 1 / 12); //later
  let fretZeroDif = nLength * Math.pow(mult, pos); //move fret ruler

  let intervalRuler = document.createElement("div");
  let intrulertext = document.createElement("div");
  intervalRuler.id = "interval-ruler";
  intrulertext.innerText = "" + nInterval + ":1";
  intrulertext.style.position = "absolute";
  intrulertext.style.bottom = "0px";
  intrulertext.style.left = "5px";
  intervalRuler.appendChild(intrulertext);

  intervalRuler.style.color = "#f0f";
  intervalRuler.style.display = "block";
  intervalRuler.style.width = fretZeroDif + "px";
  intervalRuler.style.height = "20px";
  intervalRuler.style.position = "absolute";
  intervalRuler.style.top = gtp + nWidth + "px";
  intervalRuler.style.marginLeft = nLength - fretZeroDif + 50 * nZoom + "px";
  intervalRuler.style.border = "1px solid #f0f";
  intervalRuler.style.borderTop = "none";
  guitarContainer.appendChild(intervalRuler);

  let intervalMark = document.createElement("div");
  intervalMark.style.left = fretZeroDif - fretZeroDif * (1 / nInterval) + "px";
  intervalMark.style.top = "0px";
  intervalMark.style.position = "absolute";
  intervalMark.style.width = "0px";
  intervalMark.style.height = "20px";
  intervalMark.style.border = "none";
  intervalMark.style.borderRight = "inherit";
  intervalRuler.appendChild(intervalMark);

  let fixedEdo = document.createElement("div");
  fixedEdo.id = "fixed12-ruler";

  let edotext = document.createElement("div");
  edotext.innerText = "12ED2";
  edotext.style.position = "absolute";
  edotext.style.color = "#0a0";
  edotext.style.bottom = "0px";
  edotext.style.left = "5px";
  fixedEdo.appendChild(edotext);

  fixedEdo.style.width = fretZeroDif + "px";
  fixedEdo.style.display = "block";
  fixedEdo.style.height = "20px";
  fixedEdo.style.position = "absolute";
  fixedEdo.style.top = gtp + 20 + nWidth + "px";
  fixedEdo.style.marginLeft = nLength - fretZeroDif + 50 * nZoom + "px";
  fixedEdo.style.border = "1px solid #0F0";
  fixedEdo.style.borderTop = " none";
  guitarContainer.appendChild(fixedEdo);

  for (let r = 1; r < 48; r++) {
    let edomark = document.createElement("div");
    edomark.className = "edoMark";
    edomark.style.width = "5px";
    edomark.style.height = "20px";
    edomark.style.left =
      fretZeroDif - fretZeroDif * Math.pow(edomult, r) - 5 + "px";
    edomark.style.borderRight =
      "1px dashed rgba(0,255,0," + (1 - 1 * (r / 48)) + ")";

    edomark.style.position = "absolute";
    fixedEdo.appendChild(edomark);
    let markNumber = document.createElement("div");
    markNumber.innerText = r;
    markNumber.style.position = "absolute";
    markNumber.style.top = +25 + "px";
    markNumber.className = "fretNumber";
    markNumber.style.color = "rgba(0,255,0," + (1 - 1 * (r / 48)) + ")";
    edomark.appendChild(markNumber);
  }
}

function rulersToggle() {
  let ruler1 = document.getElementById("interval-ruler");
  let ruler2 = document.getElementById("fixed12-ruler");

  if (ruler1.style.display == "block") {
    ruler1.style.display = "none";
    ruler2.style.display = "none";
  } else (ruler1.style.display = "block"), (ruler2.style.display = "block");
}

let playWithCursor = document.getElementById("play-cursor").checked;

function createGuitarII(hl) {
  strings = [];
  notesPool = [];
  measures = [];

  nZoom = document.getElementById("nZoom").value / 1;
  nStrings = document.getElementById("nStrings").value;
  nInterval = document.getElementById("nInterval").value;
  nFrets = parseInt(document.getElementById("nFrets").value); //?
  nLength = document.getElementById("nLength").value * nZoom;
  nDivision = document.getElementById("nDivision").value;
  nWidth = parseInt(document.getElementById("nWidth").value * nZoom);

  notesPool = getAllIntervals();
  //let gtp = 80;

  let adj = document.getElementsByClassName("stringAdjust");
  if (adj.length > 0) {
    for (a in adj) {
      adj.item(a).style.top =
        (nStrings - 2 - a) * (nWidth / nStrings) + gtp + 5 + "px";
    }
  }

  let fullg = document.getElementById("full-guitar");
  fullg.style.minHeight = nWidth + 250 + "px";

  document.getElementById("guitar-container").remove();
  const guitarContainer = document.createElement("div");
  guitarContainer.id = "guitar-container";
  guitarContainer.style.marginLeft = "100px";
  fullg.appendChild(guitarContainer);

  //rulers and extras
  {
    let bridgeEnd = document.createElement("div");
    bridgeEnd.style.position = "absolute";
    bridgeEnd.style.width = "1px";
    bridgeEnd.style.borderRight = "5px solid #333";
    bridgeEnd.style.height = nWidth + "px";
    bridgeEnd.style.marginLeft = nLength + 50 * nZoom + "px";
    bridgeEnd.style.top = gtp + "px";
    guitarContainer.appendChild(bridgeEnd);

    drawRulers();
  }

  let fullFrame = document.createElement("DIV");
  fullFrame.style.position = "absolute";
  fullFrame.style.width = "auto";
  fullFrame.style.top = gtp + "px";

  function drawStringCut(intervals, i) {
    let top = i * (nWidth / nStrings);

    let firstBlock = document.createElement("div");
    firstBlock.className = "first-block";
    firstBlock.style.position = "absolute";
    firstBlock.style.top = top + "px";
    firstBlock.style.left = "0px";
    firstBlock.style.width = 50 * nZoom + "px";
    firstBlock.style.height = nWidth / nStrings + "px";
    firstBlock.style.backgroundColor = "#222";
    firstBlock.class = "first-block";
    fullFrame.appendChild(firstBlock);

    if (strings[i] == undefined) {
      strings[i] = [];
    }
    strings[i].push([firstBlock, intervals[0], i, -1, 0, 0, 0]);

    let string = stringInBlock(firstBlock, i);
    string.onmouseenter = () => {
      if (playWithCursor) playToneII(notesPool[strings[i][0][5] - 1]);
    };

    for (let s = 0; s < nFrets; s++) {
      let stringBlock = document.createElement("DIV");
      stringBlock.className = "string-block";
      //stringBlock.id = s
      let start, end;
      start = nLength - nLength / intervals[s];
      end = nLength - nLength / intervals[s + 1];
      let width = end - start;
      stringBlock.style.position = "absolute";
      stringBlock.style.top = top + "px";
      stringBlock.style.left = 50 * nZoom + start + "px";
      stringBlock.style.width = width + "px";
      stringBlock.style.height = nWidth / nStrings + "px";
      stringBlock.className = "string-block";

      if (i == 0) {
        let fretNumberUI = document.createElement("div");
        fretNumberUI.innerText = s + 1;
        fretNumberUI.style.position = "absolute";
        fretNumberUI.style.top = -25 + "px";
        fretNumberUI.className = "fretNumber";
        fretNumberUI.style.left = -8 + width + "px";
        if (i == 0) {
          fretNumberUI.style.left = -4 + width / 2 + "px";
        }
        fretNumberUI.onmouseenter = () => {
          highlightFret(s, 1);
        };
        fretNumberUI.onmouseleave = () => {
          highlightFret(s, 0);
        };
        stringBlock.appendChild(fretNumberUI);
      }

      let string = stringInBlock(stringBlock, i);

      if (s == nFrets - 1) {
        let lastString = document.createElement("div");
        lastString.className = "string";
        lastString.id = "test" + s;
        lastString.style.position = "absolute";
        lastString.style.top = nWidth / nStrings / 2 + "px";
        lastString.style.width = nLength - end + "px";
        lastString.style.left = width + "px";
        stringBlock.appendChild(lastString);
      }

      if (strings[i] == undefined) {
        strings[i] = [];
      }
      strings[i].push([stringBlock, intervals[s], i, s, 0, 0, 0]);

      if (measures[i] == undefined) {
        measures[i] = [];
      }
      measures[i].push([stringBlock, intervals[s], start, end, width, i]);

      string.onmouseenter = () => {
        if (playWithCursor) playToneII(notesPool[strings[i][s][5]]);
        drawMeasures(measures[i][s]);
      };
      string.onmouseleave = () => {
        deleteMeasures();
      };
    }

    function stringInBlock(w, i) {
      let string = document.createElement("div");
      string.className = "string";
      string.style.width = "inherit";
      string.style.position = "absolute";
      //string.style.height = (i)*.2+"px";
      string.style.top = nWidth / nStrings / 2 + "px";
      w.appendChild(string);

      fullFrame.appendChild(w);
      return string;
    }
  }

  for (let j = 0; j < nStrings; j++) {
    let newIntervals = rerrangeIntervals(
      notesPool,
      nStrings - 1 - j,
      tuningPatterns
    );
    //console.log(newIntervals);
    drawStringCut(newIntervals, j);
  }
  mapNotes(nStrings, tuningPatterns, intervals.length);
  guitarContainer.appendChild(fullFrame);

  if (hl) createHighlightControls();
  createChordRowControls();
  createColorOpts();
  highlightNotes();
}

function rerrangeIntervals(intervals, newindex, tuningPattern) {
  let nFrets = document.getElementById("nFrets").value;
  let newIntervals = [];
  let padding = 0;
  for (let i = 0; i < newindex; i++) {
    padding += tuningPattern[i];
  }
  let newBase = intervals[padding];
  for (let i = 0; i < nFrets + 1; i++) {
    newIntervals.push(intervals[padding + i] / newBase);
  }
  return newIntervals;
}

let arpSpeed = document.getElementById("arpSpeed").value;
let arpSpeedCtrl = document.getElementById("arpSpeed");
arpSpeedCtrl.oninput = () => {
  arpSpeed = parseFloat(document.getElementById("arpSpeed").value);
};

function playRowChord(row) {
  //console.log(arpSpeed)
  let order = [];
  let arp = GetTrueOne("arpeggio");
  switch (arp) {
    case 0:
      for (let i = 0; i < toplay.length; i++) {
        order.push(i);
      }
      break;
    case 1:
      for (let i = 0; i < toplay.length; i++) {
        order.push(i);
      }
      order.reverse();
      break;
    case 2:
      for (let i = 0, k = 0; i < toplay.length; k++) {
        order.push(toplay.length - 1 - k);
        order.push(k);
        i += 2;
      }
      break;
    case 3:
      for (let i = 0, k = 0; i < toplay.length; k++) {
        order.push(toplay.length - 1 - k);
        order.push(k);
        i += 2;
      }
      order.reverse();
      break;
    default:
      break;
    /*case 4:
        break;*/
  }

  for (let d = 0; d < toplay.length; d++) {
    let p = order[d];
    //console.log(p);

    let nt = (row + rowPattern[rowPattern.length - 1 - p]) % toplay[d].length;
    if (toplay[p][nt] != undefined) {
      let topl = toplay[d][nt];
      setTimeout(() => {
        playToneII(notesPool[toplay[p][nt][1] - 1]);
      }, 1000 * arpSpeed * d);
      setTimeout(() => {
        toplay[p][nt][0].getElementsByClassName("string")[0].style.borderColor =
          "#fff";
      }, 1000 * arpSpeed * d);
      setTimeout(() => {
        toplay[p][nt][0].getElementsByClassName("string")[0].style.borderColor =
          "#aaa";
      }, 1100 * arpSpeed * (d + 1));
      toplay[p][nt][0].getElementsByClassName(
        "mark-highlight"
      )[0].style.border = "1px solid #fff";
    } else {
      console.log("skiped");
      continue;
    }
  }
}

function createGuitarWaveform(context) {
  //var real = new Float32Array([0.,0.1,0.2,0.3,0.4,0.5,0.6,0.5,0.4,0.3,0]);
  var real = new Float32Array([
    0, 0.1, 0.2, 0.8, -0.4, 0.5, 0.6, 0.5, -0.4, -0.3, 0,
  ]);
  var imag = new Float32Array(real.length).fill(0);

  var wave = context.createPeriodicWave(real, imag);
  return wave;
}

function randomSynth() {
  let len = Math.round(Math.random() * 10) * Math.round(Math.random() * 100);
  var real = new Float32Array(len);
  var imag = new Float32Array(real.length).fill(0);

  for (let l = 0; l < len; l++) {
    real[l] = (2 / (l + 1)) * (Math.random() * 2 - 1);
    //real[l] = ((Math.random()*2)-1);
  }
  console.log(real);
  guitarWaveform = audioContext.createPeriodicWave(real, imag);

  let lenr = Math.round(Math.random() * 10) * Math.round(Math.random() * 100);
  var realr = new Float32Array(lenr);
  var imagr = new Float32Array(realr.length).fill(0);

  for (let l = 0; l < lenr; l++) {
    realr[l] = (2 / (l + 1)) * (Math.random() * 2 - 1);
    //realr[l] = ((Math.random()*2)-1);
  }
  console.log(realr);
  guitarWaveformII = audioContext.createPeriodicWave(realr, imagr);
}

let synthSound = document.getElementById("synth-sound").selectedIndex;

function setSound() {
  synthSound = document.getElementById("synth-sound").selectedIndex;
  let real, imag, realr, imagr;
  switch (synthSound) {
    case 0:
      real = new Float32Array([
        0.4207378923892975, -0.49288368225097656, 0.22619369626045227,
        -0.19826681911945343, 0.14681124687194824, -0.02477218024432659,
        -0.14141890406608582, -0.056908246129751205, -0.047021519392728806,
        0.038248054683208466, -0.050129592418670654, -0.07435183972120285,
      ]);
      imag = new Float32Array(real.length).fill(0);
      realr = new Float32Array([
        0.4765062630176544, 0.4309591054916382, -0.23125126957893372,
        -0.05906444415450096, -0.04425195977091789, -0.16326244175434113,
        -0.14275743067264557,
      ]);
      imagr = new Float32Array(realr.length).fill(0);
      break;
    case 1:
      real = new Float32Array([
        0.4236941635608673, 0.34615644812583923, -0.10777749866247177,
        -0.21940580010414124, 0.16738857328891754, -0.0704193264245987,
        -0.1045544296503067,
      ]);
      imag = new Float32Array(real.length).fill(0);
      realr = new Float32Array([
        -0.8147599697113037, -0.06583309173583984, -0.2519873380661011,
        -0.24870529770851135, 0.19892634451389313, -0.012625076808035374,
        0.006483488250523806, 0.012754932045936584, 0.003802340477705002,
        0.014584746211767197, -0.05540362000465393, 0.08311252295970917,
        0.06144854053854942, 0.035559989511966705, -0.007318796124309301,
        0.012353901751339436, 0.04376857727766037, 0.001841263729147613,
        -0.03979884460568428, 0.017023207619786263,
      ]);
      imagr = new Float32Array(realr.length).fill(0);
      break;
    case 2:
      real = new Float32Array([
        0.16436706483364105, -0.43988853693008423, 0.055948104709386826,
        0.14110679924488068, -0.07509560137987137, 0.06662444770336151,
        0.05897396802902222, -0.005172446835786104, -0.037030838429927826,
        -0.0014124794397503138,
      ]);
      imag = new Float32Array(real.length).fill(0);
      realr = new Float32Array([
        0.9258902072906494, -0.0072465683333575726, -0.16209977865219116,
        -0.030446451157331467, -0.11308002471923828, 0.10021530091762543,
        -0.09616287052631378, 0.08078581839799881, -0.09976911544799805,
        0.04616180434823036, 0.07181178778409958, -0.05903996154665947,
        -0.053067538887262344, -0.04850637540221214, -0.028017962351441383,
        0.03970697149634361, 0.030195031315088272, 0.055277321487665176,
        -0.052398476749658585, -0.04479886218905449, 0.03287266194820404,
        -0.01838614046573639, -0.01784912496805191, 0.0062774475663900375,
        -0.00042076443787664175, -0.03516609966754913, 0.01795848086476326,
        0.014485829509794712, -0.00019342778250575066, 0.027610216289758682,
        0.009669559076428413, -0.00030690283165313303, -0.0038343218620866537,
        -0.020989296957850456, -0.004148482345044613, 0.027297427877783775,
        -0.00044639737461693585, -0.015786562114953995, -0.00018196720338892192,
        0.021016612648963928, 0.0018101675668731332, -0.002985738217830658,
        0.0059514837339520454, 0.015043898485600948, 0.02082366682589054,
        0.014005002565681934, -0.01941320113837719, 0.008211684413254261,
        -0.014812914654612541, 0.013135639950633049, -0.002958318218588829,
        0.00032697379356250167, -0.003346458775922656, 0.010548711754381657,
        0.0100685004144907, -0.016780061647295952, 0.008900454267859459,
        0.0015407237224280834, -0.01387739460915327, 0.014247828163206577,
        0.008795399218797684, 0.0039942520670592785, 0.003987849690020084,
        -0.0014850485604256392, -0.005390774458646774, -0.008327859453856945,
        0.012279842980206013, 0.007769627030938864, -0.005480640567839146,
        -0.00043552624993026257, -0.010400429368019104, -0.004456645809113979,
        0.0019532651640474796, -0.0074810790829360485, 0.001614307169802487,
        0.008337220177054405, 0.004391784779727459, 0.00040024970076046884,
        -0.0006107338704168797, -0.004466195125132799, -0.004752593580633402,
      ]);
      imagr = new Float32Array(realr.length).fill(0);
      break;
    case 3:
      real = new Float32Array([
        0.24714580178260803, -0.05018153414130211, 0.32654279470443726,
        0.22627410292625427,
      ]);
      imag = new Float32Array(real.length).fill(0);
      realr = new Float32Array([
        -0.7504372000694275, 0.42120420932769775, 0.1635001003742218,
        0.1628197729587555, -0.15321333706378937, -0.1610567718744278,
        0.09692426770925522, 0.06332758069038391, 0.0015675913309678435,
        -0.05138355493545532, -0.0016923652729019523, -0.006648099049925804,
        -0.008484410122036934, -0.05138012021780014, -0.002060315106064081,
        0.03790909796953201, 0.0069217015989124775, -0.03918429836630821,
        -0.008021658286452293, 0.03897804766893387, -0.013393324799835682,
        -0.03420746698975563, -0.0064758718945086, 0.015721140429377556,
        -0.017293857410550117, -0.035262320190668106, -0.00046572653809562325,
        0.004569853190332651, -0.012674292549490929, 0.02652391791343689,
        0.008671069517731667, 0.028394168242812157, -0.02791759930551052,
        -0.007579777855426073, 0.004179808311164379, -0.020019017159938812,
        -0.010995465330779552, 0.013874271884560585, 0.00875583104789257,
        -0.022369585931301117, 0.021845411509275436, -0.010241969488561153,
        -0.018659349530935287, 0.01800083927810192, 0.004280214197933674,
        -0.011976473964750767, -0.020270243287086487, 0.004064806737005711,
        0.018914954736828804, 0.011640127748250961, 0.003212216543033719,
        0.01571013778448105, -0.0035199171397835016, -0.017300236970186234,
      ]);
      imagr = new Float32Array(realr.length).fill(0);
      break;
    case 4:
      real = new Float32Array([
        -1.0581673383712769, -0.48820751905441284, 0.4606047570705414,
        0.43217402696609497, -0.11533733457326889, -0.31138738989830017,
        0.0491982027888298, 0.03648662939667702, -0.013429827988147736,
        -0.09430801123380661, 0.10897228866815567, 0.11039958149194717,
        0.10210931301116943, 0.11326885223388672, 0.08876354992389679,
        0.12195687741041183, 0.01102241687476635, -0.10559062659740448,
        -0.05462968349456787, -0.03405064344406128, 0.0718260407447815,
        0.0024352988693863153, 0.055741552263498306, 0.03406592085957527,
        -0.04474278539419174, 0.01452607475221157, 0.018807481974363327,
        0.04020712897181511, 0.04822973906993866, -0.04049796983599663,
        -0.05585256591439247, 0.013371478766202927, -0.036717288196086884,
        -0.00560098746791482, 0.02780359797179699, 0.04105018451809883,
        0.032778091728687286, -0.004129643086344004, -0.021047042682766914,
        -0.034138571470975876, 0.0008649579831399024, -0.017090683802962303,
        -0.016399521380662918, -0.04150037467479706, -0.0067250654101371765,
        -0.032020699232816696,
      ]);
      imag = new Float32Array(real.length).fill(0);
      realr = new Float32Array([
        -0.5335812568664551, 0.06711488962173462, -0.004482958000153303,
        0.40977251529693604, 0.26334890723228455, 0.32666096091270447,
        -0.04668070375919342, -0.025794869288802147, -0.058715011924505234,
        0.08043854683637619, 0.14357319474220276, 0.12862728536128998,
        0.030104879289865494, -0.06174645572900772, 0.009202650748193264,
        0.07888811826705933, -0.11604148149490356, 0.03661639243364334,
        -0.07432880997657776, -0.050964124500751495, 0.0006783487042412162,
        0.06945088505744934, 0.017264654859900475, 0.03491683304309845,
        0.04193439334630966, -0.03387359157204628, -0.031540874391794205,
        -0.030019398778676987, -0.009999267756938934, 0.03303196653723717,
        0.04740484431385994, 0.048337630927562714, -0.05090995132923126,
        0.015911919996142387, 0.011063673533499241, 0.04977509379386902,
        -0.030418790876865387, -0.017006251960992813, -0.02791796810925007,
        0.03429336100816727, -0.046986617147922516, -0.006233240943402052,
        0.020679138600826263, -0.016415145248174667, 0.008006598800420761,
        -0.003625395940616727, 0.003186575137078762, 0.03308440372347832,
        -0.04064307361841202, 0.017485421150922775, -0.03078758344054222,
        -0.002265418181195855, 0.036488305777311325, 0.021607639268040657,
        -0.02422366477549076, -0.007250295951962471, -0.010629184544086456,
        -0.02648288570344448, 0.03310618922114372, -0.029306992888450623,
        0.009776931256055832, -0.015117968432605267, -0.028616860508918762,
        0.008396542631089687, -0.02435377798974514, -0.027806833386421204,
        -0.011458251625299454, -0.013662541285157204, 0.01117595937103033,
      ]);
      imagr = new Float32Array(realr.length).fill(0);
      break;
    case 5:
      real = new Float32Array([
        -0.2308727651834488, 0.8363519310951233, -0.4338916540145874,
        -0.18384818732738495, -0.21433569490909576, 0.021855982020497322,
        0.11945220828056335, -0.07985243946313858, 0.10817990452051163,
        0.12543512880802155, 0.042435385286808014, 0.036091480404138565,
        -0.1287306547164917, 0.009697267785668373, -0.050795719027519226,
        0.04271398112177849, -0.10684321820735931, 0.09842023253440857,
        0.036277879029512405, -0.04669351503252983, 0.013637508265674114,
        -0.04584303870797157, -0.019889192655682564, 0.05475190281867981,
        0.0017535630613565445, -0.007352991495281458, 0.025872254744172096,
        0.015599732287228107, -0.05662089213728905, 0.007922045886516571,
        0.041947200894355774, -0.0398285910487175, -0.05043603479862213,
        0.05079420655965805, 0.008887732401490211, 0.053838685154914856,
        0.020346008241176605, -0.006220187060534954, -0.039836689829826355,
        -0.028499003499746323, -0.007799785118550062, 0.0370025597512722,
        -0.04497956484556198, 0.008228437043726444, 0.01464776135981083,
        0.03516021743416786, 0.027254465967416763, -0.0055917068384587765,
        0.036610256880521774, 0.0051465993747115135, 0.02162431925535202,
        -0.030256031081080437, -0.034454040229320526, 0.02584807761013508,
        -0.010047512128949165,
      ]);
      imag = new Float32Array(real.length).fill(0);
      realr = new Float32Array([
        1.347856879234314, 0.9279413819313049, -0.41038256883621216,
        0.26846349239349365, 0.3497995436191559, -0.31182509660720825,
        0.26235997676849365, 0.11643271893262863, -0.06903377920389175,
        0.027904246002435684, 0.11461275815963745, 0.06080805882811546,
        -0.0638611763715744, 0.0678243413567543, 0.1158611997961998,
        0.042473554611206055, 0.016784215345978737, -0.0783068835735321,
        -0.08270370215177536, 0.0868254154920578, -0.07920639961957932,
        0.055161286145448685, 0.00829305499792099, -0.024921614676713943,
        0.037821684032678604, 0.03115726076066494, 0.06900359690189362,
        -0.02134733274579048, -0.040339574217796326, -0.056333739310503006,
        0.034610453993082047, 0.042680636048316956, 0.0389895997941494,
        0.021590495482087135, 0.037433087825775146, -0.013852952048182487,
        -0.03326551988720894, -0.014207061380147934, 0.041336603462696075,
        0.0417172946035862, 0.023767223581671715,
      ]);
      imagr = new Float32Array(realr.length).fill(0);
      break;
  }
  guitarWaveform = audioContext.createPeriodicWave(real, imag);
  guitarWaveformII = audioContext.createPeriodicWave(realr, imagr);
}

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const masterVol = audioContext.createGain();
masterVol.connect(audioContext.destination);
masterVol.gain.value = 0.5;

const volumeCtrl = document.getElementById("volume-ctrl");
volumeCtrl.addEventListener("input", function () {
  masterVol.gain.value = this.value;
});

var guitarWaveform;
var guitarWaveformII;
setSound();
let pmult = 100;
let sus = 0.2,
  nl = 0.5,
  att = 0.0,
  rel = 0.8;

function playToneII(rank) {
  //console.log(rank)
  let freq = rank * pmult;
  let osc = audioContext.createOscillator();
  osc.setPeriodicWave(guitarWaveform);
  //osc.waveform  = "triangle"
  let noteGain = audioContext.createGain();
  noteGain.gain.setValueAtTime(0, 0);
  noteGain.gain.linearRampToValueAtTime(
    sus,
    audioContext.currentTime + nl * att
  );
  noteGain.gain.setValueAtTime(sus, audioContext.currentTime + nl - nl * rel);
  noteGain.gain.linearRampToValueAtTime(0, audioContext.currentTime + nl);

  osc.frequency.value = freq;
  osc.start(0);
  osc.stop(audioContext.currentTime + nl);
  osc.connect(noteGain);
  noteGain.connect(masterVol);

  let osct = audioContext.createOscillator();
  osct.setPeriodicWave(guitarWaveformII);
  //osc.waveform  = "triangle"
  let noteGaint = audioContext.createGain();
  noteGaint.gain.setValueAtTime(0, 0);
  noteGaint.gain.linearRampToValueAtTime(
    sus,
    audioContext.currentTime + nl * 0.5 * att
  );
  noteGaint.gain.setValueAtTime(
    0.2,
    audioContext.currentTime + nl * 0.5 - nl * 0.5 * rel
  );
  noteGaint.gain.linearRampToValueAtTime(
    0,
    audioContext.currentTime + nl * 0.5
  );

  osct.frequency.value = freq;
  osct.start(0);
  osct.stop(audioContext.currentTime + nl * 0.5);
  osct.connect(noteGaint);

  noteGaint.connect(masterVol);
}

let presets = [];
function getPresets() {
  let rawpresets = [
    "12ED2 Guitar|6|19|0|12|2| |100|1000|1|100|5,3,5,5,5",
    "12ED2 Bass|4|19|0|12|2| |120|1000|1|80|5,5,5",
  ];
  let size = localStorage.length;
  if (size > 0) {
    for (let i = 0; i < size; i++) {
      rawpresets.push(localStorage.getItem(localStorage.key(i)));
    }
  }
  for (let i = 0; i < rawpresets.length; i++) {
    let parsed = rawpresets[i].split("|");
    presets.push(parsed);
  }
}

function fillPresetList() {
  let sel = document.getElementById("preset-list");
  for (let i = 0; i < presets.length; i++) {
    let opt = document.createElement("option");
    opt.value = i;
    opt.innerText = presets[i][0];
    sel.appendChild(opt);
  }
}

function savePreset(n) {
  let name = n;
  let nZoom = document.getElementById("nZoom").value;
  let nStrings = document.getElementById("nStrings").value;
  let nInterval = document.getElementById("nInterval").value;
  let nFrets = document.getElementById("nFrets").value; //?
  let nLength = document.getElementById("nLength").value;
  let nDivision = document.getElementById("nDivision").value;
  let nWidth = document.getElementById("nWidth").value;
  let intervalsList = document.getElementById("intervalsList").value;
  let tuningType = GetTrueOne("tuningType");
  let tuningPat = tuningPatterns;
  let lowestPitch = document.getElementById("lowest-pitch").value;

  let value =
    "" +
    name +
    "|" +
    nStrings +
    "|" +
    nFrets +
    "|" +
    tuningType +
    "|" +
    nDivision +
    "|" +
    nInterval +
    "|[" +
    intervalsList +
    "]|" +
    nWidth +
    "|" +
    nLength +
    "|" +
    nZoom +
    "|" +
    lowestPitch +
    "|" +
    tuningPat +
    "";

  localStorage.setItem(name, value);
}

//var presetTuningPattern = [];
function applyPreset() {
  let p = document.getElementById("preset-list").selectedIndex;
  document.getElementById("nStrings").value = presets[p][1];
  document.getElementById("nFrets").value = presets[p][2];

  let tt = document.getElementsByName("tuningType");
  switch (presets[p][3]) {
    case 0:
      tt[0].checked = true;
      tt[1].checked = false;
      break;
    case 1:
      tt[0].checked = false;
      tt[1].checked = true;
      break;
    default:
      break;
  }
  document.getElementById("nDivision").value = presets[p][4];
  document.getElementById("nInterval").value = presets[p][5];
  document.getElementById("intervalsList").value = presets[p][6];
  document.getElementById("nWidth").value = presets[p][7];
  document.getElementById("nLength").value = presets[p][8];
  document.getElementById("nZoom").value = presets[p][9];
  document.getElementById("lowest-pitch").value = presets[p][10];

  let splited = presets[p][11].split(",");
  for (let i = 0; i < splited.length; i++) {
    presetTuningPattern.push(parseInt(splited[i]));
  }
  prepareGuitar();
}

function openSavePreset(b) {
  console.log(b.children.length);

  if (b.children.length == 0) {
    let main = document.createElement("div");
    main.style.zIndex = "10";
    main.style.backgroundColor = "#333";
    main.style.position = "absolute";
    main.style.padding = "10px";
    main.style.top = "15px";
    main.style.left = "-50px";
    main.innerText = "Preset Name:";
    b.appendChild(main);

    let inp = document.createElement("input");
    inp.type = "text";
    inp.id = "tmpPresetName";
    main.appendChild(inp);

    let sub = document.createElement("button");
    sub.innerText = "SAVE";
    sub.onclick = (ev) => {
      if (inp.value.length > 0) {
        savePreset(inp.value);
        main.remove();
        ev.stopPropagation();
      } else {
        alert("Non-empty names only.");
      }
    };
    main.appendChild(sub);

    document.getElementById("guitar-parent").onclick = () => {
      main.remove();
    };
  }
}

window.onload = () => {
  getPresets();
  fillPresetList();
};