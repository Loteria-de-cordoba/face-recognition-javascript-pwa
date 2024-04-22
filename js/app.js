if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
        for (const registration of registrations) {
            registration.unregister();
        }
    });
    navigator.serviceWorker.register('sw.js');
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
