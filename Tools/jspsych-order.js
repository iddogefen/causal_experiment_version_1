/*
 * Example plugin template
 */

jsPsych.plugins["order"] = (function() {

  var plugin = {};
  // which blank image to show
  var numtext=	[1,2,3,4,5,6,7,8,9,10];


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
	 // var body = document.getElementsByTagName("body")[0];
      divbut.removeChild(button);
    });

    var end_times = [];
    var current_order = 0;
    var rows = 1;
    var columns = 10; // Adjusted to create a grid for 10 objects (2x5)
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

display_element.innerHTML = `
    <div style="margin-top: 0px; ">
        <p style="margin: 0; padding: 0; font-size:25px;text-align:left ">Scrambled Order</p>
        <div id="pieces" xstyle="margin-bottom: 200px;"></div>
    </div>
    <div style="margin-top: 0px;">
			<div>
	    			<table id="tbl" style="width=100%;table-layout: xfixed;"><tr style="flex;font-size:25px ;width=100%">
						<td style="width: 50%;margin: 0; padding: 0;">
							<p style="margin: 0; padding: 0; font-size:25px  text-align:left;">Correct Order&nbsp;&nbsp;&nbsp;</p>
						</td>

						<td id="td2" style="width: 50%;">
						</td>
	    			</tr></table>
		</div>
        <div id="board" style="margin: 0;"></div>
    </div>
  `;
	 // Get references to the elements
	 var divbut = document.getElementById('divbut');
	 var parent = document.getElementById('td2');

	 // Move the child element to the new parent
	 parent.appendChild(divbut);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
	  //alert(tile.src);
      tile.addEventListener("dragstart", dragStart);
    }
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      let tile = document.createElement("img");
      let tile_blank = document.createElement("img");
      tile.src = "./images/blank"+String(numtext[r*columns+c])+".jpg";
	  //tile.src="./images/blank.jpg";

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

	  // compute which image to show
	  w=parseFloat(getComputedStyle(currTile.parentElement).width);
	  h=parseFloat(getComputedStyle(currTile.parentElement).height);
	  x_par=currTile.parentElement.getBoundingClientRect().x;
	  y_par=currTile.parentElement.getBoundingClientRect().y;
	  center_curr_x=currTile.getBoundingClientRect().x+0.5*currTile.getBoundingClientRect().width;
	  center_curr_y=currTile.getBoundingClientRect().y+0.5*currTile.getBoundingClientRect().height;
	  percent_x=   (center_curr_x- x_par)/w;
	  percent_y=   (center_curr_y- y_par)/h;
	  col=Math.floor(parseInt(percent_x*5));
	  row=Math.floor(parseInt(percent_y*2));
	  num_blank=col+row*5;

	  otherTile.src = currImg;
	  if (currTile.parentElement.id=="pieces")	{
		  	if (otherImg.includes("blank"))
				currTile.src = "./images/blank.jpg";
			else
				currTile.src =  otherImg;
		}
		else {
			if (otherImg.includes("blank"))
				currTile.src = "./images/blank"+String(numtext[num_blank])+".jpg";
			else
				currTile.src =  otherImg;
   		}

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
