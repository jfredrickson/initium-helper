function saveOptions(event) {
  event.preventDefault();
  var campsiteName = document.getElementById("campsiteName").value;
  var lootGold = document.getElementById("lootGold").checked;
  var lootRareItems = document.getElementById("lootRareItems").checked;
  chrome.storage.sync.set({
    campsiteName: campsiteName,
    lootGold: lootGold,
    lootRareItems: lootRareItems
  });
  window.close();
}

function loadOptions(event) {
  chrome.storage.sync.get({
    campsiteName: "Cub Scout Camp",
    lootGold: true,
    lootRareItems: true
  }, function (items) {
    document.getElementById("campsiteName").value = items.campsiteName;
    document.getElementById("lootGold").checked = items.lootGold;
    document.getElementById("lootRareItems").checked = items.lootRareItems;
  });
}

document.addEventListener("DOMContentLoaded", loadOptions);
document.getElementById("save").addEventListener("click", saveOptions);
