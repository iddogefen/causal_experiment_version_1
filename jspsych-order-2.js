/*
 * Example plugin template
 */

jsPsych.plugins["order"] = (function() {

  var plugin = {};

  jsPsych.pluginAPI.registerPreload('free-sort', 'stimuli', 'image');

  plugin.info = {
    name: "order",
    parameters: {
      key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        default: 32 // spacebar
      },

      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'items to be displayed.'
      },

      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'The text that appears on the button to continue to the next trial.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {
    var button = document.createElement("button");
    button.innerHTML = "Click when done";

    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);
    button.id = "btn1";
    var finalImagePositions = [];

    button.addEventListener("click", function() {
      const end_time = performance.now();
      const rt = Math.round(end_time - stars_times);
      end_times.push(end_time);
      let final_locations = [];
      
      const images = document.querySelectorAll('#board img');
      finalImagePositions = [];

      images.forEach(image => {
        const rect = image.getBoundingClientRect();
        finalImagePositions.push({
          src: image.src,
          x: Math.round(rect.x),
          y: Math.round(rect.y)
        });
      });

      finalImagePositions.sort((a, b) => a.x - b.x);
      const trial_data = {
        initial_locations: JSON.stringify(tiles_id),
        moves: JSON.stringify(moves),
        final_locations_3: JSON.stringify(finalImagePositions),
        number_of_moves: JSON.stringify(turns),
        rt: JSON.stringify(rt)
      };

      jsPsych.finishTrial(trial_data);
      body.removeChild(button);
    });

    var current_order = 0;
    var rows = 2;
    var columns = 5; // Adjusted to create a grid for 10 objects (2x5)
    var currTile;
    var otherTile;
    var turns = 0;
    var rts = [];
    var tiles_id = [];
    let stars_times = [];
    let moves = [];

    function show_stimulus(order) {
      var start_time = performance.now();
      move_time_1 = start_time;
      stars_times.push(start_time);

      display_element.innerHTML = '<h2>Scrambled Order</h2>' +
        '<div id="pieces"></div>' +  
        '<h2>Correct Order</h2>' +
        '<div id="board"></div>' +
        '<b> 1 &nbsp &nbsp &nbsp &nbsp &nbsp 2 &nbsp &nbsp &nbsp &nbsp &nbsp 3 &nbsp &nbsp &nbsp &nbsp &nbsp 4 &nbsp &nbsp &nbsp &nbsp &nbsp 5 &nbsp &nbsp &nbsp &nbsp &nbsp 6 &nbsp &nbsp &nbsp &nbsp &nbsp 7 &nbsp &nbsp &nbsp &nbsp &nbsp 8 &nbsp &nbsp &nbsp &nbsp &nbsp 9 &nbsp &nbsp &nbsp &nbsp &nbsp 10 </b>' +
        '<div id= "btn1"></div>';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          let tile = document.createElement("img");
          tile.src = "images/blank.jpg";
          tile.addEventListener("dragstart", dragStart);
        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
          let tile = document.createElement("img");
          tile.src = "./images/blank.jpg";

          tile.addEventListener("dragstart", dragStart);
          tile.addEventListener("dragover", dragOver);
          tile.addEventListener("dragenter", dragEnter);
          tile.addEventListener("dragleave", dragLeave);
          tile.addEventListener("drop", dragDrop);
          tile.addEventListener("dragend", dragEnd);

          document.getElementById("board").append(tile);
        }
      }

      let pieces = [];
      for (let i = 1; i <= rows * columns; i++) {
        pieces.push(i.toString());
      }
      pieces.reverse();
      for (let i = 0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
      }

      for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "./images/" + trial.stimuli[i] + ".jpg";

        tile.id = trial.stimuli[i];
        tiles_id.push(tile.id);

        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("pieces").append(tile);
      }
    }

    function dragStart() {
      currTile = this;
    }

    function dragOver(e) {
      e.preventDefault();
    }

    function dragEnter(e) {
      e.preventDefault();
    }

    function dragLeave() {}

    function dragDrop() {
      otherTile = this;
    }

    function dragEnd() {
      if (currTile.src.includes("blank")) {
        return;
      }
      let currImg = currTile.src;
      let otherImg = otherTile.src;
      currTile.src = otherImg;
      otherTile.src = currImg;
      
      const rect_2 = otherTile.getBoundingClientRect();
      var move_time_2 = performance.now();
      var move_time_3 = Math.round(move_time_2 - move_time_1);
      moves.push({
        src: otherTile.src,
        x: Math.round(rect_2.x),
        y: Math.round(rect_2.y),
        move_time: move_time_3
      });

      move_time_1 = move_time_2;
      turns += 1;
      document.getElementById("turns").innerText = turns;
    }

    show_stimulus(current_order);
  }

  return plugin;
})();
