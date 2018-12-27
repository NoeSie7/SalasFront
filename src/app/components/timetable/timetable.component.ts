import { Component, OnInit, ViewChild  } from '@angular/core';
import { CalendarComponent } from 'ng-fullcalendar';
import { Options } from 'fullcalendar';
// import moment = require('moment');
import * as moment from 'moment';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.scss']
})
export class TimetableComponent implements OnInit {


  private calendarOptions: Options;
  private date: Date;

   @ViewChild(CalendarComponent) ucCalendar: CalendarComponent;

   constructor() {}

   ngOnInit() {

    const date = new Date();

     this.calendarOptions = {
        editable: true,
        eventLimit: true,
        header: {
          left: 'prev,next',
          center: 'title',
          right: '',
          // right: 'month,agendaWeek,agendaDay,listMonth'
        },
        events: [{
          id: '1',
          start: moment.duration('09:00:00'),
          title: 'Primer evento',
          eventColor: '#f4e842'
        },
        {
          id: '2',
          start: new Date(),
          title: 'Segundo evento',
          eventColor: '#f46541'
        },
        {
          id: '3',
          start: new Date(),
          end: date.setDate(date.getDate() + 1),
          title: 'Segundo evento'
        }],
        // eventColor: '#378006',
        defaultView: 'agendaWeek',
        locale: 'es',
         minTime: moment.duration('08:00:00'),
         maxTime: moment.duration('19:00:00'),


        //  businessHours: [
        //    {
        //      dow: [1, 2, 3, 4, 5],
        //      start: '08:00',
        //      end: '19:00'
        //    },
        //  ]
        // visibleRange: {
        //   start: '08:00',
        //   end: '19:00'
        // }

      };

      //  const el = {
      //    title: 'Nuevo event',
      //    start: '2018-12-27',
      //    };
      //    this.ucCalendar.fullCalendar('renderEvent', el);
      //  // this.ucCalendar.fullCalendar(); // .fullCalendar('renderEvent', el, true);
      //  this.ucCalendar.fullCalendar('rerenderEvents');



    //   this.eventService.getEvents().subscribe(data => {
    //     this.calendarOptions = {
    //       editable: true,
    //       eventLimit: false,
    //       header: {
    //         left: 'prev,next today',
    //         center: 'title',
    //         right: 'month,agendaWeek,agendaDay,listMonth'
    //       },
    //       selectable: true,
    //       events: [],
    //       };
    //   });
    // }
    // clearEvents() {
    //   this.events = [];
    // }
    //  loadEvents() {
    //    this.eventService.getEvents().subscribe(data => {
    //      this.events = data;
    //    });

  }

}
