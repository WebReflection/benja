import gi
gi.require_version('Gtk', '3.0')
gi.require_version('WebKit2', '4.0')

from gi.repository import Gtk
from gi.repository import Gdk
from gi.repository import WebKit2

def onShow(widget):
  window.fullscreen()
  Gtk.main()

def onDestroy(widget):
  Gtk.main_quit()

Screen = Gdk.Screen.get_default()

webView = WebKit2.WebView()
webView.load_uri('http://google.com/')

wvSettings = webView.get_settings()
gtkSettings = Gtk.Settings.get_default()

window = Gtk.Window(
  title="Benja WebKitGTK+",
  type=Gtk.WindowType.TOPLEVEL,
  window_position=Gtk.WindowPosition.CENTER
)
window.set_default_size(
  Screen.get_width(),
  Screen.get_height()
)
window.connect('show', onShow)
window.connect('destroy', onDestroy)
window.add(webView)
window.show_all()