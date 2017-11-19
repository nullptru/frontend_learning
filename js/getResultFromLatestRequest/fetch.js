
const requestContainer = () => {
    let  = new Date().getTime(); // mark init date using closure
    return () => {
        let localDateTime = new Date().getTime(); // mark request time
        datetime = localDateTime; // mark request as latest one
        setTimeout(() => {
            if (localDateTime === datetime) { // when result comes back and it's the latest request, run it
                console.log("This is the newest", datetime, localDateTime);
            }
        }, Math.random() * 3000 + 10);
    }
}
const request = requestContainer()
const main = () => {
    let k = 0
    let id = setInterval(() => {
        k += 1;
        if (k === 100) clearInterval(id);
        request();
    }, 10);
}

main();