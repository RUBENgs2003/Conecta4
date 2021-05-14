tablero = $('.tablero');
columna = $('.columna');

// Propiedades del tablero

columna_actual = 0; // Columna por defecto al inicio de la partida
reiniciado = false;

ancho = tablero.width();
alto = tablero.height();

filas = 6;
columnas = 7;

ancho_casilla = (ancho / columnas) - 1;
alto_casilla = alto / filas;

casillas_jugador = [];
casillas_ia = [];
movs_criticos = []; // Movimientos que determinan la partida del jugador.
movs_criticos_IA = []; // Movimientos que determinan la partida de la IA.
movs_med = []; // Movimientos que podrían determinar la partida del jugador.
movs_med_ia = []; // Movimientos que podrían determinar la partida de la IA.


$(".container-mano").width(ancho);

//Generar tablero

for($x=1; $x <= filas; $x++){

    fila = document.createElement('div');
    fila.className = 'fila';
    fila.id = $x;

    tablero.append(fila);

    for($y = 1; $y <= columnas; $y++){

        columna = document.createElement('div');
        columna.className = 'columna';
        columna.id = $y;

        fila.append(columna);

        circulo = document.createElement('div');
        circulo.className = 'circulo';
        circulo.id = `${$x}-${$y}`;

        columna.append(circulo)
    }
}

//Asignaciones

$(".arrow-img").width(ancho_casilla);
$(".arrow-img").height( (alto_casilla)* 0.8);

$(".fila").width(ancho);
$(".fila").height(alto_casilla);

$(columna).width(ancho_casilla);
$(columna).height(alto_casilla);

$(".circulo").width((ancho_casilla * 0.95));
$(".circulo").height((alto_casilla * 0.95));

$(".circulo").attr("data-disp", true);

$(window).resize(function() {

    // Propiedades del tablero
    ancho = tablero.width();
    alto = tablero.height();

    ancho_casilla = (ancho / columnas) - 1;
    alto_casilla = alto / filas;

    $(".container-mano").width(ancho);
  
    $(".arrow-img").width(ancho_casilla);
    $(".arrow-img").height((alto_casilla) * 0.8);

    $(".fila").width(ancho);
    $(".fila").height(alto_casilla);
    
    $(columna).width(ancho_casilla);
    $(columna).height(alto_casilla);

    $(".circulo").width((ancho_casilla * 0.95));
    $(".circulo").height((alto_casilla * 0.95));

});

// JUEGO

raton_tablero = false;

turno = false;

if(!turno){ //Comienzo del juego por parte de la IA
    manejador_IA(getMovimientosValidos(), movs_criticos, movs_criticos_IA, movs_med, movs_med_ia);
}

function cambiar_turno(){
    turno = !turno; // Turno -> jugador -- !Turno -> IA
}

$(tablero).on("mousemove", () => {

    width_window = $(window).width();
    inicial = width_window * 0.25;

    mouseX = window.event.clientX;
    columna_actual = (Math.trunc((mouseX - inicial) / ancho_casilla));

    if(columna_actual <= (columnas - 1)){
        $(".arrow-img").css("left", (ancho_casilla * columna_actual));
    }
});

tablero.on("click", () => {
    if(turno){
        obtener_casilla(columna_actual + 1, turno);
        manejador_IA(getMovimientosValidos(), movs_criticos, movs_criticos_IA, movs_med, movs_med_ia);
    }
});

function obtener_casilla(col){

    for (i=filas; i >= 1; i--) {

        fila_actual = $(`#${i}-${col}`); //Obtenemos fila actual

        if(fila_actual.data("disp")){
            nuevoMov = [i, col]; //Coords de la casilla del mov
            fila_actual.data("disp", false);

            if(turno){
                fila_actual.attr("data-jugador", true); //Añadimos el dato jugador
                fila_actual.addClass("jugador");
            }else{
                fila_actual.attr("data-jugador", false); //Añadimos el dato ia
                fila_actual.addClass("ia");
            }

            fila_actual.attr("data-disp", false); //Cambiamos disponibilidad
            comprobar_victoria(turno, nuevoMov); //Comprobamos victoria pasando paramatros el nuevo mov y el turno
            cambiar_turno(); //Cambiamos turno
            break;

        }

    }

}

function comprobar_victoria(jugador, mov){

    reiniciado = false;

    if(jugador){ //Jugador

        casillas_jugador.push(mov); //Añadimos el mov
        
        for(i = 0; i < casillas_jugador.length; i++){ //Navegamos por los movimientos realizados

            enraya = 1; //Iniciamos con 1 ficha en raya.
            coordX = casillas_jugador[i][0] - 1;
            coordY = casillas_jugador[i][1] + 1;

            for(x=0; x < 4; x++){ // Diagonal arriba derecha

                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Iniciamos con 1 ficha en raya.
            coordX = casillas_jugador[i][0] + 1;
            coordY = casillas_jugador[i][1] + 1;

            for(x=0; x < 4; x++){ // Diagonal abajo derecha (en pruebas) 

                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX++; //Establecemos las siguientes coords.
                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0] - 1;
            coordY = casillas_jugador[i][1] - 1;

            for(x=0; x < 4; x++){ // Diagonal arriba izquierda
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0] + 1;
            coordY = casillas_jugador[i][1] - 1;

            for(x=0; x < 4; x++){ // Diagonal abajo izquierda (en pruebas) 
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX++; //Establecemos las siguientes coords.
                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0] - 1;
            coordY = casillas_jugador[i][1];

            for(x=0; x < 4; x++){ // horizontal izquierda
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0] + 1;
            coordY = casillas_jugador[i][1];

            for(x=0; x < 4; x++){ // Horizontal derecha (en pruebas) 
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0];
            coordY = casillas_jugador[i][1] - 1;

            for(x=0; x < 4; x++){ // Vertical arriba 
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0];
            coordY = casillas_jugador[i][1] + 1;

            for(x=0; x < 4; x++){ // Vertical abajo (en pruebas) 
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

        }

    }else{ // IA - Enemigo

        casillas_ia.push(mov); //Añadimos el mov
        
        for(i = 0; i < casillas_ia.length; i++){ //Navegamos por los movimientos realizados

            enraya = 1; //Iniciamos con 1 ficha en raya.
            coordX = casillas_ia[i][0] - 1;
            coordY = casillas_ia[i][1] + 1;

            for(x=0; x < 4; x++){ // Diagonal arriba derecha



                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Iniciamos con 1 ficha en raya.
            coordX = casillas_ia[i][0] + 1;
            coordY = casillas_ia[i][1] + 1;

            for(x=0; x < 4; x++){ // Diagonal abajo derecha (en pruebas) 

                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX++; //Establecemos las siguientes coords.
                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0] - 1;
            coordY = casillas_ia[i][1] - 1;

            for(x=0; x < 4; x++){ // Diagonal arriba izquierda
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0] + 1;
            coordY = casillas_ia[i][1] - 1;

            for(x=0; x < 4; x++){ // Diagonal abajo izquierda (en pruebas) 
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX++; //Establecemos las siguientes coords.
                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0] - 1;
            coordY = casillas_ia[i][1];

            for(x=0; x < 4; x++){ // Horizontal izquierda
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0] + 1;
            coordY = casillas_ia[i][1];

            for(x=0; x < 4; x++){ // Horizontal derecha (en pruebas) 
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordX++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0];
            coordY = casillas_ia[i][1] - 1;

            for(x=0; x < 4; x++){ // Vertical arriba
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0];
            coordY = casillas_ia[i][1] + 1;

            for(x=0; x < 4; x++){ // Vertical abajo (en pruebas) 
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        victoria(jugador);
                        break;
                    }

                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    else if(enraya == 2 && verificar_med(getMovimientosValidos(), coordX, coordY)){
                        movs_med_ia.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

        }

    }

    reiniciado = true;

}

function coords_validadas(x, y){
    if((1 <= x && x <= 6) && (1 <= y && y <= 6)){ //Validamos que se encuentra en el tablero
        return true;
    }else{
        return false;
    }

}

function getMovimientosValidos(){
	posicionesValidas = [];
	for (b=1; b <= columnas; b++){
		for(c = filas; c >= 1; c--){
            fila_actual = $(`#${c}-${b}`); //Obtenemos fila actual
            if(fila_actual.data("disp")){
                posicionesValidas.push([c, b]);
                break;
            }
        }
    }
	return posicionesValidas;
}

function manejador_IA(movs_disp, movs_criticos, movs_criticos_IA, movs_med, movs_med_ia){ //Controlador e los movimientos de la IA

    if(movs_criticos.length >= 1){
        eleccion = Math.floor(Math.random() * movs_criticos.length);
        obtener_casilla(movs_criticos[eleccion][1]);
        movs_criticos.splice(eleccion);

    }else if(movs_criticos_IA.length >= 1){
        eleccion = Math.floor(Math.random() * movs_criticos_IA.length);
        obtener_casilla(movs_criticos_IA[eleccion][1]);
        movs_criticos_IA.splice(eleccion);
    
    }else if(movs_med.length >= 1){
        eleccion = Math.floor(Math.random() * movs_med.length);
        obtener_casilla(movs_med[eleccion][1]);
        movs_med.splice(eleccion);
    
    }else if(movs_med_ia.length >= 1){
        eleccion = Math.floor(Math.random() * movs_med_ia.length);
        obtener_casilla(movs_med_ia[eleccion][1]);
        movs_med_ia.splice(eleccion);
    
    }else{
        eleccion = Math.floor(Math.random() * movs_disp.length);
        obtener_casilla(movs_disp[eleccion][1]);
    }

}

function verificar_critico(movs_disp, x, y){ //Verifica si el critico se puede meter en el array

    if(turno){
        for(z = 0; z < movs_disp.length; z++){

            if((movs_disp[z][0] === x && movs_disp[z][1] === y)){
    
                for(a=0; a < movs_criticos.length; a++){
    
                    if(movs_criticos[a][0] === x && movs_criticos[a][1] === y){
                        return false;
                    }
    
                }
                return true;
            }
    
        }
        return false;

    }else{

        for(z = 0; z < movs_disp.length; z++){

            if((movs_disp[z][0] === x && movs_disp[z][1] === y)){
    
                for(a=0; a < movs_criticos_IA.length; a++){
    
                    if(movs_criticos_IA[a][0] === x && movs_criticos_IA[a][1] === y){
                        return false;
                    }
    
                }
                return true;
            }
    
        }
        return false; 

    }
}
function verificar_med(movs_disp, x, y){ // Verifica si el movimiento medio (posible peligro a largo plazo) se puede introducir en el array. 

    if(turno){
        for(g = 0; g < movs_disp.length; g++){

            if((movs_disp[g][0] === x && movs_disp[g][1] === y)){
    
                for(h=0; h < movs_med.length; h++){
    
                    if(movs_med[h][0] === x && movs_med[h][1] === y){
                        return false;
                    }
    
                }
                return true;
            }
    
        }
        return false;

    }else{

        for(g = 0; g < movs_disp.length; g++){

            if((movs_disp[g][0] === x && movs_disp[g][1] === y)){
    
                for(h=0; h < movs_med_ia.length; h++){
    
                    if(movs_med_ia[h][0] === x && movs_med_ia[h][1] === y){
                        return false;
                    }
    
                }
                return true;
            }
    
        }
        return false; 

    }
}

$('#ex1').on($.modal.BEFORE_CLOSE, function() { //Al cerrar el modal se reinicia el juego
    if(reiniciado){
        reiniciar_juego();
    }
});

function victoria(jugador){ //Enseñamos modal con el resultado de la partida

    if(jugador){

        $("#txt-title-modal").text("¡HAS GANADO!");

        $("#ex1").modal({
            fadeDuration: 250,
            fadeDelay: 0.80
        });

    }else{

        $("#txt-title-modal").text("¡HAS PERDIDO!");
        
        $("#ex1").modal({
            fadeDuration: 250,
            fadeDelay: 0.80
        });

    }

}

function reiniciar_juego(){ //Reinicia el juego

    $(".fila").remove();

    ancho = tablero.width();
    alto = tablero.height();

    filas = 6;
    columnas = 7;

    ancho_casilla = (ancho / columnas) - 1;
    alto_casilla = alto / filas;

    casillas_jugador = [];
    casillas_ia = [];
    movs_criticos = []; // Movimientos que determinan la partida del jugador.
    movs_criticos_IA = []; // Movimientos que determinan la partida de la IA.
    movs_med = []; // Movimientos que podrían determinar la partida del jugador.
    movs_med_ia = []; // Movimientos que podrían determinar la partida de la IA.

    for($x=1; $x <= filas; $x++){

        fila = document.createElement('div');
        fila.className = 'fila';
        fila.id = $x;
    
        tablero.append(fila);
    
        for($y = 1; $y <= columnas; $y++){
    
            columna = document.createElement('div');
            columna.className = 'columna';
            columna.id = $y;
    
            fila.append(columna);
    
            circulo = document.createElement('div');
            circulo.className = 'circulo';
            circulo.id = `${$x}-${$y}`;
    
            columna.append(circulo)
        }
    }

    
    $(".arrow-img").width(ancho_casilla);
    $(".arrow-img").height( (alto_casilla)* 0.8);

    $(".fila").width(ancho);
    $(".fila").height(alto_casilla);

    $(columna).width(ancho_casilla);
    $(columna).height(alto_casilla);

    $(".circulo").width((ancho_casilla * 0.95));
    $(".circulo").height((alto_casilla * 0.95));

    $(".circulo").attr("data-disp", true);

    
    raton_tablero = false;
    reiniciado = false;

    if(!turno){ //Comienzo del juego por parte de la IA
        manejador_IA(getMovimientosValidos(), movs_criticos, movs_criticos_IA, movs_med, movs_med_ia);
    }

}