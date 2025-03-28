document.addEventListener('DOMContentLoaded', function() {

    const buscarAleatorioBtn = document.getElementById('buscarAleatorio');
    const buscarPokemonBtn = document.getElementById('buscarPokemon');
    const inputNombrePokemon = document.getElementById('inputNombrePokemon');
    const nombrePokemonInput = document.getElementById('nombrePokemon');
    const cardPokemonContainer = document.getElementById('CardPokemon');
    const radiosBusqueda = document.querySelectorAll('input[name="buscarTipo"]');
    
    const modalPokemon = new bootstrap.Modal(document.getElementById('modalPokemon'));

    buscarAleatorioBtn.addEventListener('click', buscarPokemonAleatorio);
    buscarPokemonBtn.addEventListener('click', buscarPorNombre);

    radiosBusqueda.forEach(radio => {
        radio.addEventListener('change', function() {
            inputNombrePokemon.style.display = this.value === 'nombre' ? 'flex' : 'none';
        });
    });

    function buscarPokemonAleatorio() {
        const idAleatorio = Math.floor(Math.random() * 150) + 1;
        obtenerPokemon(idAleatorio);
    }

    function buscarPorNombre() {
        const nombre = nombrePokemonInput.value.trim().toLowerCase();
        if (nombre) {
            obtenerPokemon(nombre);
        } else {
            alert('Por favor ingresa un nombre de Pokémon');
        }
    }

    async function obtenerPokemon(parametro) {
        try {
            const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${parametro}`);
            if (!respuesta.ok) {
                throw new Error('Pokémon no encontrado');
            }
            const datos = await respuesta.json();
            mostrarTarjetaPokemon(datos);
        } catch (error) {
            alert(error.message);
            console.error('Error:', error);
        }
    }

    function mostrarTarjetaPokemon(pokemon) {
        cardPokemonContainer.innerHTML = `
            <div class="card pokemon-card">
                <div class="card-header bg-primary text-white">
                    <h3 class="text-center">${capitalizarPrimeraLetra(pokemon.name)}</h3>
                    <h5 class="text-center">#${pokemon.id}</h5>
                </div>
                <div class="card-body text-center">
                    <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" 
                         alt="${pokemon.name}" class="img-fluid mb-3" style="max-height: 200px;">
                    
                    <div class="mb-3">
                        ${pokemon.types.map(tipo => `
                            <span class="badge rounded-pill me-1" style="background-color: ${obtenerColorTipo(tipo.type.name)}">
                                ${capitalizarPrimeraLetra(tipo.type.name)}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Altura:</strong> ${pokemon.height / 10} m</p>
                            <p><strong>Peso:</strong> ${pokemon.weight / 10} kg</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Experiencia base:</strong> ${pokemon.base_experience}</p>
                            <p><strong>Habilidades:</strong> 
                                ${pokemon.abilities.slice(0, 2).map(habilidad => 
                                    capitalizarPrimeraLetra(habilidad.ability.name)).join(', ')}
                            </p>
                        </div>
                    </div>
                    <button class="btn btn-info mt-2" onclick="mostrarDetallesPokemon(${pokemon.id})">
                        Ver detalles completos
                    </button>
                </div>
            </div>
        `;
    }
    function capitalizarPrimeraLetra(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    function obtenerColorTipo(tipo) {
        const coloresTipos = {
            normal: '#A8A878',
            fire: '#F08030',
            water: '#6890F0',
            electric: '#F8D030',
            grass: '#78C850',
            ice: '#98D8D8',
            fighting: '#C03028',
            poison: '#A040A0',
            ground: '#E0C068',
            flying: '#A890F0',
            psychic: '#F85888',
            bug: '#A8B820',
            rock: '#B8A038',
            ghost: '#705898',
            dragon: '#7038F8',
            dark: '#705848',
            steel: '#B8B8D0',
            fairy: '#EE99AC'
        };
        return coloresTipos[tipo] || '#777';
    }
    
    function obtenerColorEstadistica(estadistica) {
        const coloresEstadisticas = {
            hp: '#FF5959',
            attack: '#F5AC78',
            defense: '#FAE078',
            'special-attack': '#9DB7F5',
            'special-defense': '#A7DB8D',
            speed: '#FA92B2'
        };
        return coloresEstadisticas[estadistica] || '#68A090';
    }
    window.obtenerColorTipo = obtenerColorTipo;
    window.obtenerColorEstadistica = obtenerColorEstadistica;
    window.capitalizarPrimeraLetra = capitalizarPrimeraLetra;


async function mostrarDetallesPokemon(id) {
    try {
        const respuesta = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
        const pokemon = await respuesta.json();
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalPokemon'));
        
        document.getElementById('modalTitulo').textContent = `Detalles de ${capitalizarPrimeraLetra(pokemon.name)}`;
        
        let contenidoModal = `
               <div class="row">
                <div class="col-md-6 text-center">
                    <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" 
                         alt="${pokemon.name}" class="img-fluid mb-3">
                    
                    <h4>Tipos</h4>
                    ${pokemon.types.map(tipo => `
                        <span class="badge rounded-pill me-1" style="background-color: ${obtenerColorTipo(tipo.type.name)}">
                            ${capitalizarPrimeraLetra(tipo.type.name)}
                        </span>
                    `).join('')}
                    
                    <h4 class="mt-3">Habilidades</h4>
                    <ul class="list-group">
                        ${pokemon.abilities.map(habilidad => `
                            <li class="list-group-item">
                                ${capitalizarPrimeraLetra(habilidad.ability.name)}
                                ${habilidad.is_hidden ? '(Oculta)' : ''}
                            </li>
                        `).join('')}
                    </ul>
                    </div>
                
                   <div class="col-md-6">
                    <h4>Estadísticas</h4>
                    ${pokemon.stats.map(estadistica => `
                        <div class="mb-2">
                            <strong>${capitalizarPrimeraLetra(estadistica.stat.name)}:</strong> ${estadistica.base_stat}
                            <div class="progress">
                                <div class="progress-bar" role="progressbar" style="width: ${Math.min(100, estadistica.base_stat)}%; 
                                    background-color: ${obtenerColorEstadistica(estadistica.stat.name)}"></div>
                            </div>
                        </div>
                    `).join('')}
                    
                    <h4 class="mt-3">Movimientos</h4>
                    <div style="max-height: 150px; overflow-y: auto;">
                        <ul class="list-group">
                            ${pokemon.moves.slice(0, 10).map(movimiento => `
                                <li class="list-group-item">${capitalizarPrimeraLetra(movimiento.move.name)}</li>
                            `).join('')}
                            ${pokemon.moves.length > 10 ? '<li class="list-group-item">...</li>' : ''}
                        </ul>
                    </div>
                  </div>
              </div>
        `;
        
        document.getElementById('modalBody').innerHTML = contenidoModal;
        modal.show();
    } catch (error) {
        console.error('Error:', error);
        alert('Error al cargar los detalles del Pokemon');
    }
};
});