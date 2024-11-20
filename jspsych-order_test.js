/*
 * jsPsych Plugin: Order Task
 * This plugin allows participants to reorder items through drag-and-drop interaction.
 */

jsPsych.plugins["order"] = (function() {
  var plugin = {};

  // Preload images for the plugin
  jsPsych.pluginAPI.registerPreload('order', 'stimuli', 'image');

  // Define plugin information and parameters
  plugin.info = {
    name: "order",
    parameters: {
      key: {
        type: jsPsych.plugins.parameterType.KEYCODE,
        default: 32 // Spacebar
      },
      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Stimuli',
        default: undefined,
        array: true,
        description: 'Items to be displayed.'
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: 'Button label',
        default: 'Continue',
        description: 'Text that appears on the button to proceed to the next trial.'
      },
    }
  };

  // Define the trial logic
  plugin.trial = function(display_element, trial) {
    var button = document.createElement("button");
    button.innerHTML = trial.button_label || "Click when done";
    button.id = "btn1";
    
    var body = document.getElementsByTagName("body")[0];
    body.appendChild(button);
    var finalImagePositions = [];

    // Variables for tracking trial data
    var initial_positions = [];
    var end_times = [];
    var turns = 0;
    var tiles_id = [];
    let stars_times = [];
    let moves = [];
    let move_time_1;

    // Button event to finish the trial
    button.addEventListener("click", function() {
      const end_time = performance.now();
      const rt = Math.round(end_time - stars_times[0]);

      // Collect final positions of images
      const images = document.querySelectorAll('#board img');
      finalImagePositions = Array.from(images).map(image => {
        const rect = image.getBoundingClientRect();
        return {
          src: image.src,
          x: Math.round(rect.x),
          y: Math.round(rect.y)
        };
      });

      // Prepare trial data
      const trial_data = {
        initial_locations: initial_positions,
        moves: moves,
        final_locations: finalImagePositions,
        number_of_moves: turns,
        rt: rt
      };

      // End trial and save data
      jsPsych.finishTrial(trial_data);
      body.removeChild(button);
    });

    // Function to show stimuli on the screen
    function show_stimulus() {
      // Record the start time of the trial
      const start_time = performance.now();
      stars_times.push(start_time);
      move_time_1 = start_time;

      // Set up the display
      display_element.innerHTML = `
        <h2>Scrambled Order</h2>
        <div id="pieces"></div>
        <h2>Correct Order</h2>
        <div id="board"></div>
      `;

      // Create the grid for scrambled items
      trial.stimuli.forEach((stimulus, i) => {
        let tile = document.createElement("img");
        tile.src = `./${stimulus}.png`;
        tile.id = stimulus;
        tiles_id.push(tile.id);

        // Record initial positions
        const rect = tile.getBoundingClientRect();
        initial_positions.push({
          id: stimulus,
          x: rect.x || 0,
          y: rect.y || 0
        });

        // Add drag-and-drop event listeners
        tile.addEventListener("dragstart", dragStart);
        tile.addEventListener("dragover", dragOver);
        tile.addEventListener("dragenter", dragEnter);
        tile.addEventListener("dragleave", dragLeave);
        tile.addEventListener("drop", dragDrop);
        tile.addEventListener("dragend", dragEnd);

        document.getElementById("pieces").appendChild(tile);
      });

      // Create a blank grid for the final arrangement
      for (let i = 0; i < trial.stimuli.length; i++) {
        let tile = document.createElement("img");
        tile.src = "./images/blank.jpg";
        document.getElementById("board").appendChild(tile);
      }
    }

    // Drag-and-drop event handlers
    let currTile, otherTile;

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
      if (currTile.src.includes("blank")) return;

      // Swap images
      const currImg = currTile.src;
      const otherImg = otherTile.src;
      currTile.src = otherImg;
      otherTile.src = currImg;

      // Record move data
      const rect = otherTile.getBoundingClientRect();
      const move_time_2 = performance.now();
      moves.push({
        src: otherTile.src,
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        move_time: Math.round(move_time_2 - move_time_1)
      });
      move_time_1 = move_time_2;

      // Increment turn counter
      turns++;
    }

    // Start the trial by showing the stimuli
    show_stimulus();
  };

  return plugin;
})();
