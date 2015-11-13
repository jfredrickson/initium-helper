var options = {};

function loadOptions(event) {
  chrome.storage.sync.get(null, function (items) {
    options = items;
  });
}

/**
 * Adds a shortcut key (C) to the "Create a campsite here" button.
 */
function addCampsiteShortcut() {
  var campsiteLink = $("a:contains('Create a campsite here')")
  campsiteLink.attr("shortcut", "67"); // 67 is C
  var span = $("<span/>")
    .addClass("shortcut-key")
    .attr("title", "This indicates the keyboard shortcut to use to activate this button")
    .text("(C/K)");
  campsiteLink.append(span);
}

/**
 * Adds new shortcut keys.
 * L = Autoloot nearby gold and items according to autoloot options.
 * K = Immediately try to create a campsite with the default name (no campsite name prompt).
 */
function createShortcutKeys() {
  $("body").keydown(function (event) {
    // Only process keypresses that don't go to an input field.
    if (event.target.nodeName !== "INPUT") {
      if (event.which === 76 /* L */) {
        autoloot();
      }
      if (event.which === 75 /* K */) {
        window.location.href = "ServletCharacterControl?type=createCampsite&name=" + encodeURIComponent(options.campsiteName);
      }
    }
  });
}

/**
 * Patches the createCampsite() function to add a default campsite name.
 */
function monkeyPatchCreateCampsite() {
  var scriptPath = $("script[src^='/javascript/script.js']").attr("src");
  $.get(scriptPath, {}, function(response, status, xhr) {
    var patchedCreateCampsite = (function () {
      var oldPrompt = 'prompt("Provide a new name for your campsite:", "");'
      var newPrompt = 'prompt("Provide a new name for your campsite:", ' + options.campsiteName + ');'
      eval(response);
      return createCampsite.toString().replace(oldPrompt, newPrompt);
    })();
    var script = document.createElement("script");
    script.innerHTML = "createCampsite = " + patchedCreateCampsite + ";";
    document.body.appendChild(script);
  });
}

function autoloot() {
  if (options.lootRareItems) {
    $("#main-itemlist .main-item-container a.item-rare, #main-itemlist .main-item-container a.item-unique").closest("div").find(".main-item-controls a").each(function () {
      $(this)[0].click();
    });
  }
  setTimeout(function () {
    if (options.lootGold) {
      $("#main-characterlist .main-item-controls a:contains('gold')").each(function () {
        $(this)[0].click();
      });
    }
  }, 250);
}

$(document).ready(function () {
  loadOptions();
  addCampsiteShortcut();
  createShortcutKeys();
  if ($("a:contains('Create a campsite here')").length) {
    //monkeyPatchCreateCampsite();
  }
});
