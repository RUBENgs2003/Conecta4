tablero = $('.tablero');
columna = $('.columna');

// Propiedades del tablero

ancho = tablero.width();
alto = tablero.height();

filas = 6;
columnas = 7;

ancho_casilla = (ancho / columnas) - 1;
alto_casilla = alto / filas;

casillas_jugador = [];
casillas_ia = [];
movs_criticos = []; // Movimientos que determinan la partida del jugador.
movs_criticos_IA = []; // Movimientos que determinan la partida del IA.


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
    manejador_IA(getMovimientosValidos(), movs_criticos, movs_criticos_IA);
}

function flecha(){
    
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
        manejador_IA(getMovimientosValidos(), movs_criticos, movs_criticos_IA);
    }
});

function obtener_casilla(col){

    for (let i = filas; i >= 1; i--) {

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

            fila_actual.data("disp", false); //Cambiamos disponibilidad
            comprobar_victoria(turno, nuevoMov); //Comprobamos victoria pasando paramatros el nuevo mov y el turno
            cambiar_turno(); //Cambiamos turno
            break;

        }

    }

}

function comprobar_victoria(jugador, mov){

    if(jugador){ //Jugador

        casillas_jugador.push(mov); //Añadimos el mov
        
        for(i = 0; i < casillas_jugador.length; i++){ //Navegamos por los movimientos realizados

            enraya = 1; //Iniciamos con 1 ficha en raya.
            coordX = casillas_jugador[i][0] - 1;
            coordY = casillas_jugador[i][1] + 1;

            for(x=0; x < 4; x++){ // Diagonal derecha

                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> JUG")
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0] - 1;
            coordY = casillas_jugador[i][1] - 1;

            for(x=0; x < 4; x++){ // Diagonal izquierda
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> JUG")
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0] - 1;
            coordY = casillas_jugador[i][1];

            for(x=0; x < 4; x++){ // Vertical
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> JUG")
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_jugador[i][0];
            coordY = casillas_jugador[i][1] - 1;

            for(x=0; x < 4; x++){ // Horizontal
                
                if($(`#${coordX}-${coordY}`).data("jugador") && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> JUG")
                        break;
                    }

                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos.push([coordX, coordY]);
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

            for(x=0; x < 4; x++){ // Diagonal derecha



                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> IA")
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY++; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0] - 1;
            coordY = casillas_ia[i][1] - 1;

            for(x=0; x < 4; x++){ // Diagonal izquierda
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> IA")
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.
                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0] - 1;
            coordY = casillas_ia[i][1];

            for(x=0; x < 4; x++){ // Vertical
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> IA")
                        break;
                    }

                    coordX--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

            enraya = 1; //Reiniciamos valor
            coordX = casillas_ia[i][0];
            coordY = casillas_ia[i][1] - 1;

            for(x=0; x < 4; x++){ // Vertical
                
                if($(`#${coordX}-${coordY}`).data("jugador") == false && coords_validadas(coordX, coordY)){ //Verificamos si en la diagonal hay una ficha del jugador

                    enraya++; //Sumamos 1 en raya.

                    if(enraya === 4){
                        console.log("GANADOR -> IA")
                        break;
                    }

                    coordY--; //Establecemos las siguientes coords.

                }else{
                    if (enraya === 3 && verificar_critico(getMovimientosValidos(), coordX, coordY)){ //Verificar_critico() verifica si ya está dentro de la matriz
                        movs_criticos_IA.push([coordX, coordY]);
                    }
                    enraya = 1;
                    break;
                }

            }

        }

    }
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

function manejador_IA(movs_disp, movs_criticos, movs_criticos_IA){
    if(movs_criticos.length >= 1){
        eleccion = Math.floor(Math.random() * movs_criticos.length);
        obtener_casilla(movs_criticos[eleccion][1]);
        movs_criticos.splice(eleccion);

    }else if(movs_criticos_IA.length >= 1){
        eleccion = Math.floor(Math.random() * movs_criticos_IA.length);
        obtener_casilla(movs_criticos_IA[eleccion][1]);
        movs_criticos_IA.splice(eleccion);
    
    }else{

        eleccion = Math.floor(Math.random() * movs_disp.length);
        obtener_casilla(movs_disp[eleccion][1]);

    }

}

function verificar_critico(movs_disp, x, y){

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