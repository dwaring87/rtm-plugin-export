# RTM-CLI Plugin Export

This repository is a plugin for [rtm-cli](https://github.com/dwaring87/rtm-cli).

This plugin exports the user's Remember the Milk tasks as a comma-delimited CSV file. 


## Command Usage

`rtm export [-o,--out file] [filter]`

The `--out` option can be used to specify the output file to write the exported 
tasks to.  If not provided, the CSV file will be printed to the console.

The `filter` argument can be used to filter the user's tasks using RTM's 
Advanced Search Syntax.

**Examples:**

`rtm export priority:1 AND status:incomplete` will export incomplete 
tasks with a priority of 1 to the console

`rtm export --out export.csv priority:1 AND status:incomplete` will 
export incomplete tasks with a priority of 1 to the file `export.csv`


## Plugin Usage & Installation

For more information on the plugin architecture installing a plugin, see the 
[rtm-cli Wiki](https://github.com/dwaring87/rtm-cli/wiki).
