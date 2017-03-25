/*
Called when the item has been created, or when creation failed due to an error.
We'll just log success/failure here.
*/
function onCreated(n) {
  if (browser.runtime.lastError) {
    console.log(`Error: ${browser.runtime.lastError}`);
  } else {
    console.log("Item created successfully");
  }
}

var selectedItem = {
  since: "hour",
  dataTypes: ["history", "downloads"]
};

/*
Generic error logger.
*/
function onError(e) {
  console.error(e);
}

/*
Called when there was an error.
We'll just log the error here.
*/
function onError(error) {
  console.log(`Error: ${error}`);
}

/*
Forget browsing data, according to the settings passed in
*/
function forget(selectionItem) {

  /*
  Convert from a string to a time.
  The string is one of: "hour", "day", "week", "forever".
  The time is given in milliseconds since the epoch.
  */
  function getSince(selectedSince) {
    if (selectedSince === "forever") {
      return 0;
    }

    const times = {
      hour: () => { return 1000 * 60 * 60 },
      day: () => { return 1000 * 60 * 60 * 24 },
      week: () => { return 1000 * 60 * 60 * 24 * 7}
    }

    const sinceMilliseconds = times[selectedSince].call();
    return Date.now() - sinceMilliseconds;
  }

  /*
  Convert from an array of strings, representing data types,
  to an object suitable for passing into browsingData.remove().
  */
  function getTypes(selectedTypes) {
    let dataTypes = {};
    for (let item of selectedTypes) {
      dataTypes[item] = true;
    }
    return dataTypes;
  }

  const since = getSince(selectionItem.since);
  const dataTypes = getTypes(selectionItem.dataTypes);

  function notify() {
    let dataTypesString = Object.keys(dataTypes).join(", ");
    let sinceString = new Date(since).toLocaleString();
    browser.notifications.create({
      "type": "basic",
      "title": "Removed browsing data",
      "message": `Removed ${dataTypesString}\nsince ${sinceString}`
    });
  }

  browser.browsingData.remove({since}, dataTypes).then(notify);
}

/*
Create all the context menu items.
*/
browser.contextMenus.create({
  id: "last-hour",
  title: browser.i18n.getMessage("contextMenuItemLastHour"),
  contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
  id: "last-day",
  title: browser.i18n.getMessage("contextMenuItemLastDay"),
  contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
  id: "last-week",
  title: browser.i18n.getMessage("contextMenuItemLastWeek"),
  contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
  id: "forever",
  title: browser.i18n.getMessage("contextMenuItemForever"),
  contexts: ["all"]
}, onCreated);

browser.contextMenus.create({
  id: "separator-1",
  type: "separator",
  contexts: ["all"]
}, onCreated);

var checkedState = true;

browser.contextMenus.create({
  id: "check-uncheck-downloads",
  type: "checkbox",
  title: browser.i18n.getMessage("contextMenuItemUncheckDownloads"),
  contexts: ["all"],
  checked: checkedState
}, onCreated);


/*
Toggle checkedState, and update the menu item's title
appropriately.

Note that we should not have to maintain checkedState independently like
this, but have to because Firefox does not currently pass the "checked"
property into the event listener.
*/
function updateCheckUncheck() {
  checkedState = !checkedState;
  if (checkedState) {
    selectedItem.dataTypes = ["history", "downloads"];
    browser.contextMenus.update("check-uncheck-downloads", {
      title: browser.i18n.getMessage("contextMenuItemUncheckDownloads"),
    });
  } else {
    selectedItem.dataTypes = ["history"];
    browser.contextMenus.update("check-uncheck-downloads", {
      title: browser.i18n.getMessage("contextMenuItemCheckDownloads"),
    });
  }
}

/*
The click event listener, where we perform the appropriate action given the
ID of the menu item that was clicked.
*/
browser.contextMenus.onClicked.addListener(function(info, tab) {
  switch (info.menuItemId) {
    case "last-hour":
      selectedItem.since = "hour";
      forget(selectedItem);
      console.log("Hour history deleted");
      console.log(selectedItem);
      break;
    case "last-day":
      selectedItem.since = "day";
      forget(selectedItem);
      console.log("Last Day history deleted");
      console.log(selectedItem);
      break;
    case "last-week":
      selectedItem.since = "week";
      forget(selectedItem);
      console.log("Last Week history deleted");
      console.log(selectedItem);
      break;
    case "forever":
      selectedItem.since = "forever";
      forget(selectedItem);
      console.log("Forever history deleted");
      console.log(selectedItem);
      break;
    case "check-uncheck":
      updateCheckUncheck();
      console.log(selectedItem);
      break;
  }
});
