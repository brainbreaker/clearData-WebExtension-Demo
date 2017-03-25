# context-menu-demo

A demo of the [contextMenus API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/contextMenus/) and [browsingData API](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/browsingData).

**This add-on injects JavaScript into web pages. The `addons.mozilla.org` domain disallows this operation, so this add-on will not work properly when it's run on pages in the `addons.mozilla.org` domain.**

## What it does

This add-on adds several items to the browser's context menu, items is shown in all contexts:

* Clicking on 'Last Hour' clears browsing history from past hour.
* Clicking on 'Last Day' clears browsing history from past day.
* Clicking on 'Last Week' clears browsing history from past week.
* Clicking on 'Forever' clears your browsing history since the Earth came into existence :P.
* There is one checkbox item, separated by using 'separator item', which you can select where your want to clear your downloads data or not.
  If checked, it will clear your history as well as downloads data for any selection you make. 
  
Note that these buttons only work on normal web pages, not special pages
like about:debugging.

## What it shows

* How to create various types of context menu item:
  * normal
  * separator
  * checkbox
* How to use contexts to control when an item appears.
* How to update an item's properties.
* How to clear browsing data of user on click
