#!/usr/bin/env node

var fs = require('fs');
var child_process = require('child_process');

if (process.platform === 'linux') {
  var rules_name = '85-tessel.rules';
  var dest = '/etc/udev/rules.d/' + rules_name;
  var rules = fs.readFileSync(__dirname + '/../install/' + rules_name);

  try {
    fs.writeFileSync(dest, rules);
  } catch (e) {
    if (e.code === 'EACCES') {
      console.log("Could not write to " + dest);
      console.log("Run `sudo t2 install-drivers`");
      process.exit(1);
    } else {
      throw e;
    }
  }
  console.log("udev rules installed to " + dest);


  var udevadm = child_process.spawn('udevadm', ['control', '--reload-rules']);
  udevadm.on('close', function (code) {
    if (code !== 0) {
      console.log("Error reloading udev");
      process.exit(code);
    } else {
      console.log("Done. Unplug and re-plug Tessel to update permissions.")
    }
  });
} else {
  console.log("No driver installation necessary.");
}
