console.log('*** scripts.js loaded ***');

// Spanish labels
var labelMonthNext = 'Mes siguiente';
var labelMonthPrev = 'Mes anterior';
var monthsFull = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
var monthsShort = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
var weekdaysFull = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
var weekdaysShort = ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'];
var weekdaysLetter = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

var initTimelineItemTooltips = function () {

  $('.timelineItem').each(function () {
    // for each timelineItem inits the tooltip
    var item = $(this);
    var itemId = item.attr('id');
    var tooltipContent = item.find('.tooltip-content').html();
    item.tooltip({
      delay: 30,
      tooltip: tooltipContent,
      html: true
    });
  });
};

$(document).ready(function () {
  // Loading
  setTimeout(function () {
    $('#preloader').fadeOut('slow');
  }, 1000);
  // END Loading
  //  Desplegable de búsqueda lateral
  $('.button-collapse').sideNav({
    menuWidth: 700,
    edge: 'right',
    closeOnClick: true,
    draggable: true,
    onOpen: function (el) {
      $('.search-icon').addClass('arrow');
    },
    onClose: function (el) {
      $('.search-icon').removeClass('arrow');
    },
  });
  // END Desplegable de búsqueda lateral

  $('#search-date-input').pickadate({
    selectMonths: true, // Creates a dropdown to control month
    selectYears: 5, // Creates a dropdown of 5 years to control year
    format: 'dd/mm/yyyy',
    formatSubmit: 'dd/mm/yyyy',
    closeOnSelect: true, // Close upon selecting a date
    // Spanish labels
    labelMonthNext: labelMonthNext,
    labelMonthPrev: labelMonthPrev,
    monthsFull: monthsFull,
    monthsShort: monthsShort,
    weekdaysFull: weekdaysFull,
    weekdaysShort: weekdaysShort,
    weekdaysLetter: weekdaysLetter,
    min: new Date(),
    today: 'Hoy',
    clear: false,
    close: 'Cerrar',
    // Sets default value on start
    onStart: function () {
      var date = new Date()
      this.set('select', [date.getFullYear(), date.getMonth(), date.getDate()]);
    },
    // Sets default value on start
    onSet: function (e) {
      var selectedValue = $('#search-date-input').val();
      $('#search-date-input').attr('value', selectedValue);
      if (e.select) {
        $('#search-date-button').click();
      }
    }
  });

  $("body").on("click", ".button-action-reserva", function () {
    $('#modalCrear').modal({
      dismissible: true, // Modal can be dismissed by clicking outside of the modal
      opacity: .5, // Opacity of modal background
      inDuration: 300, // Transition in duration
      outDuration: 200, // Transition out duration
      startingTop: '4%', // Starting top style attribute
      endingTop: '10%', // Ending top style attribute
      ready: function (modal, trigger) { // Callback for Modal open. Modal and trigger parameters available.

        $('#modalConfirmation').modal();

        $('input.autocomplete').autocomplete({
          onAutocomplete: function (val) {
            // Callback function when value is autcompleted.
          },
          minLength: 3 // The minimum length of the input for the autocomplete to start.
        });

        $('#search-date-reserva-input').pickadate({
          selectMonths: true, // Creates a dropdown to control month
          selectYears: 5, // Creates a dropdown of 5 years to control year
          format: 'dd/mm/yyyy',
          formatSubmit: 'dd/mm/yyyy',
          closeOnSelect: true, // Close upon selecting a date
          // Spanish labels
          labelMonthNext: labelMonthNext,
          labelMonthPrev: labelMonthPrev,
          monthsFull: monthsFull,
          monthsShort: monthsShort,
          weekdaysFull: weekdaysFull,
          weekdaysShort: weekdaysShort,
          weekdaysLetter: weekdaysLetter,
          min: new Date(),
          today: 'Hoy',
          clear: false,
          close: 'Cerrar',
          // Sets default value on start
          onStart: function () { },
          // Sets default value on start
          onSet: function (e) {
            var selectedValue = $('#search-date-reserva-input').val();
            $('#search-date-reserva-input').attr('value', selectedValue);
            $('#search-date-reserva-input').removeClass('invalid');
            if (e.select) {
              $('#search-date-reserva-button').click();
            }
          }
        });

        $('#search-date-desde-input').pickatime({
          format: 'HH:i',
          formatSubmit: 'HH:i',
          min: [8, 00],
          max: [19, 00],
          twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
          donetext: 'OK',
          autoclose: false,
          canceltext: 'CANCELAR',
          cleartext: 'LIMPIAR',
          vibrate: true // vibrate the device when dragging clock hand
        });

        $("#search-date-desde-input").on('change', function () {
          var selectedValue = $('#search-date-desde-input').val();
          $('#search-date-desde-input').attr('value', selectedValue);
          $('#search-date-desde-button').click();
        });

        $('#search-date-hasta-input').pickatime({
          format: 'HH:i',
          formatSubmit: 'HH:i',
          min: [8, 00],
          max: [19, 00],
          twelvehour: false, // change to 12 hour AM/PM clock from 24 hour
          donetext: 'OK',
          autoclose: false,
          canceltext: 'CANCELAR',
          cleartext: 'LIMPIAR',
          vibrate: true // vibrate the device when dragging clock hand
        });

        $("#search-date-hasta-input").on('change', function () {
          var selectedValue = $('#search-date-hasta-input').val();
          $('#search-date-hasta-input').attr('value', selectedValue);
          $('#search-date-hasta-button').click();
        });

      },
      complete: function () { }
    });

    $('#modalCrear').modal('open');
    $('#selector').material_select();
  });

  $("body").on("click", "#cerrarReserva, .discard", function (e) {
    $('#modalCrear').modal('close');
    let tupled = mappedAndTupledElements()
    tupled.map(function (index,pair) {return pair.snd == ''  ? pair.fst.classList.remove('active') : pair.fst;});
  });

  $("body").on("click",".picker__holder", function () {
    $('#search-date-reserva-input').removeClass('invalid');
  })

  $("body").on("input","#empleado",function (){
    let isEmptyinputExtension = $('#extension').text() == '';
    $(".toChangeClassOnJqOnDeleteUserInput").map(function (index,domElem){ return isEmptyinputExtension ? domElem.classList.remove("active") : domElem;});
  });

  $("body").on("click",".modal-overlay", function(){
    $(".discard").click();
  });


  function mappedAndTupledElements(){
    let inputToText = $('#rowAutocomplete').children().map(function (index,element){ return element.children[1].value;});
    let labels = $(".toChangeClassOnJqOnCloseSave");
    let tupled = labels.map(function (index,element){ return [{'fst': element, 'snd': inputToText[index]}];});
    return tupled;
  }
});
