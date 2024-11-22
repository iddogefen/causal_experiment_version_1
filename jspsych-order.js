jsPsych.plugins["order"] = (function () {
  var plugin = {};

  plugin.info = {
    name: "order",
    parameters: {
      stimuli: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Stimuli",
        default: undefined,
        array: true,
        description: "Items to display in the task.",
      },
      button_label: {
        type: jsPsych.plugins.parameterType.STRING,
        pretty_name: "Button label",
        default: "Continue when done",
      },
    },
  };

  plugin.trial = function (display_element, trial) {
    let moves = []; // Track moves
    let tiles_id = []; // Track tile IDs

    // Show the stimuli layout
    show_stimulus(trial.stimuli);

    // Add "Click when done" button
    const button = document.createElement("button");
    button.innerHTML = trial.button_label;
    button.style.marginTop = "20px";
    display_element.appendChild(button);

    button.addEventListener("click", function () {
      // Collect data
      const final_positions = Array.from(
        document.querySelectorAll("#board img")
      ).map((img) => ({
        src: img.src,
        id: img.id,
      }));

      const trial_data = {
        moves: moves,
        final_positions: final_positions,
      };

      jsPsych.finishTrial(trial_data);
    });

    function show_stimulus(stimuli) {
      display_element.innerHTML = `
        <div>
          <h2 style="text-align: center; margin-bottom: 20px;">Scrambled Order</h2>
          <div id="pieces"></div>
        </div>
        <div style="margin-top: 20px;">
          <h2 style="text-align: center; margin-bottom: 20px;">Correct Order</h2>
          <div id="board"></div>
        </div>
      `;

      const piecesContainer = document.getElementById("pieces");
      const boardContainer = document.getElementById("board");

      // Dynamically adjust board layout
      boardContainer.style.display = "grid";
      boardContainer.style.gridTemplateColumns = `repeat(5, 1fr)`;
      boardContainer.style.gridGap = "10px";

      // Populate containers with images
      stimuli.forEach((stimulus, index) => {
        const img = document.createElement("img");
        img.src = `./images/${stimulus}.png`;
        img.draggable = true;
        img.style.width = "100px";

        // Add drag-and-drop functionality
        img.addEventListener("dragstart", dragStart);
        img.addEventListener("dragover", dragOver);
        img.addEventListener("dragenter", dragEnter);
        img.addEventListener("drop", dragDrop);
        img.addEventListener("dragend", dragEnd);

        if (index < 5) {
          piecesContainer.appendChild(img);
        } else {
          boardContainer.appendChild(img);
        }
      });
    }
  };

  return plugin;
})();
