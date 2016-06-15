#!/usr/bin/env jsgtk

const
  Gtk = require('Gtk'),
  Gdk = require('Gdk'),
  Application = function Application(events) {
    const app = new Gtk.Application();
    for (let key in events)
      app.connect(key, events[key].bind(this));
    this.application = app;
  }
;

new Application({
  startup: function() {
    const
      screen = Gdk.Screen.getDefault(),
      gtkSettings = Gtk.Settings.getDefault(),
      win = new Gtk.ApplicationWindow({
        application: this.application,
        title: 'benja OS',
        windowPosition: Gtk.WindowPosition.CENTER
      }),
      label = new Gtk.Label({}),
      ipAddress = new Gtk.Label({}),
      resolution = new Gtk.Label({}),
      grid = new Gtk.Grid({
        columnHomogeneous: true,
        marginTop: Math.round(screen.getHeight() * 35 / 100)
      })
    ;
    gtkSettings.gtkApplicationPreferDarkTheme = true;
    gtkSettings.gtkThemeName = 'Adwaita';
    label.setMarkup('<big><b>Benja OS</b></big>');
    ipAddress.setLabel(findReachableIPV4Address().join(', '));
    resolution.setMarkup([
      screen.getWidth(),
      screen.getHeight()
    ].join('x'));
    grid.attach(label, 0, 0, 1, 1);
    grid.attach(ipAddress, 0, 1, 1, 1);
    grid.attach(resolution, 0, 2, 1, 1);
    win.add(grid);
    win.setDecorated(false);
    win.maximize();
    win.fullscreen();
    win.setIconName('application-x-executable');
    this.applicationWindow = win;
  },
  activate: function () {
    this.applicationWindow.showAll();
  }
}).application.run([]);

function findReachableIPV4Address() {
  var
    ni = require('os').networkInterfaces(),
    out = []
  ;
  Object.keys(ni).forEach(function (key) {
    var ifaces = ni[key];
    ifaces.forEach(function (iface) {
      if (iface.family === 'IPv4' && iface.address !== '127.0.0.1') {
        out.push(iface.address);
      }
    });
  });
  return out;
}