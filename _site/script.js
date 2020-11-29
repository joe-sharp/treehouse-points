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
  })
  .fail(function() {
    $('.team-treehouse > a > h2').text("Could not connect. Username my be incorrect.");
  })


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
  colors['Android'] = '#5cb860';
  colors['Business'] = '#f9845b';
  colors['CSS'] = '#3659a2';
  colors['Design'] = '#4a4290';
  colors['Development Tools'] = '#9b3b5a';
  colors['HTML'] = '#3659a2';
  colors['iOS'] = '#53bbb4';
  colors['Java'] = '#2c9676';
  colors['Javascript'] = '#3659a2';
  colors['PHP'] = '#7d669e';
  colors['Python'] = '#008297';
  colors['Ruby'] = '#008297';
  colors['WordPress'] = '#838cc7';
  colors['Digital Literacy'] = '#9b3b5a';
  colors['C#'] = '#9e4d83'; // added here down 17.09.22.sp
  colors['Databases'] = '#9F4B84';
  colors['Game Development'] = '#20898c';
  colors['Data Analysis'] = '#645a7e';
  colors['Security'] = '#9b3b5a';
  colors['Go'] = '#375eab';
  colors['APIs'] = '#993c50';
  colors['Virtual Reality'] = '#95D26C';
  colors['Quality Assurance'] = '#80438E';
  colors['Machine Learning'] = '#2D6853'; // 18.03.22.sp
  colors['Computer Science'] = '#9b3b5a';
  colors['21st Century Skills'] = '#9b3b5a';

  for(var i=0; i<listData.length; i++) {
    var size = sliceSize(listData[i], listTotal);
    var color = '#000000';
    for (var c in colors) {
      if (listNames[i].toLowerCase() === c.toLowerCase()) {
        color = colors[c];
      }
    }

    // make slices
    iterateSlices(size, pieElement, offset, i, 0, color);

    // set legend colors
    $(dataElement+" li:nth-child("+(i+1)+")").css("border-color", color);
    offset += size;
  }
}