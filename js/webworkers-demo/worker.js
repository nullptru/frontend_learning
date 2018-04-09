onmessage = function(e) {
  console.log(e.data);
  console.log('Message received from main script');
  var workerResult = 'Result: ' + (e.data.msg);
  console.log('Posting message back to main script');
  postMessage(workerResult);
}