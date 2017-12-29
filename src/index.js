var serviceType = "ssdp:all";

document.addEventListener('online',  () => {
  console.log("online");
  serviceDiscovery.getNetworkServices(serviceType, true, success, failure);
}, false);

document.addEventListener('offline',  () => {
  console.log("offline");
  serviceDiscovery.getNetworkServices(serviceType, true, success, failure);
}, false);
   var success = function(devices) {
       console.log(devices);
   }

   var failure = function() {
       alert("Error calling Service Discovery Plugin");
   }
