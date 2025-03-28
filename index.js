document.addEventListener('DOMContentLoaded', function() {
    const buscarAleatorioBtn = document.getElementById('buscarAleatorio');
    const buscarPokemonBtn = document.getElementById('buscarPokemon');
    const inputNombrePokemon = document.getElementById('inputNombrePokemon');
    const nombrePokemonInput = document.getElementById('nombrePokemon');
    const cardPokemonContainer = document.getElementById('CardPokemon');
    const radiosBusqueda = document.querySelectorAll('input[name="buscarTipo"]');
    
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
            const pokemon = await respuesta.json();
            mostrarTarjetaPokemon(pokemon);
        } catch (error) {
            alert(error.message);
            console.error('Error:', error);
        }
    }

    function mostrarTarjetaPokemon(pokemon) {
        cardPokemonContainer.innerHTML = `
            <div class="card">
                <div class="card-header bg-primary text-white">
                    <h3 class="text-center">${capitalizar(pokemon.name)}</h3>
                    <h5 class="text-center">#${pokemon.id}</h5>
                </div>
                <div class="card-body text-center">
                    <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" 
                         alt="${pokemon.name}" class="img-fluid mb-3" style="max-height: 200px;">
                    
                    <div class="mb-3">
                        ${pokemon.types.map(tipo => `
                            <span class="badge rounded-pill me-1" style="background-color: ${colorTipo(tipo.type.name)}">
                                ${capitalizar(tipo.type.name)}
                            </span>
                        `).join('')}
                    </div>
                    
                    <div class="row">
                        <div class="col-md-6">
                            <p><strong>Altura:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
                            <p><strong>Peso:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
                        </div>
                        <div class="col-md-6">
                            <p><strong>Experiencia base:</strong> ${pokemon.base_experience}</p>
                            <p><strong>Habilidades:</strong> 
                                ${pokemon.abilities.slice(0, 2).map(ab => capitalizar(ab.ability.name)).join(', ')}
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

    function capitalizar(texto) {
        return texto.charAt(0).toUpperCase() + texto.slice(1);
    }
    
    function colorTipo(tipo) {
        const colores = {
            normal: '#A8A878', fire: '#F08030', water: '#6890F0',
            electric: '#F8D030', grass: '#78C850', ice: '#98D8D8',
            fighting: '#C03028', poison: '#A040A0', ground: '#E0C068',
            flying: '#A890F0', psychic: '#F85888', bug: '#A8B820',
            rock: '#B8A038', ghost: '#705898', dragon: '#7038F8',
            dark: '#705848', steel: '#B8B8D0', fairy: '#EE99AC'
        };
        return colores[tipo] || '#777';
    }

    window.mostrarDetallesPokemon = async function(id) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
            const pokemon = await response.json();
            const modal = new bootstrap.Modal(document.getElementById('modalPokemon'));
            
            document.getElementById('modalTitulo').textContent = `Detalles de ${capitalizar(pokemon.name)}`;
            
            document.getElementById('modalBody').innerHTML = `
                <div class="row">
                    <div class="col-md-6 text-center">
                        <img src="${pokemon.sprites.other['official-artwork']?.front_default || pokemon.sprites.front_default}" 
                             class="img-fluid mb-3" style="max-height: 200px;">
                        
                        <div class="d-flex justify-content-center gap-2 mb-3">
                            ${pokemon.types.map(t => `
                                <span class="badge rounded-pill" style="background-color: ${colorTipo(t.type.name)}">
                                    ${capitalizar(t.type.name)}
                                </span>
                            `).join('')}
                        </div>
                        
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Características</h5>
                                <p><strong>Altura:</strong> ${(pokemon.height / 10).toFixed(1)} m</p>
                                <p><strong>Peso:</strong> ${(pokemon.weight / 10).toFixed(1)} kg</p>
                                <p><strong>Experiencia base:</strong> ${pokemon.base_experience}</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="col-md-6">
                        <div class="card mb-3">
                            <div class="card-body">
                                <h5 class="card-title">Estadísticas</h5>
                                ${pokemon.stats.map(stat => `
                                    <div class="mb-2">
                                        <strong>${capitalizar(stat.stat.name)}:</strong> ${stat.base_stat}
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar" role="progressbar" 
                                                style="width: ${Math.min(100, stat.base_stat)}%; 
                                                background-color: ${statColor(stat.stat.name)}">
                                            </div>
                                        </div>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="card">
                    <div class="card-body">
                        <h5 class="card-title">Habilidades</h5>
                        <div class="d-flex flex-wrap gap-2">
                            ${pokemon.abilities.map(ab => `
                                <span class="badge bg-secondary">
                                    ${capitalizar(ab.ability.name)} ${ab.is_hidden ? '(Oculta)' : ''}
                                </span>
                            `).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            modal.show();
        } catch (error) {
            console.error('Error:', error);
            document.getElementById('modalBody').innerHTML = `
                <div class="alert alert-danger">
                    Error al cargar los detalles del Pokémon
                </div>
            `;
            const modal = new bootstrap.Modal(document.getElementById('modalPokemon'));
            modal.show();
        }
    };

    function statColor(stat) {
        const colors = {
            hp: '#FF5959', attack: '#F5AC78', defense: '#FAE078',
            'special-attack': '#9DB7F5', 'special-defense': '#A7DB8D',
            speed: '#FA92B2'
        };
        return colors[stat] || '#68A090';
    }

    window.colorTipo = colorTipo;
    window.capitalizar = capitalizar;
});