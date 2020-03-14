function getAudioAsNumbers(){

  var selectedFile = document.getElementById("myFile").files[0];
  var tp = selectedFile.type;

  if (tp.includes("audio")){
    var reader = new FileReader();

    reader.onload = function(e) {
      var arrayBuffer = e.target.result;

      audioCtx = new window.AudioContext();
      audioBuffer = audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
        data = buffer.getChannelData(0);

        var maxval = 0;
        for (i = 0; i < data.length; i++) {
          if (Math.abs(data[i]) > maxval) {maxval = data[i]};
        }

        var start;
        for (start = 0; start < data.length; start++) {
          if (Math.abs(data[start]) / maxval > 0.01){break};
        };

        const scale = (num, in_min, in_max, out_min, out_max) => {
          return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
        };

        var result = "";
        for (i = start; i < data.length && i - start < 30000; i++) {
          n = Math.min(Math.max( Math.floor(scale(data[i], -maxval, maxval, 0, 256)) , 0), 255);
          result += n + ", ";
        };

        result = result.slice(0, -2);

        document.getElementById("result").innerHTML = result;
        document.getElementById("result").style.display = "block";
        document.getElementById("copy").style.display = "block";
      });
    };
    reader.readAsArrayBuffer(selectedFile)
  }else {

    document.getElementById("result").innerHTML = "You didn't upload an audio file";
    document.getElementById("result").style.display = "block";
  };

};

// function copyText() {
//
//     var doc = document
//         , text = doc.getElementById("result")
//         , range, selection
//     ;
//     if (doc.body.createTextRange) {
//         range = document.body.createTextRange();
//         range.moveToElementText(text);
//         range.select();
//     } else if (window.getSelection) {
//         selection = window.getSelection();
//         range = document.createRange();
//         range.selectNodeContents(text);
//         selection.removeAllRanges();
//         selection.addRange(range);
//     }
// }

// $(function() {
//     $('#copyText').click(function() {
//         SelectText('selectThisText');
//     });
//    $('#selectThisText').click(function() {
//         SelectText('selectThisText');
//     });
// });

function copyText() {
  /* Get the text field */
  var copyText = document.getElementById("result");

  /* Select the text field */
  copyText.focus();
  copyText.select();
  document.execCommand('copy');
  //copyText.setSelectionRange(0, 99999); /*For mobile devices*/

  /* Copy the text inside the text field */
  //document.execCommand("copy");

  /* Alert the copied text */
  //alert("Copied the text: " + copyText.value);
};
