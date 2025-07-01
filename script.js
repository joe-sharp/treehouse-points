const fallbackData = {
  points: {
    total: 19791,
    Ruby: 3794,
    JavaScript: 3128,
    Python: 2688,
    CSS: 1874,
    Databases: 1441,
    HTML: 1121,
    Design: 951,
    "Development Tools": 839,
    Security: 776,
    "Computer Science": 636,
    "21st Century Skills": 441,
    "Digital Literacy": 161
  }
};

// edit username here
$.ajax('https://teamtreehouse.com/joesharp.json')
  .done(function(data) {
    // pull was a success
    var items = [];
    $.each( data, function( key, val ) {
      if (key.toLowerCase() === 'points') {
        $.each(val, function( key2, val2 ) {
          if (val2 !== 0) {
            if (key2.toLowerCase() !== 'total') {
              items.push([key2,val2]);
            } else {
              $('strong.total').text(val2);
            }
          }
        });
      }
    });
    processAndDisplayData(items);
  })
  .fail(function() {
    var items = [];
    $.each(fallbackData.points, function(key, val) {
      if (val !== 0 && key.toLowerCase() !== 'total') {
        items.push([key, val]);
      } else if (key.toLowerCase() === 'total') {
        $('strong.total').text(val);
      }
    });
    processAndDisplayData(items);
  });

function processAndDisplayData(items) {
  // sort
  var sorted = [];
  if (items.length === 0) {
    sorted = items;
  } else {
    sorted = [items.shift()];
  }

  while (items.length > 0) {
    for (i = 0; i < sorted.length; i++) {
      if (items[0][1] > sorted[i][1]) {
        sorted.splice(i,0,items.shift());
        break;
      }
      if (i === sorted.length-1) {
        sorted.push(items.shift());
        break;
      }
    }
  }
  // make into html
  html = [];
  html.push("<ul>");
  for (s in sorted) {
    html.push("<li>");
    html.push("<em>" + sorted[s][0] + "</em>");
    html.push("<span>" + sorted[s][1]  + "</span>");
    html.push("</li>");
  }
  html.push("</ul>");

  // make legend
  $('.legend').append(html.join(""));

  // make pie
  createPie(".legend", ".pie");
}

function sliceSize(dataNum, dataTotal) {
  return (dataNum / dataTotal) * 360;
}

function addSlice(sliceSize, pieElement, offset, sliceID, color) {
  $(pieElement).append("<div class='slice "+sliceID+"'><span></span></div>");
  var offset = offset - 1;
  var sizeRotation = -179 + sliceSize;
  $("."+sliceID).css({
    "transform": "rotate("+offset+"deg) translate3d(0,0,0)"
  });
  $("."+sliceID+" span").css({
    "transform"       : "rotate("+sizeRotation+"deg) translate3d(0,0,0)",
    "background-color": color
  });
}

function iterateSlices(sliceSize, pieElement, offset, dataCount, sliceCount, color) {
  var sliceID = "s"+dataCount+"-"+sliceCount;
  var maxSize = 179;
  if(sliceSize<=maxSize) {
    addSlice(sliceSize, pieElement, offset, sliceID, color);
  } else {
    addSlice(maxSize, pieElement, offset, sliceID, color);
    iterateSlices(sliceSize-maxSize, pieElement, offset+maxSize, dataCount, sliceCount+1, color);
  }
}

function createPie(dataElement, pieElement) {
  var listNames = [];
  var listData = [];
  $(dataElement+" li").each(function() {
    listNames.push($(this).children('em').html());
    listData.push(Number($(this).children('span').html()));
  });

  var listTotal = 0;
  for(var i=0; i<listData.length; i++) {
    listTotal += listData[i];
  }

  var offset = 0;
  var colors = {};

  // Frontend
  colors['CSS'] = '#3659A2';
  colors['HTML'] = '#3659A2';
  colors['JavaScript'] = '#3659A2';
  // Backend
  colors['API'] = '#008297';
  colors['C#'] = '#008297';
  colors['Java'] = '#008297';
  colors['PHP'] = '#008297';
  colors['Python'] = '#008297';
  colors['Ruby'] = '#008297';
  // Design
  colors['Design'] = '#4A4290';
  // Data
  colors['Data Analysis'] = '#9F4B84';
  colors['Databases'] = '#9F4B84';
  // Fundamentals
  colors['21st Century Skills'] = '#9B3B5A';
  colors['Business'] = '#9B3B5A';
  colors['Computer Science'] = '#9B3B5A';
  colors['Development Tools'] = '#9B3B5A';
  colors['Digital Literacy'] = '#9B3B5A';
  colors['Learning Resources'] = '#9B3B5A';
  colors['Quality Assurance'] = '#9B3B5A';
  colors['Security'] = '#9B3B5A';
  // Experimental
  colors['Go'] = '#733A88';
  colors['Machine Learning'] = '#733A88';
  colors['Equity, Diversity, and Inclusion (EDI)'] = '#733A88';
  // Mobile
  colors['Android'] = '#30826C';
  colors['iOS'] = '#30826C';

  // Create array of objects with name, value, and color
  var items = listNames.map((name, idx) => ({
    name: name,
    value: listData[idx],
    color: colors[name] || '#000000'
  }));

  // Group items by color for pie chart
  var colorGroups = {};
  items.forEach(item => {
    if (!colorGroups[item.color]) {
      colorGroups[item.color] = [];
    }
    colorGroups[item.color].push(item);
  });

  // Create flattened array grouped by color
  var groupedItems = Object.values(colorGroups).flat();

  // Draw pie slices in color groups
  for(var i=0; i<groupedItems.length; i++) {
    var size = sliceSize(groupedItems[i].value, listTotal);
    iterateSlices(size, pieElement, offset, i, 0, groupedItems[i].color);
    offset += size;
  }

  // Set legend colors in original order
  for(var i=0; i<items.length; i++) {
    $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", items[i].color);
  }
}
