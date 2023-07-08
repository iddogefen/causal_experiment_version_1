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
        default:  'Continue',
        description: 'The text that appears on the button to continue to the next trial.'
      },
    }
  }

  plugin.trial = function(display_element, trial) {


var button = document.createElement("button");
button.innerHTML = "Click when done";


// 2. Append somewhere
var body = document.getElementsByTagName("body")[0];
body.appendChild(button);
button.id = "btn1"
// 3. Add event handler
button.addEventListener ("click", function() {
  const end_time = performance.now();
  const rt = end_time - stars_times;
  console.log("end_time:", end_time);
  end_times.push(end_time);
  let final_locations = [];
  final =  moves[moves.length-1];
  final_locations.push({
    final
    //x: Math.round(rect.x),
    //y: Math.round(rect.y),
    //move_time : move_time
        });



  const trial_data = {init_locations: init_locations,
    moves: moves,final_locations:final_locations,
    stars_time: stars_times,
  end_time: end_times,
rt: rt};

  jsPsych.finishTrial(trial_data);
  body.removeChild(button);
});

    //window.addEventListener("DOMContentLoaded", (event) => {
      //const button = document.createElement('button')
      //button.addEventListener('click', function(){
        //console.log("hi");
        //display_element.innerHTML = '';
        //jsPsych.finishTrial(trial_data);
    //  });
  
 // });
    // data saving
    var current_order = 0;
    var rows = 1;
    var columns = 4;
    var  currTile;
    var otherTile;
    var turns = 0;
    var rts = [];
    var a =[1,2];
    let stars_times = [];
    let move_time_1 = 0;
    let move_time_2 = 0;
    let move_time_3 = 0;
    let end_times = [];
    var actions = []; // Array to store user actions
    let init_locations = [];
    let moves = [];
    


    //const button = document.createElement('button')
      //button.innerText = 'Can you click me?'
      //'jspsych-free-sort-done-btn'


    function show_stimulus(order){
//      display_element.innerHTML = "<p style='font-family: monospace; font-size: 66px;'>" + create_moving_window(trial.words, position) + "</p>" 
      var start_time = performance.now();
       move_time_1 = start_time;
      stars_times.push(start_time);
      console.log('start time:', start_time);

      display_element.innerHTML = '<h2>Scrambled Pictures</h2>' +'<div id="pieces"></div>' +  '<h2>Correct Order</h2>' + 
      '<div id="board"></div>' +'<b> 1 &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 2 &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp  &nbsp &nbsp 3 &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp &nbsp 4 </b>'
      + '<div id= "btn1"></div>'; 
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // <img>
            let tile = document.createElement("img");
            tile.src = "images/blank.jpg";
            tile.addEventListener("dragstart", dragStart);

        }
      }

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            // <img>
            let tile = document.createElement("img");
            tile.src = "./images/blank.jpg";

            // DRAG FUNCTIONALITY
            tile.addEventListener("dragstart", dragStart);
            tile.addEventListener("dragover", dragOver);
            tile.addEventListener("dragenter", dragEnter);
            tile.addEventListener("dragleave", dragLeave);
            tile.addEventListener("drop", dragDrop);
            tile.addEventListener("dragend", dragEnd);

            document.getElementById("board").append(tile);
        }
        
    }

    // pieces
    let pieces = [];
    for (let i = 1; i <= rows * columns; i++) {
        pieces.push(i.toString());
    }
    pieces.reverse();
    for (let i = 0; i < pieces.length; i++) {
        let j = Math.floor(Math.random() * pieces.length);

        // swap
        let tmp = pieces[i];
        pieces[i] = pieces[j];
        pieces[j] = tmp;
    }
        a =[];
        
    for (let i = 0; i < pieces.length; i++) {
        let tile = document.createElement("img");
        tile.src = "./images/" + trial.stimuli[i] + ".jpg";
        tile.id = trial.stimuli[i];
        console.log(tile.id)
        


        


        // DRAG FUNCTIONALITY
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("pieces").append(tile);

        const rect = tile.getBoundingClientRect();
        init_locations.push({
    src: tile.src,
    x: Math.round(rect.x),
    y: Math.round(rect.y),
        });
        

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
  
  function dragLeave() {

  
    
  
  }
  
  function dragDrop() {
      otherTile = this;
      console.log(tile.id);
      moves.push({
        src: otherTile.src,
        x: Math.round(rect_2.x),
        y: Math.round(rect_2.y),
        move_time : move_time_3
      });

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
    var move_time_3 = move_time_2 - move_time_1;
    moves.push({
      src: otherTile.src,
      x: Math.round(rect_2.x),
      y: Math.round(rect_2.y),
      move_time : move_time_3
    });
          
    console.log(otherTile,rect_2.top, rect_2.right, rect_2.bottom, rect_2.left,);
    move_time_1 = move_time_2;
    move_time_3
    turns += 1;
    document.getElementById("turns").innerText = turns;

    // Save action
    actions.push({
        from: currTile.src,
        to: otherTile.src
    });

}

function displayActions() {
  let actionsContainer = document.getElementById("actions");
  for (let i = 0; i < actions.length; i++) {
      let action = actions[i];
      let actionText = document.createElement("p");
      actionText.textContent = "Move from: " + action.from + " to: " + action.to;
      actionsContainer.append(actionText);
  }
}



    //function after_response(response_info){
      //rt.push(response_info.rt);
    //}

    //function end_trial(){
      //trial_data.rt = JSON.stringify(rt);

      // clear the display
      //display_element.innerHTML = '';

      // end trial
      //jsPsych.finishTrial(trial_data);
   // }


  

    show_stimulus(current_order);    
  };




  return plugin;
})();
