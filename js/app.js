if (navigator.serviceWorker) {

    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        var registrationslength = registrations.length;
        for (var i = 0; i < registrationslength; i++) {
            registrations[i].unregister();
        }
    }).then(navigator.serviceWorker.register('sw.js'));

}


// if ("serviceWorker" in navigator) {
//     navigator.serviceWorker
//       .register("/sw.js", { scope: "/" })
//       .then((registration) => {
//         // registration worked
//         console.log("Registration succeeded.");
//         registration.unregister().then((boolean) => {
//           // if boolean = true, unregister is successful
//         });
//       })
//       .catch((error) => {
//         // registration failed
//         console.error(`Registration failed with ${error}`);
//       });
//   }
