const worker = new Worker("worker.js");
worker.postMessage({
    id:1,
    msg:'Hello World'
  }
);
worker.onmessage=function(message){
  const data = message.data;
  console.log(JSON.stringify(data));
	worker.terminate();
};
worker.onerror=function(error){
  console.log(error.filename,error.lineno,error.message);
}