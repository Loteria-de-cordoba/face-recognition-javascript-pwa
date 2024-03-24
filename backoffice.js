

function validarCampo(obj) {
    if (obj.val() != "") {
        obj.removeClass("is-invalid").addClass("is-valid");
    } else {
        obj.removeClass("is-valid").addClass("is-invalid");
    }
}

function validarDobleClave(obj1, obj2) {
    if (obj1.val() === obj2.val()) {
        obj1.removeClass("is-invalid").addClass("is-valid");
        obj2.removeClass("is-invalid").addClass("is-valid");
        // } else if (obj1.val() == '' || obj2.val() == '') {
        //     obj1.removeClass("is-valid").addClass("is-invalid");
        //     obj2.removeClass("is-valid").addClass("is-invalid");
    } else {
        obj1.removeClass("is-valid").addClass("is-invalid");
        obj2.removeClass("is-valid").addClass("is-invalid");
    }
}

function validarEmail(obj) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(obj.val())) {
        obj.removeClass("is-invalid").addClass("is-valid");
        // } else if (obj.val() == '') {
        //     obj.removeClass("is-valid").removeClass("is-invalid");
    } else {
        obj.removeClass("is-valid").addClass("is-invalid");
    }
}

async function cargarComponentes() {
    // await encenderCamara();
    await validarToken();
    // await getPersonas();
}


function validarToken() {
    x = function (x) {
        if (isTokenExpired()) {
            renovarToken();
        }
    }
    return y = x();
}

function getPersonas(page) {

    validarToken();

    var headers = new Headers();
    headers.append('accion', 'getPersonasPaginas');
    headers.append('token', token);
    headers.append('pagina', page);
    headers.append('cantidad_por_pagina', '10');

    fetch(url_personas, {
        method: 'POST',
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            //  console.log(data);
            if (data.ok && data.total > 0) {
                console.log(data); // Muestra la respuesta del servidor en la consola
                // const paginas = 1;
                // const pagina = 2;

                $(`#table-personas tbody`).empty();
                $.each(data.personas, function (key, value) {

                    $(`#table-personas`).append(`<tr>   
                            <td>${value.id_persona}</td>
                            <td><img src="../../images/${value.unique_id}.png" width="60px" height="50px"></td>
                            <td>${value.nombre}</td>
                            <td>${value.apellido}</td>                          
                            <td>${value.documento}</td>                   
                            <td>${value.email}</td>
                            <td>${value.legajo}</td>
                            <td><i class="fa-solid fa-trash" onclick="eliminarPersona('${value.unique_id}','${value.apellido}')"></i></td>                                           
                    </tr>`);
                });


                // ##########################################
                // Paginador ################################
                // http://josecebe.github.io/twbs-pagination/
                // ##########################################
                $(function () {
                    window.pagObj = $(`#pagination-personas`).twbsPagination({
                        // totalPages: paginas,
                        totalPages: data.paginas,
                        visiblePages: 10,
                        onPageClick: function (event, page) {
                            // onPageClick: function (event, page) {
                            console.info(page + ' (from options)');
                            getPersonas(page);
                        }
                        // }).on('page', function (event, page) {
                    }).on('page', function (event, page) {
                        console.info(page + ' (from event listening)');
                    });
                });

                // console.log("cargado " + tab);

            }

        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            Swal.fire('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.', 'error');
        });

}

function getRegistro(page) {

    validarToken();

    var headers = new Headers();
    headers.append('accion', 'getRegistroPaginas');
    headers.append('token', token);
    headers.append('pagina', page);
    headers.append('cantidad_por_pagina', '10');

    fetch(url_personas, {
        method: 'POST',
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            //  console.log(data);
            if (data.ok && data.total > 0) {
                console.log(data); // Muestra la respuesta del servidor en la consola
                // const paginas = 1;
                // const pagina = 2;

                $(`#table-registro tbody`).empty();
                $.each(data.registros, function (key, value) {

                    $(`#table-registro`).append(`<tr>   
                <td>${value.legajo}</td>
                <td>${value.nombre}</td>
                <td>${value.apellido}</td>                          
                <td>${value.tipo}</td>
                <td>${value.fecha}</td>
                </tr>`);
                });


                // ##########################################
                // Paginador ################################
                // http://josecebe.github.io/twbs-pagination/
                // ##########################################
                $(function () {
                    window.pagObj = $(`#pagination-registro`).twbsPagination({
                        // totalPages: paginas,
                        totalPages: data.paginas,
                        visiblePages: 10,
                        onPageClick: function (event, page) {
                            // onPageClick: function (event, page) {
                            console.info(page + ' (from options)');
                            getRegistro(page);
                        }
                        // }).on('page', function (event, page) {
                    }).on('page', function (event, page) {
                        console.info(page + ' (from event listening)');
                    });
                });

                // console.log("cargado " + tab);

            }

        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            Swal.fire('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.', 'error');
        });

}


function eliminarPersona(person, name) {

    validarToken();

    Swal.fire({
        title: `¿Confirmar elimar a ${name} ?`,
        text: 'Una vez enviado, no podrá modificar los datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            var headers = new Headers();
            headers.append('accion', 'eliminarPersona');
            headers.append('token', token);

            // var formData = new FormData();
            // formData.append('unique_id', person);

            const formData = {
                unique_id: person
            };

            fetch(url_personas, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            }).then(response => response.json())
                .then(data => {
                    //  console.log(data);
                    if (data.ok) {
                        console.log(data); // Muestra la respuesta del servidor en la consola
                        Swal.fire('¡Enviado!', 'La persona fue eliminada!!!.', 'success');
                        // Destruimos paginador
                        $('#pagination-personas').twbsPagination('destroy');
                        getPersonas(1);
                    } else {
                        Swal.fire('Error', data.msg, 'error');
                    }

                })
                .catch(error => {
                    console.error('Error al enviar el formulario:', error);
                    Swal.fire('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.', 'error');
                });
        }
    });

}

function getUsuarios(page) {

    validarToken();

    var headers = new Headers();
    headers.append('accion', 'getUsuariosPaginas');
    headers.append('token', token);
    headers.append('pagina', page);
    headers.append('cantidad_por_pagina', '10');

    fetch(url_usuarios, {
        method: 'POST',
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            //  console.log(data);
            if (data.ok && data.total > 0) {
                console.log(data); // Muestra la respuesta del servidor en la consola
                // const paginas = 1;
                // const pagina = 2;

                $(`#table-usuarios tbody`).empty();
                $.each(data.usuarios, function (key, value) {

                    $(`#table-usuarios`).append(`<tr>   
                <td>${value.id_usuario}</td>
                <td>${value.nombre}</td>
                <td>${value.apellido}</td>                          
                <td>${value.documento}</td>                   
                <td>${value.email}</td>
                <td><i class="fa-solid fa-trash" onclick="eliminarUsuario('${value.unique_id}','${value.apellido}')"></i></td>                                           
                </tr>`);
                });

                // ##########################################
                // Paginador ################################
                // http://josecebe.github.io/twbs-pagination/
                // ##########################################
                $(function () {
                    window.pagObj = $(`#pagination-usuarios`).twbsPagination({
                        // totalPages: paginas,
                        totalPages: data.paginas,
                        visiblePages: 10,
                        onPageClick: function (event, page) {
                            // onPageClick: function (event, page) {
                            console.info(page + ' (from options)');
                            getUsuarios(page);
                        }
                        // }).on('page', function (event, page) {
                    }).on('page', function (event, page) {
                        console.info(page + ' (from event listening)');
                    });
                });

                // console.log("cargado " + tab);

            }

        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            Swal.fire('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.', 'error');
        });

}

function eliminarUsuario(user, name) {

    validarToken();

    Swal.fire({
        title: `¿Confirmar elimar a ${name} ?`,
        text: 'Una vez enviado, no podrá modificar los datos.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then((result) => {
        if (result.isConfirmed) {

            var headers = new Headers();
            headers.append('accion', 'eliminarUsuario');
            headers.append('token', token);

            // var formData = new FormData();
            // formData.append('unique_id', person);

            const formData = {
                unique_id: user
            };

            fetch(url_usuarios, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(formData)
            }).then(response => response.json())
                .then(data => {
                    //  console.log(data);
                    if (data.ok) {
                        console.log(data); // Muestra la respuesta del servidor en la consola
                        Swal.fire('¡Enviado!', 'La persona fue eliminada!!!.', 'success');
                        // Destruimos paginador
                        $('#pagination-usuarios').twbsPagination('destroy');
                        getUsuarios(1);
                    } else {
                        Swal.fire('Error', data.msg, 'error');
                    }

                })
                .catch(error => {
                    console.error('Error al enviar el formulario:', error);
                    Swal.fire('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.', 'error');
                });
        }
    });

}

function agregarUsuario() {

    validarToken();

    if (!$("#email_user").hasClass("is-valid") || !$("#nombre_user").hasClass("is-valid") || !$("#apellido_user").hasClass("is-valid") || !$("#documento_user").hasClass("is-valid")) {
        console.log('no validado');
        return false;
    }

    headers = {
        accion: 'crearUsuario',
        token: token
    };

    variables = {
        email: $('#email_user').val(),
        apellido: $('#apellido_user').val(),
        nombre: $('#nombre_user').val(),
        documento: $("#documento_user").val()
    };

    $.ajax({
        type: "POST",
        url: url_usuarios,
        // url: 'index.php',
        data: JSON.stringify(variables),
        headers: headers,
        dataType: 'json'
    }).done(function (data) {
        // alert("Data Loaded: " + data);
        console.log(data);
        //var obj = jQuery.parseJSON(data);
        if (data.ok) {
            //console.log(data);
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Usuario guardado...',
                showConfirmButton: false,
                timer: 1500
            });
            $('#email_user').val('');
            $('#apellido_user').val('');
            $('#nombre_user').val('');
            $("#documento_user").val('');
            // Destruimos paginador
            $('#pagination-usuarios').twbsPagination('destroy');
            getUsuarios(1);


        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                footer: '<a href="">Why do I have this issue?</a>'
            })
        }
    }).fail(function () {
        alert("Error, no se pudo realizar la consulta!...");
    }).always(function () {
        // alert("finished");
    });

}

// $("#tab1-tab").on("click", function () {
//     // encenderCamara();
// });


$("#tab2-tab").on("show.bs.tab", function () { 
    console.log(`click`);
    // apagarCamara();
    getPersonas(1);
});

$("#tab3-tab").on("click", function () {
    // apagarCamara();
    getRegistro(1);
});

$("#tab4-tab").on("click", function () {
    // apagarCamara();
    $('#email_user').val('').removeClass("is-valid").removeClass("is-invalid");;
    $('#apellido_user').val('');
    $('#nombre_user').val('');
    $("#documento_user").val('');
    getUsuarios(1);
});

$("#tab5-tab").on("click", function () {
    // apagarCamara();
    $("#InputPassword1").val('').removeClass("is-valid").removeClass("is-invalid");
    $("#InputPassword2").val('').removeClass("is-valid").removeClass("is-invalid");
});


function validarEmail(obj) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(obj.val())) {
        obj.removeClass("is-invalid").addClass("is-valid");
    } else {
        obj.removeClass("is-valid").addClass("is-invalid");
    }
}

// // Acceso a la webcam
// function encenderCamara() {
//     return navigator.mediaDevices.getUserMedia({ video: true })
//         .then(function (stream) {
//             var video = document.getElementById('video');
//             video.srcObject = stream;
//             video.play();
//             console.log("Camara encendida!!!");
//         })
//         .catch(function (err) {
//             console.log("Ocurrió un error al acceder a la webcam: " + err);
//         });
// }

// function apagarCamara() {
//     const videoElement = document.getElementById('video');
//     const stream = videoElement.srcObject;
//     if (stream != null) {
//         const tracks = stream.getTracks();

//         tracks.forEach(function (track) {
//             track.stop();
//         });

//         videoElement.srcObject = null;
//         console.log("Camara apagada!!!");
//     }
// }


// // Captura de foto
// document.getElementById('captureBtn').addEventListener('click', function () {
//     var canvas = document.createElement('canvas');
//     var context = canvas.getContext('2d');
//     var video = document.getElementById('video');
//     canvas.width = video.videoWidth;
//     canvas.height = video.videoHeight;
//     context.drawImage(video, 0, 0, canvas.width, canvas.height);
//     var photo = canvas.toDataURL('image/png');
//     // Almacena la foto en el campo oculto
//     document.getElementById('capturedPhoto').value = photo;
//     // Muestra el indicador de fotografía
//     $('#photoIndicator').show();
//     // Muestra la foto en consola (base64)
//     console.log(photo);
// });

// Validación en tiempo real
$('#myForm input').on('input', function () {
    var isValid = this.checkValidity();
    $(this).addClass('was-validated');
    if (isValid) {
        $(this).removeClass('is-invalid').addClass('is-valid');
    } else {
        $(this).removeClass('is-valid').addClass('is-invalid');
    }
});

// Envío de formulario con SweetAlert confirmación
$('#myForm').submit(function (e) {
    e.preventDefault();

    // Verifica si se ha capturado una foto
    var capturedPhoto = document.getElementById('capturedPhoto').value;
    if (!capturedPhoto) {
        Swal.fire('Error', 'Por favor, capture una foto antes de enviar el formulario.', 'error');
        return;
    }

    if (this.checkValidity()) {
        Swal.fire({
            title: '¿Confirmar envío?',
            text: 'Una vez enviado, no podrá modificar los datos.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Sí, enviar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                var formData = new FormData(this);

                var nombre = $('#nombre').val();
                var apellido = $('#apellido').val();
                var documento = $('#documento').val();
                var email = $('#email').val();
                var legajo = $('#legajo').val();


                formData.append('foto', capturedPhoto);
                formData.append('nombre', nombre);
                formData.append('apellido', apellido);
                formData.append('documento', documento);
                formData.append('email', email);
                formData.append('legajo', legajo);


                var token = localStorage.getItem('CI-token');

                var headers = new Headers();
                headers.append('accion', 'crearPersona');
                headers.append('token', token);

                fetch(url_personas, {
                    method: 'POST',
                    headers: headers,
                    body: formData
                })
                    .then(response => response.json())
                    .then(data => {
                        if (data.ok) {
                            console.log(data); // Muestra la respuesta del servidor en la consola
                            Swal.fire('¡Enviado!', 'Los datos han sido enviados correctamente. Y la persona fue agregada con el siguiente ID: ' + data.id, 'success');
                            // Restablecer el formulario después de enviarlo
                            document.getElementById('myForm').reset();
                            $('#photoIndicator').hide(); // Oculta el indicador de fotografía
                            $('#myForm input').removeClass('was-validated is-valid is-invalid');
                            $('#capturedPhoto').val(''); // Borra las fotos capturadas

                            // } else if (data.msg == "Token expirado") {
                            //     renovarToken(token);
                            //     console.log(`Token renovado`);
                            //     $('#myForm').submit();
                        } else {
                            console.log(data.error)
                            Swal.fire('Error', `Persona ya ingresada`, 'error');
                        }
                    })
                    .catch(error => {
                        console.error('Error al enviar el formulario:', error);
                        Swal.fire('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.', 'error');
                    });
            }
        });
    } else {
        e.stopPropagation();
    }
    $(this).addClass('was-validated');
});

// Restablecer formulario y fotos
$('#resetBtn').on('click', function () {
    $('#myForm')[0].reset(); // Resetea el formulario
    $('#capturedPhoto').val(''); // Borra las fotos capturadas
    $('#photoIndicator').hide(); // Oculta el indicador de fotografía
    // Restablece el estado de validación y coloca el cursor sobre el campo de nombre
    $('#myForm input').removeClass('was-validated is-valid is-invalid');
    $('#nombre').focus();
});

function salir() {
        window.location.href = url_login;
}


function isMobile() {
    try {
        if (/Android|webOS|iPhone|iPad|iPod|pocket|psp|kindle|avantgo|blazer|midori|Tablet|Palm|maemo|plucker|phone|BlackBerry|symbian|IEMobile|mobile|ZuneWP7|Windows Phone|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        };
        return false;
    } catch (e) { console.log("Error in isMobile"); return false; }
}

function isTokenExpired() {
    token = localStorage.getItem('CI-token');
    const expiry = (JSON.parse(atob(token.split('.')[1]))).exp;
    return (Math.floor((new Date()).getTime() / 1000)) >= expiry;
}

function renovarToken() {

    var token = localStorage.getItem('CI-token');

    var headers = new Headers();
    headers.append('accion', 'renew');
    headers.append('token', token);

    return fetch(url_usuarios, {
        method: 'POST',
        headers: headers
    })
        .then(response => response.json())
        .then(data => {
            // console.log(data); // Muestra la respuesta del servidor en la consola
            localStorage.setItem('CI-token', data.token);
            // var token = localStorage.getItem('CI-token');
            token = data.token;
            Swal.fire('¡Enviado!', 'Token renovado.', 'success');
        })
        .catch(error => {
            console.error('Error al enviar el formulario:', error);
            Swal.fire('Error', 'Hubo un problema al enviar el formulario. Por favor, inténtelo de nuevo.', 'error');
        });
}

function modificarClave() {

    validarToken();

    headers = {
        accion: 'modificarPassword',
        token: token
    };

    variables = {
        password1: $('#InputPassword1').val(),
        password2: $('#InputPassword2').val()
    };

    $.ajax({
        type: "POST",
        //url: 'https://localhost/control-ingreso-salas/index.php',            
        url: url_usuarios,
        data: JSON.stringify(variables),
        headers: headers,
        dataType: 'json'
    }).done(function (data) {
        // alert("Data Loaded: " + data);
        console.log(data);
        //var obj = jQuery.parseJSON(data);
        if (data.ok) {
            Swal.fire({
                title: "Debera ingresar nuevamente!",
                // showDenyButton: true,
                // showCancelButton: true,
                confirmButtonText: "OK",
                // denyButtonText: `Don't save`
                icon: "info"
            }).then((result) => {
                /* Read more about isConfirmed, isDenied below */
                if (result.isConfirmed) {
                    window.location.href = `http://${server}/backend/api/login/`;
                    //   Swal.fire("Saved!", "", "success");
                    // } else if (result.isDenied) {
                    //   Swal.fire("Changes are not saved", "", "info");
                }
            });
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'No se pudo cambiar la clave!',
                // footer: '<a href="">Why do I have this issue?</a>'
            })
        }
    }).fail(function () {
        alert("Error, no se pudo realizar la consulta!...");
    }).always(function () {
        // alert("finished");
    });

}