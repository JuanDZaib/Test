document.addEventListener('DOMContentLoaded', function() {

    const busquedaAleatorioBtn = document.getElementById('buscarAleatorio');
    const busquedaNombreBtn = document.getElementById('buscarAleatorio'); 
    const inputNombrePokemon= document.getElementById('inputNombrePokemon');
    const nombrePokemon = document.getElementById('nombrePokemon');
    const CardPokemon= document.getElementById('CardPokemon');
    const buscarTipo= document.getElementById('buscarTipo');

    const modalPokemon = new bootstrap.Modal(document.getElementById('modalPokemon'));

    busquedaAleatorioBtn.addEventListener('click', busquedaAleatorioPokemon());
    busquedaNombreBtn.addEventListener('click', busquedaNombrePokemon());

    buscarTipo.forEach(radio => {
        radio.addEventListener('change', function() {
            nameInputGroup.style.display = this.value === 'name' ? 'flex' : 'none';
        });
    });
    
    function busquedaAleatorioPokemon() {
        const randomId = Math.floor(Math.random() * 150) + 1;
        fetchPokemon(randomId);
    }
    function busquedaNombrePokemon() {
        const name = nombrePokemon.value.trim().toLowerCase();
        if (name) {
            fetchPokemon(name);
        } else {
            alert('Por favor ingresa un nombre de Pokmon');
        }
    }

    

});