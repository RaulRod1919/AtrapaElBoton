(function () {
    'use strict';

    /*se llama la URL de la API*/
    const API_BASE = 'https://pokeapi.co/api/v2/pokemon/';
    const CACHE = {};

    /*utiliza la primera letra mayúscula de una cadena para hacer la busqueda*/
    function capitalize(s) {
        return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
    }

    function showLoading() {
        $('#poke-result').html('<p>Cargando...</p>');
    }/*solo muestra el cargando*/

    /*mensaje de error*/
    function showError(msg) {
        $('#poke-result').html('<p role="alert">Error: ' + $('<div>').text(msg).html() + '</p>');
    }

    //muestra la infor del pokemos, la pokecard digamos
    function renderPokemon(data) {
        if (!data) { showError('Respuesta inválida'); return; }

        const image = data.sprites && (data.sprites.other?.['official-artwork']?.front_default || data.sprites.front_default);
        const alt = image ? `Imagen de ${capitalize(data.name)} (pokémon)` : `Imagen no disponible para ${capitalize(data.name)}`;

        const types = data.types.map(t => capitalize(t.type.name)).join(', ');
        const abilities = data.abilities.map(a => capitalize(a.ability.name)).join(', ');
        const statsHtml = data.stats.map(s => `<li>${capitalize(s.stat.name)}: ${s.base_stat}</li>`).join('');

        const html = `
      <div class="poke-card" style="display:flex;gap:12px;align-items:center;">
        <div class="poke-img" style="width:140px;">
          ${image ? `<img src="${image}" alt="${alt}" style="max-width:100%;">` : '<div style="width:140px;height:140px;background:#eee;"></div>'}
        </div>
        <div class="poke-info" style="flex:1;">
          <h2>${capitalize(data.name)} <small>#${data.id}</small></h2>
          <p><strong>Tipos:</strong> ${types}</p>
          <p><strong>Habilidades:</strong> ${abilities}</p>
          <p><strong>Stats:</strong></p>
          <ul>${statsHtml}</ul>
        </div>
      </div>
    `;
        $('#poke-result').html(html);
    }

    function fetchPokemon(idOrName) {
        if (!idOrName) { showError('Ingrese un nombre o id válidos'); return; }

        const key = String(idOrName).toLowerCase();
        if (CACHE[key]) {
            renderPokemon(CACHE[key]);
            return;
        }

        showLoading();
        $.ajax({
            url: API_BASE + encodeURIComponent(key),
            method: 'GET',
            dataType: 'json',
            success: function (data) {
                CACHE[key] = data;
                renderPokemon(data);
            },
            error: function (jqXHR) {
                if (jqXHR.status === 404) showError('Pokémon no encontrado');
                else showError('Error al obtener datos (revisa la consola)');
                console.warn('PokeAPI error', jqXHR);
            }
        });
    }
    /*genera un id aleatorio*/
    function randomId() {
        const MAX = 1010;
        return Math.floor(Math.random() * MAX) + 1;
    }


    // Eventos de la interfaz
     $(function () {
        $('#poke-search').on('click', function () {
            const q = $('#poke-query').val().trim();
            fetchPokemon(q);
        });

        $('#poke-query').on('keydown', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                $('#poke-search').trigger('click');
            }
        });

        $('#poke-random').on('click', function () {
            fetchPokemon(randomId());
        });
    });

})();