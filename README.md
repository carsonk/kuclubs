# KUClubs

Simple prototype of an application for tracking clubs, their members, and their
events. Final project for Database Systems.

## Tool Installation Links

* [Node and npm](https://nodejs.org/en/download/package-manager/)
* [Git](https://git-scm.com/)

## Usage

To install dependencies, run `npm install` from the command line.

To run the server, run `npm start` from the command line. Note that the latest
migration will be rolled back and re-run each time the server starts up.

## Notes

- The sqlite package comes with a simple migrations feature that's good for our
  purposes. Migrations are a quick and easy way to store database schema and
  keep them in source control. If the tool finds that you don't have a database
  created yet (which is ignored by Git), it will run the migrations from the
  beginning, in the order of the numbers in the filenames in the migrations
  folder. The gist is that the statements under the `--UP` comment get run when
  the migration is being installed, and the stuff under the `--DOWN` comment
  gets run when the migration is being rolled back (uninstalled).  

