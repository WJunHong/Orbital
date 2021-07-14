import "devextreme/dist/css/dx.common.css";
import "devextreme/dist/css/dx.dark.css";
import "../../App.css";
import Background from "../Background";
import TabName from "../TabName";
import app from "../../base";
import React, { useEffect, useState, useCallback } from "react";

import { Scheduler, View, Editing } from "devextreme-react/scheduler";
import { Slider } from "devextreme/ui/slider"
//import { appointments } from "./data.js";

function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [todos, setTodos] = useState([]);

  const getTodos = async () => {
    try {
      const user = app.auth().currentUser;
      const user_id = user.uid;
      // Calls the GET all tasks route method
      const response = await fetch("/todos", {
        method: "GET",
        headers: { user_id },
      });
      const jsonData = await response.json();
      setTodos(jsonData);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onAppointmentFormOpening = (data) => {
    data.popup.option("showTitle", true);
    data.popup.option(
      "title",
      data.appointmentData.text ? data.appointmentData.text : "Edit task"
    );

    const form = data.form;

    form.option('items', [
      {
        label: {
          text: 'Description'
        },
        editorType: 'dxTextBox',
        dataField: 'description',
        editorOptions: {
        }
      }, 
      {
        label: {
          text: 'Deadline'
        },
        editorType: 'dxDateBox',
        dataField: 'deadline'
      }, 
      {
        label: {
          text: 'Todo date'
        },
        editorType: 'dxDateBox',
        dataField: 'tododate'
      }, 
      {
        label: {
          text: 'Priority'
        },
        editorType: 'dxSelectBox',
        dataField: 'priority',
        editorOptions: {
          items: [1,2,3,4,5]
        }
      }, 
      {
        label: {
          text: 'Progress'
        },
        editorType: 'dxSlider',
        editorOptions: {
          value: data.progress,
        }
      }, 
      {
        label: {
          text: 'Properties'
        },
        editorType: 'dxTagBox',
        dataField: 'properties',
        editorOptions: {
            items: data.properties
        }
      }
    ]);
  };

  const handlePropertyChange = useCallback((e) => {
    if (e.name === "currentDate") {
      setCurrentDate(e.value);
    }
  }, []);
  useEffect(() => getTodos(), [todos]);
  return (
    <Background>
      <TabName name={"Calendar"} />
      <div className="calendarStyle">
        <Scheduler
          id="scheduler"
          dataSource={todos}
          textExpr="description"
          startDateExpr="tododate"
          allDayExpr="dayLong"
          recurrenceRuleExpr="recurrence"
          currentDate={currentDate}
          onOptionChanged={handlePropertyChange}
          width={1000}
          height={window.innerHeight - 250}
          defaultCurrentView="month"
          timeZone="UTC"
          adaptivityEnabled={true}
          maxAppointmentsPerCell="auto"
          onAppointmentFormOpening={onAppointmentFormOpening}
        >
          <View type="day" startDayHour={0} endDayHour={24} />
          <View type="week" startDayHour={0} endDayHour={24} />
          <View type="month" />
          <Editing allowTimeZoneEditing={true} allowDragging={true} />
        </Scheduler>
      </div>
    </Background>
  );
}

export default Calendar;
