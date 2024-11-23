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
	var divbut = document.createElement("div");
	divbut.id = "divbut"; // Set an ID for the div
    var button = document.createElement("button");
    button.innerHTML = "Click when done";

    var body = document.getElementsByTagName("body")[0];
	divbut.appendChild(button);
    body.appendChild(divbut);
    button.id = "btn1";
    var finalImagePositions = [];

    button.addEventListener("click", function() {
      // Check if exactly 10 items are placed on the board
      if (isOrderComplete()) {
        const end_time = performance.now();
        const rt = Math.round(end_time - stars_times); // Calculate reaction time
        end_times.push(end_time);
    
        // Collect trial data
        const trial_data = {
          initial_locations: JSON.stringify(tiles_id),
          moves: JSON.stringify(moves),
          final_locations_3: JSON.stringify(finalImagePositions),
          number_of_moves: JSON.stringify(turns),
          rt: JSON.stringify(rt)
        };
    
        // End the trial and save data
        jsPsych.finishTrial(trial_data);
        body.removeChild(button);
      } else {
        alert("Please arrange all 10 items on the board before continuing.");
      }
    });
    
    // Function to check if exactly 10 objects are placed on the board
    function isOrderComplete() {
      const imagesOnBoard = document.querySelectorAll('#board img'); // Select all images on the board
      let filledSlots = 0;
      imagesOnBoard.forEach(img => {
        if (!img.src.includes("blank")) { // Check if the slot is not empty
          filledSlots++;
        }
      });
      return filledSlots === 10; // Return true if there are exactly 10 items
    }
    
    // Function to display the stimulus and setup the board
    function show_stimulus(order) {
      var start_time = performance.now();
      move_time_1 = start_time; // Record the start time of the trial
      stars_times.push(start_time);
    
      // Setup the HTML structure for the board and pieces
      display_element.innerHTML = `
        <div style="margin-top: 0px; ">
            <p style="margin: 0; padding: 0; font-size:25px;text-align:left ">Scrambled Order</p>
            <div id="pieces"></div>
        </div>
        <div style="margin-top: 0px;">
            <div>
                <table id="tbl" style="width=100%;table-layout: xfixed;">
                    <tr style="flex;font-size:25px ;width=100%">
                        <td style="width: 50%;margin: 0; padding: 0;">
                            <p style="margin: 0; padding: 0; font-size:25px  text-align:left;">Arrange all items&nbsp;&nbsp;&nbsp;</p>
                        </td>
                        <td id="td2" style="width: 50%;"></td>
                    </tr>
                </table>
            </div>
            <div id="board" style="margin: 0;"></div>
        </div>
      `;
    
      // Move the button to the correct location on the page
      var divbut = document.getElementById('divbut');
      var parent = document.getElementById('td2');
      parent.appendChild(divbut);
    
      // Loop through stimuli and add them to the display
      for (let i = 0; i < trial.stimuli.length; i++) {
        let tile = document.createElement("img");
        tile.src = `./images/${trial.stimuli[i]}.png`; // Set the image source
        tile.id = `stimulus_${i}`; // Assign a unique ID to each stimulus
        tiles_id.push(tile.id);
    
        // Add drag-and-drop functionality to the tiles
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);
    
        document.getElementById("pieces").append(tile); // Add the tile to the pieces section
      }
    }
    
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
    tile.src = "./images/" + trial.stimuli[i] + ".png";

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
	  if (otherImg.includes("blank"))// || (currTile.parentElement.id=="board" && otherTile.parentElement.id=="board"))
			currTile.src = "./images/blank.jpg";
		else
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
