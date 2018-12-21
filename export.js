'use strict';

// Import rtm-cli to use the utility functions
const rtm = require('rtm-cli');
const api = require('rtm-api');
const fs = require('fs');


/**
 * Export Command
 * Print tasks in a machine-readable format
 * @param {Array} args List of command arguments
 * @param {Object} env Commander environment
 */
function action(args, env) {

  // Get filter
  let filter = rtm.filter(args.length > 0 ? args[0].join(' ') : '');

  // Get output file
  let out = env.out;

  // Get user
  rtm.config.user(function(user) {

    // Get Tasks
    user.tasks.get(filter, function (err, tasks) {
      if ( err ) {
        rtm.log.spinner.error("Could not get tasks (" + err.msg + ")");
        return rtm.finish();
      }

      // Process the Tasks
      let rtn = _processTasks(tasks);

      // Print the export
      _print(rtn, out, function() {

        // Exit
        rtm.finish();

      });
      
    });

  });

}


/**
 * Process the tasks and create a CSV string
 * @param tasks Tasks to export
 * @returns {string} CSV string to print / save
 * @private
 */
function _processTasks(tasks) {

  // String to print or write
  let rtn = "";

  // Set Header
  let header = [
    "index",
    "task_id",
    "taskseries_id",
    "list_id",
    "list_name",
    "name",
    "priority",
    "tags",
    "url",
    "isCompleted",
    "completed",
    "due",
    "created",
    "modified"
  ];
  rtn += _createLine(header);

  // Create each row
  for ( let i = 0; i < tasks.length; i++ ) {
    let task = tasks[i];
    let row = [
      task._index,
      task.task_id,
      task.taskseries_id,
      task.list_id,
      task.list.name,
      task.name,
      task.priority,
      task.tags.join(","),
      task.url !== undefined ? task.url : "",
      task.isCompleted,
      task.isCompleted ? task.completed : "",
      task.due !== undefined ? task.due : "",
      task.created,
      task.modified
    ];
    rtn += "\n";
    rtn += _createLine(row);
  }

  // Return the processed string
  return(rtn);


  // Build a CSV line: quote and join
  function _createLine(items) {
    for ( let i = 0; i < items.length; i++ ) {
      items[i] = '"' + items[i] + '"';
    }
    return(items.join(","));
  }

}


/**
 * Print the CSV string to console or file
 * @param csv CSV String
 * @param out Output file (undefined prints to console)
 * @param callback Callback function
 * @private
 */
function _print(csv, out, callback) {

  // Print to console
  if ( out === undefined ) {
    console.log(csv);
    return callback();
  }

  // Print to file
  else {

    // Write to output file
    fs.writeFile(out, csv, function(err) {
      if (err) {
        rtm.log.spinner.error("Could not write to file: " + err.toString());
        return callback();
      }

      rtm.log.spinner.success("Tasks exported to file: " + out);
      return callback();

    });
  }

}


/**
 * Define the command properties here
 */
module.exports = {

  /**
   * Command definition:
   * command name and argument definition
   */
  command: "export [filter...]",

  /**
   * Command options:
   * add option flags to the command
   */
  options: [
    {
      option: "-o, --out <file>",
      description: "output file to write tasks to"
    }
  ],

  /**
   * Command description:
   * short helpful description of the command
   */
  description: "Export tasks to a CSV file",

  /**
   * Command action:
   * the function called when executing the command
   */
  action: action

};